const Storage = require("../Storage");

class LocalStorage {

	constructor({ fs = require("fs") } = {}) {
		this.fs = fs;
	}

	getReadStream(path) {
		return this.fs.createReadStream(path);
	}

	getTileReadStreams(path, n) {
		const fd = this.fs.openSync(path, "r");
		const { size } = this.fs.fstatSync(fd);

		const readFrom = (pos) => new Promise(resolve => {
			const rs = this.fs.createReadStream("", { fd, start: pos, highWaterMark: 1024, autoClose: false }); // high watermark has been known to effect performance

			let found = false, index = pos;
			rs.on("readable", () => {
				if (found) return;
				let data;


				while ((data = rs.read()) !== null) {
					const dataString = data.toString();
					if (dataString.includes("\n")) {

						index += dataString.indexOf("\n") + 1; // + 1 because file indexes work differently to strings
						found = true;
						rs.pause();
						return resolve(index);
					}
					index += data.length;
				}
			});
		});

		return Storage.getChunkIndexes(size, n, readFrom)
			.then(chunkIndexes => chunkIndexes.map(({ start, end }) =>
				this.fs.createReadStream("", { fd, start, end, autoClose: false })))
			.then(readStreams => ({ readStreams, fd }));
	}

	createDelimiterIndex(path, output = path + ".index") {
		const fd = this.fs.openSync(path, "r");
		if (this.fs.existsSync(output)) this.fs.unlinkSync(output);
		const { size } = this.fs.fstatSync(fd);

		const rs = this.fs.createReadStream("", { fd }); // high watermark has been known to effect performance
		const outputStream = this.fs.createWriteStream(output); // high watermark has been known to effect performance

		let index = 0, indexArray = [];

		rs.on("readable", () => {
			let data;
			while ((data = rs.read()) !== null) {
				const dataString = data.toString();

				LocalStorage.indexesOf(dataString, "\n", index).forEach(i => {
					indexArray.push(i);
					// outputStream.write(i.toString(36) + "\n");
				});


				index += data.length;
			}
			console.log(Math.round((index / size) * 1000) / 10 + "%");
		});

		return new Promise(resolve => {
			rs.on("close", () => {

				let max = 0, min = Number.MAX_SAFE_INTEGER, mean = 0;
				indexArray.forEach((item, i) => {
					if (i === 0) mean = item;
					else mean = (mean + item) / 2; // is this valid maths?
					if (item < min) min = item;
					if (item > max) max = item;
				});
				outputStream.write(JSON.stringify({ max, min, mean, size, indexArray }));
				resolve(indexArray.length);
			});
		});
	}

	readDelimiterIndex(path) {
		if (!this.fs.existsSync(path)) return;
		else return JSON.parse(this.fs.readFileSync(path).toString());
	}


	static indexesOf(string, char, offset = 0) {
		let indexes = [];

		for (let i = 0; i < string.length; i++)
			if (string[i] === char) indexes.push(i + offset);


		// console.log(indexes)
		return indexes;
	}
}

module.exports = LocalStorage;
