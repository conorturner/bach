const func = require("../index.js");

let remainder = "", acc = {};
process.stdin.on("readable", () => {
	let chunk;

	while ((chunk = process.stdin.read()) !== null) {

		// TODO: handling tiling of data should not be done here, a stream of complete tiles should be piped directly in
		const string = remainder + chunk.toString();
		const units = string.split("\n");
		remainder = units.splice(-1, 1)[0]; // if it doesn't contain a final delimiter, keep the last chunk

		units.forEach(unit => {
			try {
				// TODO: move this into a child process so that it can be monitored externally
				func(JSON.parse(unit), acc);
			}
			catch (e) {
				console.error("error", e);
			}
		});

	}

});

process.stdin.on("end", () => {
	console.log(Object.keys(acc).reduce((map, el) => Object.assign(map, { [el]: acc[el].length }), {}));
	console.log("end of stream");
	// process.exit(0);
});
