const { Writable } = require("stream");
const os = require("os");

class LoadBalancer extends Writable {
	constructor(options = {}, { cluster = require("cluster") } = {}) {
		super({ highWaterMark: 4e6 });

		cluster.setupMaster({
			exec: __dirname + "/modules/LoadBalancerWorker/LoadBalancerWorker.js",
			stdio: ["pipe", process.stdout, process.stderr, "ipc"]
		});

		const {
			nWorkers = os.cpus().length,
			PORT = 9001
		} = options;

		const workers = new Array(nWorkers).fill(null).map(() => cluster.fork({ PORT }));
		workers.forEach(worker => {
			worker.on("message", (message) => this.handleWorkerMessage(message));
		});

		this.PORT = PORT;
		this.roundRobin = 0;
		this.isListening = false;
		this.workers = workers;
		this.bytesProxied = 0;
		this.remainder = Buffer.alloc(0);
	}

	_write(chunk, encoding, callback) { // chunks are sections binary streams of tuples
		//TODO: this needs to hold the end of the buffer back to guarantee completeness of chunks
		this.bytesProxied += chunk.length;
		this.awaitWritableWorker()
			.then((worker) => {
				this.writeChunk({ worker, chunk, encoding, callback });
			})
			.catch(error => {
				throw error;
			});
	}

	writeChunk({ worker, chunk, encoding, callback }) {
		const delimiter = Buffer.from("\n");

		try {
			const index = chunk.lastIndexOf(delimiter);
			const buffer = Buffer.concat([this.remainder, chunk.slice(0, index)]);
			this.remainder = chunk.slice(index + delimiter.length, chunk.length);

			const ok = worker.process.stdin.write(buffer, encoding, callback);
			if (!ok) worker.process.stdin.once("drain", () => this.emit("workerDrain", worker));
		}
		catch (e) {
			console.log(worker._writableState);
			console.log("write error", e);
		}

	}

	awaitWritableWorker() { // this is probably over complex and covers edge cases which do not exists
		const waitForEvent = (event) => new Promise((resolve, reject) => {
			const timeout = setTimeout(reject, 3 * 60 * 1000);
			this.once(event, () => {
				clearTimeout(timeout);
				this.awaitWritableWorker().then(resolve).catch(reject);
			});
		});

		const writableWorker = this.getNextWorker();

		if (writableWorker) return Promise.resolve(writableWorker); // back pressure load balancing
		else if (this.workers.length !== 0) return waitForEvent("workerDrain"); // if there are some sockets
		else return waitForEvent("workerOpen");
	}

	getNextWorker() {
		if (this.workers.length === 0) return;

		// round robin each worker to see if they are ready to take input, check each worker once and if none, return null
		for (let i = 0; i < this.workers.length; i++) {
			this.roundRobin = (this.roundRobin + 1) % this.workers.length;
			const { needDrain } = this.workers[this.roundRobin].process.stdin._writableState;
			if (!needDrain) return this.workers[this.roundRobin];
		}
	}

	_final(callback) {
		console.log("LoadBalancer._final(callback)");

		// this is called when input pipe has finished - NOT when the tcp pipes are done
		this.workers.forEach(worker => worker.process.stdin.end()); // send end of stream to tasks
		Promise.all(this.workers.map(worker => new Promise(resolve => worker.on("exit", resolve))))
			.then(() => {
				console.log("workers closed");
				console.log(this.bytesProxied / 1e6);
				this.emit("close");
				callback();
			})
			.catch(err => {
				console.error(err);
				callback();
			});
	}

	handleWorkerMessage(message) {
		if (message.event === "listening") {
			this.isListening = true;
			this.emit("listening");
		}
	}
}

module.exports = LoadBalancer;
