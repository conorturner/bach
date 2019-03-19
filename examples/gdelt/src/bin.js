let remainder = "", acc = {};
process.stdin.on("readable", () => {

	let chunk;

	while ((chunk = process.stdin.read()) !== null) { // TODO: this does no back pressuring (will just fill memory)
		const string = remainder + chunk.toString();
		const units = string.split("\n");
		// console.log(JSON.parse(units[0]))
		remainder = units.splice(-1, 1)[0]; // if it doesn't contain a final delimiter, keep the last chunk

		units.forEach(unit => {

			try {
				let [
					date,
					Source,
					Target,
					CAMEOCode,
					NumEvents,
					NumArts,
					QuadClass,
					Goldstein,
					SourceGeoType,
					SourceGeoLat,
					SourceGeoLong,
					TargetGeoType,
					TargetGeoLat,
					TargetGeoLong,
					ActionGeoType,
					ActionGeoLat,
					ActionGeoLong
				] = unit.split("\t");

				NumEvents = parseInt(NumEvents, 10);


				if (date === "Date") return; // its the header row

				const year = date.slice(0, 4);
				const month = date.slice(4, 6);
				const day = date.slice(6, 8);

				const dateObj = new Date();
				dateObj.setFullYear(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
				dateObj.setHours(0, 0, 0, 0);
				// console.log(acc,dateObj);

				acc[CAMEOCode] = acc[CAMEOCode] || 0;
				acc[CAMEOCode]++;
			}
			catch (e) {
				console.log(unit);
				console.log("error", e);
				process.exit(1);
			}
		});

	}
});

process.stdin.on("end", () => {
	console.log(JSON.stringify(acc));
	process.exit(0);
});
