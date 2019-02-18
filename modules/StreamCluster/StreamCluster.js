// Classes
const Task = require("../Task/Task.js")();
const LoadBalancer = require("../LoadBalancer/LoadBalancer");

class StreamCluster {

	constructor({ target, bachfile, callbackAddress, nWorkers }, { loadBalancer = new LoadBalancer({ nWorkers }) } = {}) {
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
		const { loadBalancer } = this;

		const set = () => {
			const delta = desiredNodes - this.nodes;
			if (delta > 0) for (let i = 0; i < delta; i++) this.addNode();
		};

		if (loadBalancer.isListening) set();
		else loadBalancer.once("listening", () => set());
	}

	addNode() {
		const { loadBalancer, bachfile, target, callbackAddress } = this;

		const env = {
			INPUT_TYPE: "tcp",
			BINARY: bachfile.binary,
			ARGS: target === "local" ? JSON.stringify(bachfile.args) : bachfile.args,
			SOURCE_HOST: callbackAddress,
			SOURCE_PORT: loadBalancer.PORT
		};

		const task = new Task({ bachfile, target });
		task.run({ bachfile, env }).catch(err => console.error(err));
		this.nodes.push(task);
	}

}

module.exports = StreamCluster;
