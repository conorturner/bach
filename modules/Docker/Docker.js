class Docker {

	constructor({ childProcess = require("child_process") } = {}) {
		this.childProcess = childProcess;
	}

	run({ tag, env, inputStream, cpu }) {
		const envArgs = Object.keys(env).map(key => `-e ${key}=${JSON.stringify(env[key])}`).join(" ");

		return new Promise((resolve) => {
			const args = ["run", envArgs, "-i", `--cpu-quota=${cpu.min * 100000}`, tag];
			const options = { stdio: ["pipe", process.stdout, process.stderr] };
			const child = this.childProcess.spawn("docker", args, options);

			inputStream.pipe(child.stdin);

			child.on("close", (code) => {
				// console.log(`child process exited with code ${code}`);
				resolve(code);
			});
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
