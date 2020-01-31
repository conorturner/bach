const System = require("./System/System");

class Streamer {

	constructor(
		{ CALLBACK_ENDPOINT, BINARY, ARGS },
		{ request = require("request-promise-native"), childProcess = require("child_process") } = {}
	) {
		this.CALLBACK_ENDPOINT = CALLBACK_ENDPOINT;
		this.BINARY = BINARY;
		this.ARGS = ARGS;
		this.request = request;
		this.childProcess = childProcess;
		this.system = new System();
	}

	start() {
		setInterval(() => this.heartbeat(), 10 * 1000);

		const upstream = this.openUpstream();
		const downstream = this.openDownstream();

		upstream.on("end", () => child.stdin.end());

		process.on("SIGINT", () => { // SIGINT is sent to process on preemption by shutdown script
			console.log("SIGINT");
			// TODO: send close request
			this.sendCloseRequest();
		});

		process.on("SIGTERM", () => { // SIGTERM is used in testing with docker
			console.log("SIGTERM");
			this.sendCloseRequest();
		});

		const options = { stdio: ["pipe", "pipe", "pipe"] }; // share STDERR with this parent process
		const child = this.childProcess.spawn(this.BINARY, this.ARGS, options);
		upstream.pipe(child.stdin);
		child.stdout.pipe(downstream);
		downstream.on("end", () => process.exit(0));
	}

	openUpstream() {
		const reqOptions = {
			method: "GET",
			uri: `${this.CALLBACK_ENDPOINT}/upstream`
		};

		return this.request(reqOptions);
	}

	openDownstream() {
		const reqOptions = {
			method: "POST",
			uri: `${this.CALLBACK_ENDPOINT}/downstream`
		};

		return this.request(reqOptions);
	}

	sendCloseRequest() {
		const options = {
			method: "POST",
			uri: `${this.CALLBACK_ENDPOINT}/close`
		};

		return this.request(options);
	}

	heartbeat() {
		const { cpuUsage: cpu, memUsage: mem } = this.system.getPercentages(this.system.record());

		this.request({
			uri: `${this.CALLBACK_ENDPOINT}/heartbeat`,
			headers: { cpu, mem },
			json: true
		})
			.catch(error => {
				console.error("heartbeat failed", error);
				process.exit(1);
			});
	}
}

module.exports = Streamer;
