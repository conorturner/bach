const { Writable } = require("stream");

class LoadBalancerWorker extends Writable {
	constructor({ net = require("net"), zlib = require("zlib") } = {}) {
		super();

		this.roundRobin = 0;
		this.net = net;
		this.zlib = zlib;
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
			if (!this.acceptConnections) return socket.end();
			socket.on("error", (error) => console.log("socket error", error));
			socket.pipe(process.stdout);

			this.sockets.push(socket);
			this.emit("socket", socket);
			process.send({ event: "socketOpen", pid: process.pid });
		});
		this.remainder = Buffer.alloc(0);
	}

	listen() {
		this.server.listen(process.env.PORT, () => {
			console.error(`PID:${process.pid} - LISTEN`);
			process.send({ event: "listening" });
		});
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
		const delimiter = Buffer.from("\n"); // TODO: make this a parameter

		try {
			const index = chunk.lastIndexOf(delimiter);
			const buffer = Buffer.concat([this.remainder, chunk.slice(0, index)]);
			this.remainder = chunk.slice(index + delimiter.length, chunk.length); // maintain remainder

			const ok = socket.write(buffer, encoding);
			if (!ok) socket.once("drain", () => this.emit("socketDrain", socket));
			callback();
		}
		catch (e) {
			console.error(socket._writableState);
			console.error("write error");
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

		for (let i = 0; i < this.sockets.length; i++) {
			this.roundRobin = (this.roundRobin + 1) % this.sockets.length;
			const { needDrain } = this.sockets[this.roundRobin]._writableState;
			if (!needDrain) return this.sockets[this.roundRobin];
		}
	}

	_final(callback) {
		this.acceptConnections = false; // stop accepting connections before closing current
		// this.sockets.forEach(socket => socket.end()); // send end of stream to connections TODO: make this send some form of end delimiter to tell the client to close

		Promise.all(this.sockets.map(socket => new Promise(r => socket.on("close", r))))
			.then(() => {
				console.error(`PID${process.pid} - CLOSE`);
				callback();
				this.close(callback);
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
	process.stdout.setMaxListeners(64);
	const lb = new LoadBalancerWorker();
	lb.listen();
	process.stdin.pipe(lb);
}
else module.exports = LoadBalancerWorker;

