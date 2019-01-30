const { execSync } = require("child_process");
const Docker = require("../Docker/Docker");
const NodeBuilder = require("../TaskBuilders/NodeBuilder/NodeBuilder");

class Task {

	constructor({ shell = require("shelljs"), docker = new Docker() } = {}) {
		this.shell = shell;
		this.docker = docker;
	}

	build(path) {
		const bachfile = JSON.parse(execSync(`cat ${path}/bachfile.json`));

		// Clean build folder.
		this.shell.exec(`rm -rf ${path}/build`);
		this.shell.exec(`mkdir ${path}/build`);

		switch (bachfile.runtime) {
			case "nodejs11": {
				const nodeBuilder = new NodeBuilder({ path });
				nodeBuilder.build(bachfile);
				return Promise.resolve(bachfile);
			}
			default: {
				console.error("unknown runtime");
				break;
			}
		}
	}

	run({ bachfile, runtime = "local", inputStream }) {

		switch (runtime) {
			case "local": {
				this.docker.run({
					tag: bachfile["logical-name"],
					env: { TILE_NUM: 5 },
					inputStream
				});

				break;
			}

			default: {
				throw new Error("Unknown runtime target");
			}
		}
	}

}

module.exports = Task;
