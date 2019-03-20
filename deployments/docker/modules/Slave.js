class Slave {
	constructor({ CALLBACK_ENDPOINT }, { request = require("request-promise-native"), tar = require("tar-fs") } = {}) {
		this.CALLBACK_ENDPOINT = CALLBACK_ENDPOINT;

		this.request = request;
		this.tar = tar;
		this.heartbeatInterval = setInterval(() => this.heartbeat(), 1000);
	}

	init() {
		return Promise.all([
			this.getConfig(),
			this.pullAppCode()
		])
			.then(([config]) => config);
	}

	pullAppCode() {
		return this.request({
			uri: `${this.CALLBACK_ENDPOINT}/app`
		})
			.then((result) => new Promise(resolve => this.tar.extract("./src").end(result).on("finish", () => resolve())));
	}

	getConfig() {
		return this.request({
			uri: `${this.CALLBACK_ENDPOINT}/config`,
			json: true
		});
	}

	heartbeat(){
		this.request({
			uri: `${this.CALLBACK_ENDPOINT}/heartbeat`,
			json: true
		})
			.catch(error => {
				console.error("heartbeat failed", error);
				process.exit(1);
			});
	}

}

module.exports = Slave;
