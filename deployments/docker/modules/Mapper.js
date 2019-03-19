const StreamByteCounter = require("./StreamByteCounter");

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
	}

	readStorage() {
		const options = {
			method: "GET",
			uri: this.DATA_URI,
			headers: {
				range: `bytes=${this.DATA_START}-${this.DATA_END}`
			}
		};

		return this.request(options);
	}

	openCallback() {
		const options = {
			method: "POST",
			uri: `${this.CALLBACK_ENDPOINT}/callback`
		};

		return this.request(options);
	}

	sendCloseRequest(bytesConsumed){
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
		const counter = new StreamByteCounter();

		setTimeout(() => {
			// this is preemption (only for testing)
			storageStream.pause();
			counter.end();
		}, 1000);

		const options = { stdio: ["pipe", "pipe", "pipe"] }; // share STDERR with this parent process
		const child = this.childProcess.spawn(this.BINARY, this.ARGS, options);

		child.on("error", process.stderr.write);

		storageStream.pipe(counter).pipe(child.stdin);
		child.stdout.pipe(callbackStream);

		child.on("exit", () => {
			console.log("child on exit");
			// callbackStream.end();
			// process.exit(0);
		});

		callbackStream.on("end", () => {
			console.log("callbackStream on end", counter.length);
			this.sendCloseRequest(counter.length)
				.then(() => process.exit(0))
				.catch(console.error);
		});
	}
}

module.exports = Mapper;
