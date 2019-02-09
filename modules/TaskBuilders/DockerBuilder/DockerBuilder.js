const TaskBuilder = require("../TaskBuilder/TaskBuilder");

class DockerBuilder extends TaskBuilder {

	constructor({ path }) {
		super({ path });
	}

	build(bachfile) {
		this.inject(`${__dirname}/injections/docker-wrapper.js`, "/build/.docker-wrapper.js");
		this.inject(`${__dirname}/injections/.node11.Dockerfile`, "/build/.temp.Dockerfile");

		const tag = `bach-${bachfile["logical-name"]}`;
		return this.docker.build({ tag, workdir: `${this.path}/build`, file: ".temp.Dockerfile" });
	}

}

module.exports = DockerBuilder;
