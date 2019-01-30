const Docker = require("../../Docker/Docker");

class TaskBuilder {
	constructor({ path, childProcess = require("child_process"), docker = new Docker() }) {
		this.path = path;
		this.childProcess = childProcess;
		this.docker = docker;
	}

	inject(source, destination) {
		this.childProcess.execSync(`cp ${source} ${this.path}/${destination}`);
	}
}

module.exports = TaskBuilder;
