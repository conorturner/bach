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
		inputStream.pipe(this.split("\n")).pipe(this.loadBalancer);
	}

	setDesiredNodes(desiredNodes) {
		const delta = desiredNodes - this.nodes;
		if (delta > 0) for (let i = 0; i < delta; i++) this.addNode();
	}

	addNode() {
		const { loadBalancer, bachfile, target, callbackAddress } = this;
		const { port } = loadBalancer.server.address();

		const env = {
			INPUT_TYPE: "tcp",
			BINARY: bachfile.binary,
			ARGS: target === "local" ? JSON.stringify(bachfile.args) : bachfile.args,
			SOURCE_HOST: callbackAddress,
			SOURCE_PORT: port
		};

		this.nodes.push(this.task.run({ bachfile, env, target }));
	}

}

module.exports = StreamCluster;