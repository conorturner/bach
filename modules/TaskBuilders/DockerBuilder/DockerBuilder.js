const TaskBuilder = require("../TaskBuilder/TaskBuilder");
const Docker = require("../../Docker/Docker")();

class DockerBuilder extends TaskBuilder {

	constructor({ path }) {
		super({ path });
	}

	build(bachfile) {
		this.inject(`${__dirname}/injections/docker-wrapper.js`, "/build/.docker-wrapper.js");
		this.inject(`${__dirname}/injections/.node11.Dockerfile`, "/build/Dockerfile");
		this.copySrc("build/");

		const tag = `bach-${bachfile["logical-name"]}:latest`;
		return Docker.build({ tag, workdir: `${this.path}/build`, file: ".temp.Dockerfile" });
	}

}

module.exports = DockerBuilder;
