class Docker {

	constructor({ childProcess = require("child_process") } = {}) {
		this.childProcess = childProcess;
	}

	run({ tag, env, inputStream }) {
		const envArgs = Object.keys(env).map(key => `-e ${key}=${JSON.stringify(env[key])}`).join(" ");
		console.log(this.childProcess.execSync(`${inputStream} | docker run ${envArgs} -i ${tag}`).toString());
	}

	build({ tag, file, workdir }) {
		const cmd = `docker build -f ${workdir}/${file} -t ${tag} ${workdir}`;
		console.log(this.childProcess.execSync(cmd).toString());
	}

}

module.exports = Docker;
