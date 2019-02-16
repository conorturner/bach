const { Writable } = require("stream");
const split = require("binary-split");

class LoadBalancerWorker extends Writable {
	constructor({ net = require("net") } = {}) {
		super();

		this.roundRobin = 0;
		this.net = net;
		this.sockets = [];
		this.acceptConnections = true;
		//TODO: option to specify port
		this.server = this.net
			.createServer()
			.on("error", (err) => {
				// handle errors here
				console.log("server error", err);
			});

		this.server.on("connection", (socket) => {
			if (!this.acceptConnections) return socket.close();
			socket.on("error", (error) => console.log("socket error", error));
			this.sockets.push(socket);
			this.emit("socket", socket);
			process.send({ event: "socketOpen", pid: process.pid });
		});
	}

	listen() {
		this.server.listen(process.env.PORT, () => process.send({ event: "listening" })); // port env var set at cluster.fork()
	}

	_write(chunk, encoding, callback) { // chunks should be tuples
		this.awaitWritableSocket()
			.then((socket) => {
				this.writeChunk({ socket, chunk, encoding, callback });
			})
			.catch(error => {
				throw error;
			});
	}

	writeChunk({ socket, chunk, encoding, callback }) {
		try {
			const ok = socket.write(Buffer.concat([chunk, Buffer.from("\n")]), encoding);
			if (!ok) socket.once("drain", () => this.emit("socketDrain", socket));
			callback();
		}
		catch (e) {
			console.log(socket._writableState);
			console.log("write error");
		}

	}

	awaitWritableSocket() { // this is probably over complex and covers edge cases which do not exists
		const waitForSocket = (event) => new Promise((resolve, reject) => {
			const timeout = setTimeout(reject, 3 * 60 * 1000);
			this.once(event, () => {
				clearTimeout(timeout);
				this.awaitWritableSocket().then(resolve).catch(reject);
			});
		});

		const writableSocket = this.getNextSocket();

		if (writableSocket) return Promise.resolve(writableSocket); // back pressure load balancing
		else if (this.sockets.length !== 0) return waitForSocket("socketDrain");
		else return waitForSocket("socket");
	}

	getNextSocket() {
		if (this.sockets.length === 0) return;

		// this.roundRobin = (this.roundRobin + 1) % this.sockets.length;
		// const { needDrain } = this.sockets[this.roundRobin]._writableState;
		// if (!needDrain) return this.sockets[this.roundRobin];

		for (let i = 0; i < this.sockets.length; i++) {
			this.roundRobin = (this.roundRobin + 1) % this.sockets.length;
			const { needDrain } = this.sockets[this.roundRobin]._writableState;
			if (!needDrain) return this.sockets[this.roundRobin];
		}
	}

	_final(callback) {
		this.acceptConnections = false; // stop accepting connections before closing current
		this.sockets.forEach(socket => socket.end()); // send end of stream to connections

		Promise.all(this.sockets.map(socket => new Promise(r => socket.on("close", r))))
			.then(() => {
				console.log(`PID:${process.pid} - CLOSE`);
				this.close();
				callback();
			})
			.catch(err => {
				console.error(err);
				callback();
			});
	}

	close() {
		this.server.close(() => process.exit(0));
	}
}

if (require.main === module) {
	console.log(`Worker ${ process.pid } started.`);
	const lb = new LoadBalancerWorker();
	lb.listen();
	process.stdin.pipe(split("\n")).pipe(lb);
}
else module.exports = LoadBalancerWorker;

