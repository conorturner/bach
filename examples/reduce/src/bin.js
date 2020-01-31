let remainder = "", counter = 0;
process.stdin.on("readable", () => {

	let chunk;

	while ((chunk = process.stdin.read()) !== null) {
		const string = remainder + chunk.toString();
		const units = string.split("\n");
		// console.log(JSON.parse(units[0]))
		remainder = units.splice(-1, 1)[0]; // if it doesn't contain a final delimiter, keep the last chunk

		counter += units.length;

	}
});

process.stdin.on("end", () => {
	console.log(JSON.stringify({ counter }, null, 2));
	process.exit(0);
});
