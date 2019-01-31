const Storage = require("../Storage");

class LocalStorage extends Storage {

	constructor({ fs = require("fs") } = {}) {
		super();
		this.fs = fs;
	}

	getReadStream(path) {
		return this.fs.createReadStream(path);
	}

	getTileReadStreams(path, n) {
		const fd = this.fs.openSync(path, "r");

		return this.getChunkIndexes(fd, n)
			.then(chunkIndexes => chunkIndexes.map(({ start, end }) =>
				this.fs.createReadStream("", { fd, start, end, autoClose: false })));
	}

	getChunkIndexes(fd, n) {
		const { size } = this.fs.fstatSync(fd);
		const goalTileSize = Math.round(size / n);

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

		const promiseArray = new Array(n - 1).fill(null).map((_, i) => readFrom((i + 1) * goalTileSize));
		return Promise.all(promiseArray)
			.then(divisions => [0].concat(divisions))
			.then(divisions => divisions.map((division, index) => {
				if (index === 0) return { start: 0, end: divisions[index + 1] };
				else if (index === divisions.length - 1) return { start: divisions[index - 1], end: size };
				else return { start: division, end: divisions[index + 1] };
			}));
	}

}

module.exports = LocalStorage;
