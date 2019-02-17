const { Writable } = require("stream");
const os = require("os");
const start = Date.now();

class LoadBalancer extends Writable {
	constructor(options = {}, { cluster = require("cluster") } = {}) {
		super();

		cluster.setupMaster({
			exec: __dirname + "/modules/LoadBalancerWorker/LoadBalancerWorker.js",
			stdio: ["pipe", process.stdout, process.stderr, "ipc"]
		});

		const {
			nWorkers = os.cpus().length, // default to number of logical processors
			PORT = 9001
		} = options;

		const workers = new Array(nWorkers).fill(null).map(() => cluster.fork({ PORT }));
		workers.forEach(worker => {
			worker.on("message", (message) => this.handleWorkerMessage(message));
		});

		// this.on("socketOpen", () => console.error("socketOpen"));

		this.PORT = PORT;
		this.roundRobin = 0;
		this.isListening = false;
		this.workers = workers;
		this.activeWorkers = [];
		this.bytesProxied = 0;
		this.nSockets = 0;
		this.remainder = Buffer.alloc(0);
	}

	_write(chunk, encoding, callback) { // chunks are sections binary streams of tuples
		this.bytesProxied += chunk.length; // count total just for reporting purposes

		this.awaitWritableWorker()
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
			if (!ok) worker.process.stdin.once("drain", () => this.emit("workerDrain", worker));
			callback();
		}
		catch (e) {
			console.error(worker._writableState);
			console.error("write error", e);
		}

	}

	awaitWritableWorker() { // this is probably over complex and covers edge cases which do not exists
		const waitOnce = (event) => new Promise((resolve, reject) => {
			const timeout = setTimeout(reject, 2 * 60 * 1000);
			this.once(event, () => {
				clearTimeout(timeout);
				this.awaitWritableWorker().then(resolve).catch(reject);
			});
		});

		const writableWorker = this.getNextWorker();

		if (writableWorker) return Promise.resolve(writableWorker); // if worker is free return it
		else if (this.activeWorkers.length !== 0) return waitOnce("workerDrain"); // if there are some workers but everyone needs to drain
		else return waitOnce("workerOpen"); // No workers yet, wait for one to open
	}

	getNextWorker() {
		if (this.activeWorkers.length === 0) return;

		// round robin each worker to see if they are ready to take input, check each worker once and if none, return null
		for (let i = 0; i < this.activeWorkers.length; i++) {
			this.roundRobin = (this.roundRobin + 1) % this.activeWorkers.length;
			const { needDrain } = this.activeWorkers[this.roundRobin].process.stdin._writableState;
			if (!needDrain) return this.activeWorkers[this.roundRobin];
		}
	}

	_final(callback) {

		// this is called when input pipe has finished - NOT when the tcp pipes are done
		const workers = this.workers.concat(this.activeWorkers);
		workers.forEach(worker => worker.process.stdin.end()); // send end of stream to tasks
		Promise.all(workers.map(worker => new Promise(resolve => worker.on("exit", resolve))))
			.then(() => {
				const diff = Date.now() - start;
				console.error(`${Math.round(((this.bytesProxied / 1e6) * 8 * 1000) / diff)} mb/s`);
				// this.emit("close");
				callback();
			})
			.catch(err => {
				console.error(err);
				callback();
			});
	}

	handleWorkerMessage(message) {
		switch (message.event) {
			case "listening": {
				this.isListening = true;
				this.emit("listening");
				break;
			}
			case "socketOpen": {
				const workerIndex = this.workers.findIndex((worker) => worker.process.pid === message.pid);
				if (workerIndex !== -1) {
					this.activeWorkers.push(this.workers[workerIndex]);
					this.workers.splice(workerIndex, 1);
				}
				this.nSockets++;
				this.emit("workerOpen");
				console.error(`PID:${message.pid} - SOCKET:${this.nSockets}`);
				break;
			}
		}
	}
}

module.exports = LoadBalancer;
