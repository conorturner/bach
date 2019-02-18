const Storage = require("../Storage");
const URL = require("url");

class HttpStorage {

	constructor({ http = require("http"), https = require("https") } = {}) {
		this.http = http;
		this.https = https;
	}

	getSize(url) {
		return new Promise((resolve, reject) => {
			const options = {
				method: "HEAD",
				hostname: url.hostname,
				port: null,
				path: url.pathname
			};

			const protocol = url.protocol === "https:" ? this.https : this.http;

			protocol
				.request(options, (res) => resolve(parseInt(res.headers["content-length"], 10)))
				.end();
		});
	}

	getChunkIndexes(uri, n) {
		const url = URL.parse(uri);

		const readFrom = (pos) => new Promise((resolve, reject) => {
			const options = {
				method: "GET",
				hostname: url.hostname,
				port: null,
				path: url.pathname,
				headers: {
					range: `bytes=${pos}`
				}
			};
			const protocol = url.protocol === "https:" ? this.https : this.http;
			let found = false, index = pos;

			const req = protocol.request(options, (res) => {

				res.on("data", (data) => {
					if (found) return;

					const dataString = data.toString();
					if (dataString.includes("\n")) {

						index += dataString.indexOf("\n") + 1; // + 1 because file indexes work differently to strings
						found = true;
						req.abort();
						return resolve(index);
					}
					index += data.length;
				});
			});

			req.end();
		});

		return this.getSize(url)
			.then(size => Storage.getChunkIndexes(size, n, readFrom));

	}

}

module.exports = HttpStorage;
