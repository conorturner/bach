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
					medallion,
					hack_license,
					pickup_datetime,
					dropoff_datetime,
					trip_time_in_secs,
					trip_distance,
					pickup_longitude,
					pickup_latitude,
					dropoff_longitude,
					dropoff_latitude,
					payment_type,
					fare_amount,
					surcharge,
					mta_tax,
					tip_amount,
					tolls_amount,
					total_amount
				] = unit.split(",");

				acc[medallion] = acc[medallion] || 0;
				acc[medallion] += parseFloat(total_amount);

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
	// console.log(JSON.stringify(acc, null, 2));
	// console.log(Object.keys(acc).length);
	process.exit(0);
});
