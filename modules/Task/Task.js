const Docker = require("../Docker/Docker");
const GoogleCloud = require("../GoogleCloud/GoogleCloud");
const DockerBuilder = require("../TaskBuilders/DockerBuilder/DockerBuilder");
const LambdaBuilder = require("../TaskBuilders/LambdaBuilder/LambdaBuilder");
const CloudFunctionBuilder = require("../TaskBuilders/CloudFunctionBuilder/CloudFunctionBuilder");

class Task {

	constructor({ docker = new Docker(), googleCloud = new GoogleCloud(), childProcess = require("child_process") } = {}) {
		this.docker = docker;
		this.googleCloud = googleCloud;
		this.childProcess = childProcess;
	}

	build({ target, path }) {
		if (!path) throw new Error("Path must be provided to task build command");

		const bachfile = this.readBachfile(path);
		if (!bachfile) {
			console.log("unable to find bachfile in path:", path);
			return Promise.resolve();
		}

		// Clean build folder.
		this.childProcess.execSync(`rm -rf ${ path }/build`);
		this.childProcess.execSync(`mkdir ${ path }/build`);

		switch (target) {
			case "docker": {
				const dockerBuilder = new DockerBuilder({ path });
				return dockerBuilder.build(bachfile);
			}
			case "lambda": {
				throw new Error("not implemented");
				// const lambdaBuilder = new LambdaBuilder({ path });
				// return lambdaBuilder.build(bachfile);
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
				const { cpu, memory } = bachfile.hardware;

				return this.docker.run({
					tag: `bach-${ bachfile["logical-name"] }:latest`,
					cpu,
					memory,
					env,
					entry: "node",
					entryArgs: [".docker-wrapper.js"],
					inputStream
				});
			}
			case "gcf": {
				return this.googleCloud.sendPubSubMessage({
					name: `bach-${ bachfile["logical-name"] }-start-child`,
					message: env
				})
					.catch(console.error);
			}

			default: {
				throw new Error("Unknown runtime target");
			}
		}
	}

	deploy({ path }) {
		if (!path) throw new Error("Path must be provided to task build command");

		const bachfile = this.readBachfile(path);
		if (!bachfile) {
			console.log("unable to find bachfile in path:", path);
			return Promise.resolve();
		}

		const cloudFunctionBuilder = new CloudFunctionBuilder({ path });
		return cloudFunctionBuilder.deploy(bachfile);
	}

	readBachfile(path) {
		try {
			return require(`${ path }/bachfile.json`);

		}
		catch (e) {
			// console.error("error getting bachfile", e);
		}
	}

}

module.exports = Task;
