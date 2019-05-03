// Classes
const { Writable } = require("stream");
const os = require("os");
const cluster = require("cluster");
const Task = require("../Task/Task.js")();
const debug = require("debug");

class StreamCluster extends Writable {

	constructor({ target, bachfile, callbackAddress, partition, nWorkers = os.cpus().length, max } = {}) {
		super({ highWaterMark: 1024 * 100 });

		this.debug = debug("master");
		this.bachfile = bachfile;
		this.target = target;
		this.callbackAddress = callbackAddress;
		this.tasks = [];

		this.callbackPort = 9001;
		this.roundRobin = 0;
		this.isListening = false;
		this.loadBalancers = this.spawnWorkers(nWorkers);
		this.nSockets = 0;
		this.remainder = Buffer.alloc(0);
		this.bytes = 0;
		this.maxSlaves = max;

		if (partition) this.setDesiredConcurrency(partition);
		else this.startMonitoring();
	}

	startMonitoring() {
		this.setDesiredConcurrency(1);

		setInterval(() => {
			const desiredSize = 65536, acceptableDelta = 1000;
			const diff = this._writableState.length - desiredSize;
			if (Math.abs(diff) < acceptableDelta) return; // we are in the sweet spot

			if (diff < 0) this.setDesiredConcurrency(this.tasks.length - 1); // there is less than desired in the buffer
			else this.setDesiredConcurrency(this.tasks.length + 1);  // there is more than desired in the buffer
		}, 1000);
	}

	setDesiredConcurrency(desiredNodes) {
		const set = () => {
			if (desiredNodes - this.tasks.length > 0) { // add nodes
				if (this.maxSlaves && desiredNodes > this.maxSlaves) desiredNodes = this.maxSlaves;
				for (let i = 0; i < desiredNodes - this.tasks.length; i++) this.addNode();
			}
			else { // remove nodes
				if (desiredNodes < 1) desiredNodes = 1;
				for (let i = 0; i < this.tasks.length - desiredNodes; i++) this.removeNode();
			}
		};

		if (this.isListening) set();
		else this.once("listening", () => set()); // wait for at least one lb to be listening
	}

	addNode() {
		const { bachfile, target } = this;
		const task = new Task({ bachfile, target });
		const env = { CALLBACK_ENDPOINT: `http://${this.callbackAddress}:${this.callbackPort}/${task.uuid}` };

		task.run({ bachfile, env }).catch(err => console.error(err));
		this.tasks.push(task);
	}

	removeNode() {
		const task = this.tasks.pop();
		return task.delete();
	}

	_write(chunk, encoding, callback) { // chunks are sections binary streams of tuples
		this.bytes += chunk.length;
		this.awaitWritableLoadBalancer()
			.then((worker) => {
				this.writeChunk({ worker, chunk, encoding, callback });
			})
			.catch(error => {
				throw error;
			});
	}

	writeChunk({ worker, chunk, encoding, callback }) {
		const delimiter = Buffer.from("\n"); // TODO: make this a parameter

		try {
			const index = chunk.lastIndexOf(delimiter);
			const buffer = Buffer.concat([this.remainder, chunk.slice(0, index)]);
			this.remainder = chunk.slice(index + delimiter.length, chunk.length); // maintain remainder

			const ok = worker.process.stdin.write(buffer, encoding);
			if (!ok) worker.process.stdin.once("drain", () => this.emit("lbDrain", worker));
			callback();
		}
		catch (e) {
			console.error(worker._writableState);
			console.error("write error", e);
		}

	}

	awaitWritableLoadBalancer() { // this is probably over complex and covers edge cases which do not exists
		const waitOnce = (event) => new Promise((resolve, reject) => {
			const timeout = setTimeout(reject, 2 * 60 * 1000);
			this.once(event, () => {
				clearTimeout(timeout);
				this.awaitWritableLoadBalancer().then(resolve).catch(reject);
			});
		});

		const writableWorker = this.getNextWorker();

		if (writableWorker) return Promise.resolve(writableWorker); // if worker is free return it
		else if (this.loadBalancers.length !== 0) return waitOnce("lbDrain"); // if there are some workers but everyone needs to drain
		else return waitOnce("lbReady"); // No workers yet, wait for one to open
	}

	getNextWorker() {
		if (this.loadBalancers.length === 0) return;

		// round robin each worker to see if they are ready to take input, check each worker once and if none, return null
		for (let i = 0; i < this.loadBalancers.length; i++) {
			this.roundRobin = (this.roundRobin + 1) % this.loadBalancers.length;
			const { needDrain } = this.loadBalancers[this.roundRobin].process.stdin._writableState;
			if (!needDrain) return this.loadBalancers[this.roundRobin];
		}
	}

	handleWorkerMessage(message) {
		switch (message.event) {
			case "listening": {
				this.isListening = true;
				this.emit("listening"); // each load balancer process will emit this once
				break;
			}
			case "downStreamRequest": {
				const { pid, taskId } = message;
				const task = this.getTask({ taskId });
				if (!task) return;

				task.debug(`downStreamRequest lb=${pid}`);
				// mark task as running - also maybe mark the pid owning the request
				break;
			}
			case "downStreamRequestEnd": {
				const { pid, taskId } = message;
				const task = this.getTask({ taskId });
				if (!task) return;

				task.debug(`downStreamRequestEnd lb=${pid}`);
				// restart task
				const env = { CALLBACK_ENDPOINT: `http://${this.callbackAddress}:${this.callbackPort}/${task.uuid}` };
				task.run({ bachfile: this.bachfile, env }).catch(err => console.error(err));

				break;
			}
			case "upStreamRequest": {
				const { pid, taskId } = message;
				const task = this.getTask({ taskId });
				if (!task) return;

				task.lbPid = pid; // used later when messaging LB to close upstream connection
				task.debug(`upStreamRequest lb=${pid}`);

				this.emit("lbReady");
				break;
			}
			case "upStreamRequestEnd": {
				const { pid, taskId } = message;
				const task = this.getTask({ taskId });
				if (!task) return;

				task.debug(`upStreamRequestEnd lb=${pid}`);
				break;
			}
			case "close": {
				const { pid, taskId } = message;
				const task = this.getTask({ taskId });
				if (!task) return;

				const lb = this.getLoadBalancer({ pid });

				task.debug(`close request lb=${pid} downStreamLbPid=${task.lbPid}`);
				lb.process.send({ event: "close", taskId });
				break;
			}
			case "config": {
				const { pid, taskId } = message;
				const task = this.getTask({ taskId });
				if (!task) return;

				task.debug(`config request lb=${pid}`);
				break;
			}
			case "heartbeat": {
				const { pid, taskId, cpu, mem } = message;
				const task = this.getTask({ taskId });

				if (!task) return; // if anything lingers
				task.debug(`cpu=${cpu}% mem=${mem}% lb-pid=${pid}`);
				break;
			}
		}
	}

	spawnWorkers(nWorkers) {
		cluster.setupMaster({
			exec: __dirname + "/modules/LoadBalancerWorker/LoadBalancerWorker.js",
			stdio: ["pipe", process.stdout, process.stderr, "ipc"]
		});

		return new Array(nWorkers).fill(null).map(() => {
			const worker = cluster.fork({ PORT: this.callbackPort, BACHFILE: JSON.stringify(this.bachfile) });
			worker.on("message", (message) => this.handleWorkerMessage(message));
			return worker;
		});
	}

	getTask({ taskId }) {
		const taskIndex = this.tasks.findIndex(({ uuid }) => uuid === taskId);
		return this.tasks[taskIndex];
	}

	getLoadBalancer({ pid }) {
		const index = this.loadBalancers.findIndex((lb) => lb.process.pid === pid);
		return this.loadBalancers[index];
	}

}

module.exports = StreamCluster;
