const StorageReadable = require("./StorageReadable");
const System = require("./System/System");

class Mapper {
	constructor(
		{ CALLBACK_ENDPOINT, DATA_URI, DATA_START, DATA_END, BINARY, ARGS },
		{ request = require("request-promise-native"), childProcess = require("child_process") } = {}
	) {
		this.CALLBACK_ENDPOINT = CALLBACK_ENDPOINT;
		this.DATA_URI = DATA_URI;
		this.DATA_START = DATA_START;
		this.DATA_END = DATA_END;
		this.BINARY = BINARY;
		this.ARGS = ARGS;
		this.request = request;
		this.childProcess = childProcess;

		this.system = new System();
	}

	readStorage() {
		return new StorageReadable({ DATA_URI: this.DATA_URI, DATA_START: this.DATA_START, DATA_END: this.DATA_END });
	}

	openCallback() {
		const options = {
			method: "POST",
			uri: `${this.CALLBACK_ENDPOINT}/callback`
		};

		return this.request(options);
	}

	sendCloseRequest(bytesConsumed) {
		const options = {
			method: "POST",
			uri: `${this.CALLBACK_ENDPOINT}/close`,
			headers: {
				consumed: bytesConsumed.toString()
			}
		};

		return this.request(options);
	}

	run() {
		const storageStream = this.readStorage();
		const callbackStream = this.openCallback();

		setInterval(() => this.heartbeat(storageStream.bytesRead), 10 * 1000);

		// setTimeout(() => {
		// 	// this is preemption (only for testing)
		// 	storageStream.preempt();
		// }, 400);
		process.on("SIGTERM", () => {
			console.log("SIGTERM");
			storageStream.preempt();
		});
		process.on("SIGINT", () => {
			console.log("SIGINT");
			storageStream.preempt();
		});

		const options = { stdio: ["pipe", "pipe", "pipe"] }; // share STDERR with this parent process
		const child = this.childProcess.spawn(this.BINARY, this.ARGS, options);

		child.on("error", process.stderr.write);

		storageStream.pipe(child.stdin);
		child.stdout.pipe(callbackStream);

		child.on("exit", () => {
			console.log("child on exit");
			// callbackStream.end();
			// process.exit(0);
		});

		callbackStream.on("end", () => {
			console.log("callbackStream on end", storageStream.bytesRead);
			this.sendCloseRequest(storageStream.bytesRead)
				.then(() => process.exit(0))
				.catch(error => {
					console.error(error);
					process.exit(1);
				});
		});

		callbackStream.on("close", (hadError) => {
			if (hadError) process.exit(1);
		});
	}

	heartbeat(progress) {
		const { cpuUsage: cpu, memUsage: mem } = this.system.getPercentages(this.system.record());

		this.request({
			uri: `${this.CALLBACK_ENDPOINT}/heartbeat`,
			headers: { progress, cpu, mem },
			json: true
		})
			.catch(error => {
				console.error("heartbeat failed", error);
				process.exit(1);
			});
	}
}

module.exports = Mapper;
