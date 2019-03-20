class ComputeEngine {

	constructor({ childProcess = require("child_process") } = {}) {
		this.childProcess = childProcess;
	}

	createInstances({ names, env }) {
		const envFlag = `--container-env ${Object.keys(env).map(key => `${key}=${env[key]}`).join(" ")}`;
		const shutdownScript = "docker stop \\$(docker ps -q)";
		const flags = [
			"--preemptible",
			"--zone europe-west1-b",
			"--container-image conorturner/bach-slave",
			"--custom-cpu 2",
			"--custom-memory 3GB",
			"--format json",
			`--metadata shutdown-script="#! /bin/bash \n ${shutdownScript}"`,
			envFlag
		];
		const cmd = `gcloud compute instances create-with-container ${names.join(" ")} ${flags.join(" ")}`;

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
