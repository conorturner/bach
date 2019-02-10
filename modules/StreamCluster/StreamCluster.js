// Classes
const Task = require("../Task/Task.js");
const LoadBalancer = require("../LoadBalancer/LoadBalancer");

class StreamCluster {

	constructor({ target, bachfile, callbackAddress }, { task = new Task(), loadBalancer = new LoadBalancer({}), split = require("binary-split") } = {}) {
		this.task = task;
		this.loadBalancer = loadBalancer;
		this.split = split;

		this.bachfile = bachfile;
		this.target = target;
		this.callbackAddress = callbackAddress;
		this.nodes = [];
	}

	pipeInputStream(inputStream) {
		this.loadBalancer.on("error", (err) => {
			console.error("loadBalancer error", err);
		});
		this.loadBalancer.open()
			.then(() => {
				console.log("piping into load balancer");
				inputStream.pipe(this.split("\n")).pipe(this.loadBalancer);
			})
			.catch(err => {
				throw err;
			});

		return new Promise(resolve => this.loadBalancer.on("close", () => {
			console.log("close");
			resolve();
		}));
	}

	setDesiredNodes(desiredNodes) {
		const delta = desiredNodes - this.nodes;
		if (delta > 0) for (let i = 0; i < delta; i++) this.addNode();
	}

	addNode() {
		const { loadBalancer, bachfile, target, callbackAddress } = this;

		const add = (address) => {
			const { port } = address;

			const env = {
				INPUT_TYPE: "tcp",
				BINARY: bachfile.binary,
				ARGS: target === "local" ? JSON.stringify(bachfile.args) : bachfile.args,
				SOURCE_HOST: callbackAddress,
				SOURCE_PORT: port
			};

			this.nodes.push(this.task.run({ bachfile, env, target }));
		};

		const address = loadBalancer.server.address();
		if (address) add(address);
		else loadBalancer.server.once("listening", () => add(loadBalancer.server.address()));
	}

}

module.exports = StreamCluster;
