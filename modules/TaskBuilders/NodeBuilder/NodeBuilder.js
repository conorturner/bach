const TaskBuilder = require("../TaskBuilder/TaskBuilder");

class NodeBuilder extends TaskBuilder {

	constructor({ path }) {
		super({ path });
	}

	build(bachfile) {
		// this.inject(`${__dirname}/injections/node-wrapper.js`, "/build/index.js");
		this.inject(`${__dirname}/injections/.node11.Dockerfile`, "/build/.temp.Dockerfile");

		const tag = bachfile["logical-name"];
		return this.docker.build({ tag, workdir: this.path, file: "build/.temp.Dockerfile" });
	}

}

module.exports = NodeBuilder;
