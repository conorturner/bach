const { Writable } = require("stream");
const http = require("http");
const tar = require("tar-fs");
const debug = require("debug");

class LoadBalancerWorker extends Writable {
	constructor() {
		super();

		process.on("message", (msg) => this.handleMasterIPC(msg));
		this.bachfile = JSON.parse(process.env.BACHFILE);
		this.debug = debug(`lb:${process.pid}`);
		this.roundRobin = 0;
		this.upstreamConnections = [];
		this.server = http.createServer();

		this.server.on("request", (req, res) => {
			const type = req.url.split("/").pop();

			switch (type) { // SSR - super simple routing :D
				case "app": {
					// console.log("app");
					const tarStream = tar.pack(this.bachfile.src);
					tarStream.pipe(res);
					break;
				}
				case "heartbeat": {
					this.handleHeartbeatRequest(req, res);
					break;
				}
				case "upstream": {
					this.handleUpStreamRequest(req, res);
					break;
				}
				case "downstream": {
					this.handleDownStreamRequest(req, res);
					break;
				}
				case "config": {
					this.handleConfigRequest(req, res);
					break;
				}
				case "close": {
					this.handleCloseRequest(req, res);
					break;
				}
				default: {
					console.log("unknown type:", type);
				}
			}
		});

		this.remainder = Buffer.alloc(0);
	}

	listen() {
		this.server.listen(process.env.PORT, () => {
			this.debug("listening");
			process.send({ event: "listening" });
		});
	}

	_write(chunk, encoding, callback) { // chunks should be tuples
		this.awaitWritableConnection()
			.then((res) => {
				this.writeChunk({ res, chunk, encoding, callback });
			})
			.catch(error => {
				throw error;
			});
	}

	writeChunk({ res, chunk, encoding, callback }) {
		const delimiter = Buffer.from("\n"); // TODO: make this a parameter

		try {
			const index = chunk.lastIndexOf(delimiter);
			const buffer = Buffer.concat([this.remainder, chunk.slice(0, index)]);
			this.remainder = chunk.slice(index + delimiter.length, chunk.length); // maintain remainder

			const ok = res.write(buffer, encoding);
			if (!ok) res.once("drain", () => this.emit("socketDrain", res));
			callback();
		}
		catch (e) {
			console.error("write error", e);
		}

	}

	awaitWritableConnection() { // this is probably over complex and covers edge cases which do not exists
		const waitForSocket = (event) => new Promise((resolve, reject) => {
			const timeout = setTimeout(reject, 3 * 60 * 1000);
			this.once(event, () => {
				clearTimeout(timeout);
				this.awaitWritableConnection().then(resolve).catch(reject);
			});
		});

		const writableConnection = this.getNextConnection();

		if (writableConnection) return Promise.resolve(writableConnection); // back pressure load balancing
		else if (this.upstreamConnections.length !== 0) return waitForSocket("socketDrain");
		else return waitForSocket("socket");
	}

	getNextConnection() {
		if (this.upstreamConnections.length === 0) return;

		for (let i = 0; i < this.upstreamConnections.length; i++) {
			this.roundRobin = (this.roundRobin + 1) % this.upstreamConnections.length;
			if (this.upstreamConnections[this.roundRobin].res.connection) { // check if connection still exists
				const { needDrain } = this.upstreamConnections[this.roundRobin].res.connection._writableState;
				if (!needDrain) return this.upstreamConnections[this.roundRobin].res;
			}
		}
	}

	close() {
		this.server.close(() => process.exit(0));
	}

	handleUpStreamRequest(req, res) {
		const taskId = LoadBalancerWorker.getTaskId(req.url);
		// pipe data INTO this connection
		process.send({ event: "upStreamRequest", pid: process.pid, taskId });
		this.upstreamConnections.push({ taskId, res });
		this.emit("socket");
		req.on("end", () => {
			// on close notify master
			process.send({ event: "upStreamRequestEnd", pid: process.pid, taskId });
			res.end();
		});
	}

	handleDownStreamRequest(req, res) {
		const taskId = LoadBalancerWorker.getTaskId(req.url);
		// pipe data BACK from this connection
		process.send({ event: "downStreamRequest", pid: process.pid, taskId });
		req.on("data", (data) => process.stdout.write(data));
		req.on("end", () => {
			// when this request closes, notify the master to close the upstream connection
			process.send({ event: "downStreamRequestEnd", pid: process.pid, taskId });
			res.end();
		});

	}

	handleConfigRequest(req, res) {
		const taskId = LoadBalancerWorker.getTaskId(req.url);
		process.send({ event: "config", pid: process.pid, taskId });

		const config = JSON.stringify({
			BINARY: this.bachfile.binary,
			ARGS: this.bachfile.args,
			TASK_TYPE: "stream"
		});

		res.end(config);
	}

	handleHeartbeatRequest(req, res) {
		res.end();
		const taskId = LoadBalancerWorker.getTaskId(req.url);
		const { cpu, mem } = req.headers;
		process.send({ event: "heartbeat", pid: process.pid, taskId, cpu, mem });
	}

	handleCloseRequest(req, res) {
		res.end();
		const taskId = LoadBalancerWorker.getTaskId(req.url);
		process.send({ event: "close", pid: process.pid, taskId });
	}

	handleMasterIPC(message) {
		switch (message.event) {
			case "close": {
				const { taskId } = message;
				this.endUpstreamConnection({ taskId }); // end the upstream when master says its time
				break;
			}
		}
	}

	static getTaskId(url) {
		const regex = /([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})/ig;
		const result = regex.exec(url);
		if (result) return result[0];
	}

	endUpstreamConnection({ taskId }) {
		const idx = this.upstreamConnections.findIndex(({ taskId: tid }) => tid === taskId);
		if (!this.upstreamConnections[idx]) return; // is no longer connected
		this.debug(`closing upstream: ${taskId}`);

		const con = this.upstreamConnections[idx].res;
		this.upstreamConnections.splice(idx, 1); // remove from array before ending to ensure no write after end errors
		con.end();
	}

}

if (require.main === module) {
	const lb = new LoadBalancerWorker();
	lb.listen();
	process.stdin.pipe(lb);
}
else module.exports = LoadBalancerWorker;

