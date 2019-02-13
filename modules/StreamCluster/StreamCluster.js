// Classes
const Task = require("../Task/Task.js");
const LoadBalancer = require("../LoadBalancer/LoadBalancer");

class StreamCluster {

	constructor({ target, bachfile, callbackAddress }, { task = new Task(), loadBalancer = new LoadBalancer({ nWorkers: 4 }) } = {}) {
		this.task = task;
		this.loadBalancer = loadBalancer;

		this.bachfile = bachfile;
		this.target = target;
		this.callbackAddress = callbackAddress;
		this.nodes = [];
	}

	pipeInputStream(inputStream) {
		inputStream.pipe(this.loadBalancer);

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

		const add = () => {
			const env = {
				INPUT_TYPE: "tcp",
				BINARY: bachfile.binary,
				ARGS: target === "local" ? JSON.stringify(bachfile.args) : bachfile.args,
				SOURCE_HOST: callbackAddress,
				SOURCE_PORT: loadBalancer.PORT
			};

			this.nodes.push(this.task.run({ bachfile, env, target }));
		};

		if (loadBalancer.isListening) add();
		else loadBalancer.once("listening", () => add());
	}

}

module.exports = StreamCluster;
