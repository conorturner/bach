class Slave {
	constructor({ CALLBACK_ENDPOINT }, { request = require("request-promise-native"), tar = require("tar-fs") } = {}) {
		this.CALLBACK_ENDPOINT = CALLBACK_ENDPOINT;

		this.request = request;
		this.tar = tar;
	}

	init(){
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
			.then((result) => new Promise(resolve => this.tar.extract("./app").end(result).on("finish", () => resolve())));
	}

	getConfig () {
		return this.request({
			uri: `${this.CALLBACK_ENDPOINT}/config`,
			json: true
		});
	}

}

module.exports = Slave;
