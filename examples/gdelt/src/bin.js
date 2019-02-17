const WINDOW_SIZE = 100;

let remainder = "", acc = 0, errors = [], movingWindow = [];
process.stdin.on("readable", () => {

	let chunk;

	while ((chunk = process.stdin.read()) !== null) { // TODO: this does no back pressuring (will just fill memory)
		const string = remainder + chunk.toString();
		const units = string.split("\n");
		// console.log(JSON.parse(units[0]))
		remainder = units.splice(-1, 1)[0]; // if it doesn't contain a final delimiter, keep the last chunk

		units.forEach(unit => {

			try {
				// const line = JSON.parse(unit);

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

				if (movingWindow.length !== WINDOW_SIZE) movingWindow.push({ Target, NumEvents, dateObj });
				else {

					const sums = movingWindow // sum all events per target in the window
						.reduce((acc, { Target, NumEvents }) => Object.assign(acc, { [Target]: (acc[Target] || 0) + NumEvents }), {});

					const sortedByEvents = Object.keys(sums) // find the largest
						.map(Target => ({ Target, NumEvents: sums[Target] }))
						.sort((a, b) => a.NumEvents === b.NumEvents ? 0 : a.NumEvents < b.NumEvents ? 1 : -1);

					const sortedByDate = movingWindow
						.sort((a, b) => a.dateObj.getTime() === b.dateObj.getTime() ? 0 : a.dateObj.getTime() > b.dateObj.getTime() ? 1 : -1);

					const windowStart = sortedByDate[0].dateObj;
					const windowEnd = sortedByDate[sortedByDate.length - 1].dateObj;

					const [first, second, third] = sortedByEvents;

					console.log(JSON.stringify({ first, second, third, windowStart, windowEnd })); // write out as json stream

					movingWindow.push({ Target, NumEvents, dateObj });
					movingWindow.splice(0, 1);
				}
				acc++;
			}
			catch (e) {
				errors.push(e);
				console.log(unit);
				console.log("error", e);
				process.exit(1);
			}
		});

	}
});

process.stdin.on("end", () => {
	// console.log(remainder);
	process.exit(0);
});
