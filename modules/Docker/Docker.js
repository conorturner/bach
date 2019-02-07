class Docker {

	constructor({ childProcess = require("child_process") } = {}) {
		this.childProcess = childProcess;
	}

	run({ tag, env, inputStream, cpu, entry, entryArgs }) {
		// const envArgs = Object.keys(env).map(key => `-e ${key}='${JSON.stringify(env[key])}'`);
		const envArgs = Object.keys(env).reduce((acc, key) => acc.concat(["-e", `${key}=${env[key]}`]), []);

		const args = [
			"run",
			"--entrypoint", entry,
			...envArgs,
			"-i",
			`--cpu-quota=${cpu.min * 100000}`,
			tag,
			...entryArgs
		];

		const options = { stdio: ["pipe", process.stdout, process.stderr] };
		const child = this.childProcess.spawn("docker", args, options);

		if (inputStream) inputStream.pipe(child.stdin);

		return child;
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
