const Docker = require("../Docker/Docker");
const DockerBuilder = require("../TaskBuilders/DockerBuilder/DockerBuilder");
const LambdaBuilder = require("../TaskBuilders/LambdaBuilder/LambdaBuilder");
const CloudFunctionBuilder = require("../TaskBuilders/CloudFunctionBuilder/CloudFunctionBuilder");

class Task {

	constructor({ docker = new Docker(), childProcess = require("child_process") } = {}) {
		this.docker = docker;
		this.childProcess = childProcess;
	}

	build({ target, path }) {
		const bachfile = this.readBachfile(path);
		if (!path) return Promise.resolve();

		// Clean build folder.
		this.childProcess.execSync(`rm -rf ${path}/build`);
		this.childProcess.execSync(`mkdir ${path}/build`);

		switch (target) {
			case "docker": {
				const dockerBuilder = new DockerBuilder({ path });
				return dockerBuilder.build(bachfile);
			}
			case "lambda": {
				const lambdaBuilder = new LambdaBuilder({ path });
				return lambdaBuilder.build(bachfile);
			}
			case "gcf": {
				const cloudFunctionBuilder = new CloudFunctionBuilder({ path });
				return cloudFunctionBuilder.build(bachfile);
			}

		}


	}

	run({ bachfile, target = "local", inputStream, env }) { // TODO: add output stream
		switch (target) {
			case "local": {

				return this.docker.run({
					tag: `bach-${bachfile["logical-name"]}`,
					cpu: bachfile.hardware.cpu,
					env,
					entry: "node",
					entryArgs: [".docker-wrapper.js"],
					inputStream
				});
			}

			default: {
				throw new Error("Unknown runtime target");
			}
		}
	}

	deploy({ path }) {
		const bachfile = this.readBachfile(path);
		if (!path) return Promise.resolve();

		const cloudFunctionBuilder = new CloudFunctionBuilder({ path });
		return cloudFunctionBuilder.deploy(bachfile);
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
