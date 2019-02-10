console.log("task started");

let remainder = "", acc = 0;
process.stdin.on("readable", () => {
	let chunk;

	while ((chunk = process.stdin.read()) !== null) { // TODO: this does no back pressuring (will just fill memory)

		const string = remainder + chunk.toString();
		const units = string.split("\n");
		// console.log(JSON.parse(units[0]))
		remainder = units.splice(-1, 1)[0]; // if it doesn't contain a final delimiter, keep the last chunk

		units.forEach(unit => {
			try {
				const line = JSON.parse(unit);
				acc++;
			}
			catch (e) {
				console.error("error", e);
				console.log("error", e);
			}
		});

	}
});

process.stdin.on("end", () => {
	// console.log(Object.keys(acc).reduce((map, el) => Object.assign(map, { [el]: acc[el].length }), {}));
	console.log(acc);
	console.log("task ended");
	process.exit(0);
});
