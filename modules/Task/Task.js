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

		switch (bachfile.runtime) {
			case "nodejs11": {
				const nodeBuilder = new NodeBuilder({ path });
				return nodeBuilder.build(bachfile);
			}
			default: {
				console.error("unknown runtime");

				break;
			}
		}
	}

	run({ path, target = "local", inputStream }) {
		const bachfile = this.readBachfile(path);
		if (!path) return Promise.resolve();

		switch (target) {
			case "local": {
				return this.docker.run({
					tag: bachfile["logical-name"],
					env: { TILE_NUM: 5 },
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
