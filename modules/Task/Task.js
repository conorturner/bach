const Docker = require("../Docker/Docker");
const NodeBuilder = require("../TaskBuilders/NodeBuilder/NodeBuilder");

class Task {

	constructor({ docker = new Docker(), childProcess = require("child_process") } = {}) {
		this.docker = docker;
		this.childProcess = childProcess;
	}

	build(path) {
		const bachfile = this.readBachfile(path);
		if (!path) return Promise.resolve();

		// Clean build folder.
		this.childProcess.execSync(`rm -rf ${path}/build`);
		this.childProcess.execSync(`mkdir ${path}/build`);

		const nodeBuilder = new NodeBuilder({ path }); // TODO: make this generic builder
		return nodeBuilder.build(bachfile);
	}

	run({ bachfile, target = "local", inputStream, env }) { // TODO: add output stream
		switch (target) {
			case "local": {

				return this.docker.run({
					tag: bachfile["logical-name"],
					cpu: bachfile.hardware.cpu,
					env,
					entry: "node",
					entryArgs: ["build/index.js"],
					inputStream
				});
			}

			default: {
				throw new Error("Unknown runtime target");
			}
		}
	}

	readBachfile(path) {
		try {
			return JSON.parse(this.childProcess.execSync(`cat ${path}/bachfile.json`));

		}
		catch (e) {
			console.error("error getting bachfile", e);
		}
	}

}

module.exports = Task;
