class Docker {

	constructor({ request = require("request-promise-native"), childProcess = require("child_process") } = {}) {
		this.childProcess = childProcess;
		this.request = request;
	}

	run({ tag, env, inputStream, cpu, entry, entryArgs }) {

		const create = () => {
			const options = {
				method: "POST",
				url: "http://strider.local:2375/v1.24/containers/create",
				body: {
					Image: tag,
					Env: Object.keys(env).map(key => `${key}=${env[key]}`),
					// name: tag,
					AttachStdout: true,
					AttachStdin: true,
					AttachStderr: true,
					Cmd: [entry, ...entryArgs]
				},
				json: true
			};

			return this.request(options);
		};

		const start = ({ Id, Warnings }) => {
			if (Warnings) return Promise.reject(Warnings);
			console.log("started:", Id);

			const options = {
				method: "POST",
				url: `http://strider.local:2375/v1.24/containers/${Id}/start`
			};

			return this.request(options);
		};

		return create().then(start);
	}

	build({ tag, file, workdir }) {
		const cmd = `docker build -f ${workdir}/${file} -t ${tag} ${workdir}`;

		return new Promise((resolve, reject) => {
			this.childProcess.exec(cmd, (error, stdout, stderr) =>
				error ? reject(error) : resolve({ stdout, stderr }));
		});
	}

}

module.exports = Docker;
