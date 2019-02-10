const { Writable } = require("stream");

class LoadBalancer extends Writable {
	constructor(options, { net = require("net") } = {}) {
		super();

		this.roundRobin = 0;
		this.net = net;
		this.sockets = [];
		//TODO: option to specify port
		this.server = this.net
			.createServer()
			.on("error", (err) => {
				// handle errors here
				console.log("server error", err);
			});

		this.server.on("connection", (socket) => {
			console.log("socket connected");
			socket.on("error", (error) => console.log("socket error", error));
			this.sockets.push(socket);
			this.emit("socket", socket);
		});
	}

	open() {
		return new Promise(resolve => this.server.listen(resolve));
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
			const ok = socket.write(Buffer.concat([chunk, Buffer.from("\n")]), encoding, callback);
			if (!ok) socket.once("drain", () => this.emit("socketDrain", socket));
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

		this.roundRobin = (this.roundRobin + 1) % this.sockets.length;
		const { needDrain } = this.sockets[this.roundRobin]._writableState;
		if (!needDrain) return this.sockets[this.roundRobin];
	}

	_final(callback) {
		// this is called when input pipe has finished - NOT when the tcp pipes are done
		this.sockets.forEach(socket => socket.end(null)); // send end of stream to tasks

		Promise.all(this.sockets.map(socket => new Promise(r => socket.on("close", r))))
			.then(() => {
				console.log("sockets closed")
				this.close();
				callback();
			})
			.catch(err => {
				console.error(err);
				callback();
			});
	}

	close() {
		this.server.close(() => this.emit("close"));
	}
}

module.exports = LoadBalancer;
