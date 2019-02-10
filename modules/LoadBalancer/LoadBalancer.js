const { Writable } = require("stream");

class LoadBalancer extends Writable {
	constructor(options, { net = require("net") } = {}) {
		super();

		this.net = net;
		this.sockets = [];
	}

	open() {
		//TODO: option to specify port
		this.server = this.net
			.createServer()
			.on("error", (err) => {
				// handle errors here
				throw err;
			});

		this.server.on("connection", (socket) => {
			this.sockets.push({ writable: true, socket });
			this.emit("socket", socket);
		});

		return new Promise(resolve => this.server.listen(resolve));
	}

	_write(chunk, encoding, callback) { // chunks should be tuples
		this.getWritableSocket()
			.then(socket => {
				this.writeChunk({ socket, chunk, encoding, callback });
			})
			.catch(error => {
				throw error;
			});
	}

	writeChunk({ socket, chunk, encoding, callback }) {
		const ok = socket.write(chunk, encoding, callback);

		if (!ok) {
			this.sockets[this.sockets.indexOf(socket)].writable = false;
			socket.once("drain", () => {
				this.sockets[this.sockets.indexOf(socket)].writable = true;
				this.emit("socketDrain", socket); // pipe all socket events into one stream
			});
		}
	}

	getWritableSocket() { // this is probably over complex and covers edge cases which do not exists
		const writableSockets = this.sockets.filter(({ writable }) => writable);
		if (writableSockets.length !== 0) return Promise.resolve(writableSockets[0]); // back pressure load balancing
		else return new Promise((resolve, reject) => {
			const timeout = setTimeout(reject, 3 * 60 * 1000);
			this.once("socketDrain", () => {
				clearTimeout(timeout);
				this.getWritableSocket().then(resolve).catch(reject);
			});
		});
	}

	_final(callback) {
		this.sockets.forEach(stream => stream.end(null)); // send end of stream to tasks

		Promise.all(this.sockets.map(socket => new Promise(r => socket.on("close", r))))
			.then(() => {
				this.close();
				callback();
			})
			.catch(err => {
				console.error(err);
				callback();
			});
	}

	close() {
		this.server.close();
	}
}

module.exports = LoadBalancer;
