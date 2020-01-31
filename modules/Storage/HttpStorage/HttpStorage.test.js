const HttpStorage = require("./HttpStorage");
const storage = new HttpStorage({});

const nArray = new Array(128).fill(null).map((_,i) => i);

nArray.reduce((promise, n) => {
	return promise.then(() => {
		console.time(`${n}:parts`);

		return storage.getChunkIndexes("https://storage.googleapis.com/datasets-ew1/taxi-data.csv", 2)
			.then(result => {
				console.timeEnd(`${n}:parts`);
			})
			.catch(console.error);
	});
}, Promise.resolve());


