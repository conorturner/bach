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

	mkdir(destination){
		this.childProcess.execSync(`mkdir ${this.path}/${destination}`);
	}

	copySrc(destination){
		this.childProcess.execSync(`rsync -av ${this.path}/src/ ${this.path}/${destination}`); // may make more sense to use cp for compatibility
	}
}

module.exports = TaskBuilder;


