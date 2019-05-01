class ComputeEngine {

	constructor({ childProcess = require("child_process") } = {}) {
		this.childProcess = childProcess;
	}

	createInstances({ names, env, bachfile }) {
		const envString = `${Object.keys(env).map(key => `${key}=${env[key]}`).join(" ")}`;
		const codeUri = "cd /home/conorscturner/bach/deployments/docker"; // TODO: this is the uri of the bach runtime code in the VM (it is now nested under slave)
		const startupScript = `#! /bin/bash \n\n ${codeUri} \n ${envString} node index > /home/conorscturner/std.log 2> /home/conorscturner/err.log &`;
		const shutdownScript = "#! /bin/bash \n\n sudo kill -s SIGINT \\$(ps aux | grep 'node index' | grep -v grep | awk '{print \\$2}')"; // TODO: this needs to work for other binaries than node

		const flags = [
			"--preemptible",
			"--zone europe-west1-b",
			"--image node11-vm-image-v2", //TODO: rebuild node11-vm-image as a more lightweight image with lower permissions
			`--custom-cpu ${bachfile.hardware.cpu}`,
			`--custom-memory ${bachfile.hardware.memory}MB`,
			"--format json",
			`--metadata startup-script="${startupScript}",shutdown-script="${shutdownScript}"`
		];
		const cmd = `gcloud compute instances create ${names.join(" ")} ${flags.join(" ")}`;

		return new Promise((resolve, reject) => {
			this.childProcess.exec(cmd, (error, stdout, stderr) =>
				error ? reject(error) : resolve({ stdout: JSON.parse(stdout), stderr }));
		});
	}

	startInstances({ names }) {
		const cmd = `gcloud compute instances start ${names.join(" ")} --zone europe-west1-b --format json -q`;

		return new Promise((resolve, reject) => {
			this.childProcess.exec(cmd, (error, stdout, stderr) =>
				error ? reject(error) : resolve({ stdout: JSON.parse(stdout), stderr }));
		});
	}

	stopInstances({ names }) {
		const cmd = `gcloud compute instances stop ${names.join(" ")} --zone europe-west1-b --format json -q`;

		return new Promise((resolve, reject) => {
			this.childProcess.exec(cmd, (error, stdout, stderr) =>
				error ? reject(error) : resolve({ stdout: JSON.parse(stdout), stderr }));
		});
	}

	deleteInstances({ names }) {
		const cmd = `gcloud compute instances delete ${names.join(" ")} --zone europe-west1-b --format json -q`;

		return new Promise((resolve, reject) => {
			this.childProcess.exec(cmd, (error, stdout, stderr) =>
				error ? reject(error) : resolve({ stdout: JSON.parse(stdout), stderr }));
		});
	}
}


module.exports = ComputeEngine;
