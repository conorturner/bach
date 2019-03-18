const { Transform } = require("stream");

class StreamByteCounter extends Transform {
	constructor(options) {
		super(options);
		this.length = 0;
	}

	_transform(chunk, encoding, callback) {
		this.length += chunk.length;
		this.push(chunk);
		callback();
	}
}

module.exports = StreamByteCounter;
