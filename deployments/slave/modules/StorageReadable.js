const { Readable } = require("stream");

class StorageReadable extends Readable {

	constructor(options) {
		super(options);
		const { DATA_URI, DATA_START, DATA_END, request = require("request-promise-native") } = options;

		this.ended = false;
		this.bytesRead = 0;

		const reqOptions = {
			method: "GET",
			uri: DATA_URI,
			headers: {
				range: `bytes=${DATA_START}-${DATA_END}`
			}
		};

		this._source = request(reqOptions);

		// Every time there's data, push it into the internal buffer.
		this._source.on("data", (chunk) => {
			// If push() returns false, then stop reading from source
			this.bytesRead += chunk.length;
			if (!this.push(chunk)) this._source.pause();
		});

		// When the source ends, push the EOF-signaling `null` chunk
		this._source.on("end", () => {
			this.push(null);
		});
	}

	_read(size) {
		if (!this.ended) this._source.resume();
	}

	preempt() {
		this.ended = true;
		this._source.pause();
		this.push(null);
	}
}

module.exports = StorageReadable;
