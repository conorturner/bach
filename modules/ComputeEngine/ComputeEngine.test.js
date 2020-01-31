/* eslint-disable no-undef */
const ComputeEngine = require("./ComputeEngine");

describe("ComputeEngine", () => {

	const N_INSTANCES = 5;

	it("createInstances", (done) => {
		jest.setTimeout(10 * 60 * 1000);

		const compute = new ComputeEngine();
		// const names = ["vm1", "vm2", "vm3", "vm4", "vm5", "vm6"];
		const names = new Array(N_INSTANCES).fill(null).map((_, index) => `vm${index}`);
		const env = { CALLBACK_ENDPOINT: "not an ip" };

		compute.createInstances({ names, env })
			.then(result => {
				console.log(result);
				done();
			})
			.catch(done);
	});

	it("stopInstances", (done) => {
		jest.setTimeout(10 * 60 * 1000);

		const compute = new ComputeEngine();
		// const names = ["vm1", "vm2", "vm3", "vm4", "vm5", "vm6"];
		const names = new Array(N_INSTANCES).fill(null).map((_, index) => `vm${index}`);

		compute.stopInstances({ names })
			.then(result => {
				console.log(result);
				done();
			})
			.catch(done);
	});

	it("startInstances", (done) => {
		jest.setTimeout(10 * 60 * 1000);

		const compute = new ComputeEngine();
		const names = new Array(N_INSTANCES).fill(null).map((_, index) => `vm${index}`);

		compute.startInstances({ names })
			.then(result => {
				console.log(result);
				done();
			})
			.catch(done);
	});

	it("deleteInstances", (done) => {
		jest.setTimeout(10 * 60 * 1000);

		const compute = new ComputeEngine();
		const names = new Array(N_INSTANCES).fill(null).map((_, index) => `vm${index}`);

		compute.deleteInstances({ names })
			.then(result => {
				console.log(result);
				done();
			})
			.catch(done);
	});

});
