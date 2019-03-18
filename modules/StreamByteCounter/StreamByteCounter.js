const { Transform } = require("stream");

class StreamByteCounter extends Transform {
	constructor(options) {
		super(options);
		const { cap } = options;
		this.cap = cap;
		this.length = 0;
	}

	_transform(chunk, encoding, callback) {
		if (this.length === this.cap) return;
		else if (this.cap && (this.length + chunk.length > this.cap)) {
			console.log("past cap", this.cap);
			this.push(chunk.slice(this.cap - this.length));
			this.length = this.cap;
			this.emit("cap");
		}
		else {
			this.push(chunk);
			this.length += chunk.length;
			callback();
		}
	}
}

module.exports = StreamByteCounter;
