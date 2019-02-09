const Docker = require("../../Docker/Docker");

class TaskBuilder {
	constructor({ path, childProcess = require("child_process"), docker = new Docker(), request = require("request-promise-native") }) {
		this.path = path;
		this.childProcess = childProcess;
		this.docker = docker;
		this.request = request;
	}

	inject(source, destination) {
		this.childProcess.execSync(`cp ${source} ${this.path}/${destination}`);
	}
}

module.exports = TaskBuilder;


