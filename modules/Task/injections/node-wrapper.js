const func = require("../index.js");

let remainder = "", acc = {};
process.stdin.on("readable", () => {
	let chunk;

	while ((chunk = process.stdin.read()) !== null) {
		const string = remainder + chunk.toString();
		// console.log(string);
		// console.log("");
		// console.log("");
		// console.log("");
		const units = string.split("\n");
		remainder = units.splice(-1, 1)[0]; // if it doesn't contain a final delimiter, keep the last chunk

		units.forEach(unit => {
			try {
				// JSON.parse(unit)
				func(JSON.parse(unit), acc);
			}
			catch (e) {
				// JSON.parse(remainder + unit)
				console.log("error", e);
				// console.log(e);
			}
		});
		// console.log(func("line"));
		// console.log("remainder", remainder);

	}

});

process.stdin.on("end", () => {
	console.log(Object.keys(acc).reduce((map, el) => Object.assign(map, {[el]: acc[el].length}) , {}));
	console.log("end of stream");
	process.exit(0);
});
