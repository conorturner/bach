const Docker = require("./Docker");

describe("Docker", () => {

	it("createFromBachfile", (done) => {

		const docker = new Docker();

		docker.createFromBachfile()
			.then(result => {
				console.log(result);
				done();
			})
			.catch(done);

	});

});
