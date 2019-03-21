module.exports = ({
					  Docker = require("../Docker/Docker")(),
					  GoogleCloud = require("../GoogleCloud/GoogleCloud"),
					  ComputeEngine = require("../ComputeEngine/ComputeEngine"),
					  DockerBuilder = require("../TaskBuilders/DockerBuilder/DockerBuilder"),
					  LambdaBuilder = require("../TaskBuilders/LambdaBuilder/LambdaBuilder"),
					  CloudFunctionBuilder = require("../TaskBuilders/CloudFunctionBuilder/CloudFunctionBuilder"),
					  childProcess = require("child_process"),
					  uuidv4 = require("uuid/v4"),
					  debug = require("debug")
				  } = {}) => {

	const googleCloud = new GoogleCloud();
	const computeEngine = new ComputeEngine();

	class Task {

		constructor({ bachfile, target, uuid = uuidv4() }) {
			if (!bachfile) throw new Error("'bachfile' must be passed into constructor.");
			if (!target) throw new Error("'target' of task must be provided.");

			this.bachfile = bachfile;
			this.target = target;
			this.uuid = uuid;
			this.debug = debug(`task:${uuid}`);
			this.hasInstance = false; // this is for cloud deployments requiring instance creation
		}

		build({ path }) {
			// deprecated
			if (!this.bachfile) {
				console.log(".build called without bachfile");
				return Promise.resolve();
			}

			// Clean build folder.
			childProcess.execSync(`rm -rf ${ path }/build`);
			childProcess.execSync(`mkdir ${ path }/build`);

			switch (this.target) {
				case "docker": {
					const dockerBuilder = new DockerBuilder({ path });
					return dockerBuilder.build(this.bachfile);
				}
				case "lambda": {
					throw new Error("not implemented");
					// const lambdaBuilder = new LambdaBuilder({ path });
					// return lambdaBuilder.build(bachfile);
				}
				case "gcf": {
					const cloudFunctionBuilder = new CloudFunctionBuilder({ path });
					return cloudFunctionBuilder.build(this.bachfile);
				}

			}
		}

		run({ env }) { // TODO: add output stream
			switch (this.target) {
				case "local": {
					const { cpu, memory } = this.bachfile.hardware;

					this.debug("starting docker container");
					return Docker.run({
						tag: `bach-${ this.bachfile["logical-name"] }:latest`,
						cpu,
						memory,
						env,
						entry: "node",
						entryArgs: [".docker-wrapper.js"]
					})
						.then(result => {
							this.debug("docker container started");
							return result;
						});
				}
				case "gcf": {
					return googleCloud.sendPubSubMessage({
						name: `bach-${ this.bachfile["logical-name"] }-start-child`,
						message: env
					})
						.catch(console.error);
				}
				case "gce": {
					const name = `${this.bachfile["logical-name"]}-${this.uuid}`;
					if (!this.hasInstance) {
						this.hasInstance = true;
						this.debug("creating virtual machine");
						return computeEngine.createInstances({ names: [name], env, bachfile: this.bachfile })
							.then((result) => {
								this.debug("virtual machine created");
								return result;
							});
					}

					this.debug("starting virtual machine");
					return computeEngine.startInstances({ names: [name] })
						.then(result => {
							this.debug("virtual machine started");
							return result;
						})
						.catch(console.error);
				}

				default: {
					throw new Error("Unknown runtime target");
				}
			}
		}

		deploy({ path }) {
			if (!this.bachfile) {
				console.log("unable to find bachfile in path");
				return Promise.resolve();
			}

			const cloudFunctionBuilder = new CloudFunctionBuilder({ path });
			return cloudFunctionBuilder.deploy(this.bachfile);
		}

		delete() {
			// other resources which require deletion can go here under a switch
			const name = `${this.bachfile["logical-name"]}-${this.uuid}`;
			return computeEngine.deleteInstances({ names: [name] })
				.catch(console.error);
		}

		static readBachfile(path) {
			try {
				return require(`${ path }/bachfile.json`);

			}
			catch (e) {
				return null;
			}
		}

	}

	return Task;
};
