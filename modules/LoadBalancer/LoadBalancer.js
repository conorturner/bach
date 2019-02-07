const EventEmitter = require("events");

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


		return new Promise(resolve => this.server.listen(() => resolve(this.server)));
	}

	close(){
		this.server.close();
	}
}

module.exports = LoadBalancer;
