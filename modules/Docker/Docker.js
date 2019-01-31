class Docker {

	constructor({ childProcess = require("child_process") } = {}) {
		this.childProcess = childProcess;
	}

	run({ tag, env, inputStream }) {
		const envArgs = Object.keys(env).map(key => `-e ${key}=${JSON.stringify(env[key])}`).join(" ");
		const cmd = `${inputStream} | docker run ${envArgs} -i ${tag}`;

		return new Promise((resolve, reject) => {
			this.childProcess.exec(cmd, (error, stdout, stderr) =>
				error ? reject(error) : resolve({ stdout, stderr }));
		});
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
