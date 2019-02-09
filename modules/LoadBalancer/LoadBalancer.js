const EventEmitter = require("events");

// TODO: turn this into a writeable stream with back pressure
class LoadBalancer extends EventEmitter {
	constructor({ net = require("net") } = {}) {
		super();

		this.net = net;
		this.sockets = [];
	}

	open() {
		this.server = this.net
			.createServer((socket) => {
				this.sockets.push(socket);
				this.emit("socket", socket);
			})
			.on("error", (err) => {
				// handle errors here
				throw err;
			});


		return new Promise(resolve => this.server.listen(() => {
			require("dns").lookup(require("os").hostname(), (err, add, fam) => {
				resolve({ server: this.server, localIp: add });
			});
		}));
	}

	close() {
		this.server.close();
	}

	awaitSockets(count) {
		if (this.sockets.length === count) return Promise.resolve(this.sockets);
		else return new Promise(resolve =>
			this.on("socket", () =>
				this.sockets.length === count ? resolve(this.sockets) : null));
	}
}

module.exports = LoadBalancer;