const func = (line, acc) => {
	// this is processing each item in the stream
	if (acc[line.properties.STREET]) acc[line.properties.STREET].push(line);
	else acc[line.properties.STREET] = [line];
};

let remainder = "", acc = {};
process.stdin.on("readable", () => {
	let chunk;

	while ((chunk = process.stdin.read()) !== null) {

		const string = remainder + chunk.toString();
		const units = string.split("\n");
		remainder = units.splice(-1, 1)[0]; // if it doesn't contain a final delimiter, keep the last chunk

		units.forEach(unit => {
			try {
				func(JSON.parse(unit), acc);
			}
			catch (e) {
				console.error("error", e);
			}
		});

	}

});

process.stdin.on("end", () => {
	// console.log(Object.keys(acc).reduce((map, el) => Object.assign(map, { [el]: acc[el].length }), {}));
	process.exit(0);
});
