class Storage {

	static getChunkIndexes(size, n, readFrom) {
		const goalTileSize = Math.round(size / n);

		const promiseArray = new Array(n - 1).fill(null).map((_, i) => readFrom((i + 1) * goalTileSize));
		return Promise.all(promiseArray)
			.then(divisions => [0].concat(divisions))
			.then(divisions => divisions.map((division, index) => {
				if (index === 0) return { start: 0, end: divisions[index + 1] };
				else if (index === divisions.length - 1) return { start: divisions[index], end: size };
				else return { start: division, end: divisions[index + 1] };
			}));
	}
}

module.exports = Storage;
