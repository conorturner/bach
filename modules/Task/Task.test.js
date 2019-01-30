const Task = require("./Task");

describe("Task", () => {

	const task = new Task();
	const path = `${task.shell.pwd().stdout}/examples/json-searcher`;

	let bachfile;
	it("build", (done) => {

		console.time("build");
		task.build(path)
			.then(b => {
				// console.log(result);
				bachfile = b;
				console.timeEnd("build");

				const inputStream = `cat ${path}/citylots.json.dat`;

				task.run({ bachfile, inputStream });
				expect(true).toBeTruthy();
				done();
			})
			.catch(done);

	});

	it("run", (done) => {

		const inputStream = `cat ${path}/citylots.json.dat`;

		console.time("run");
		task.run({ bachfile, inputStream });
		console.timeEnd("run");

		expect(true).toBeTruthy();
		done();

	});

});
