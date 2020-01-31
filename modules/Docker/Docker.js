/* eslint-disable indent */

module.exports = ({ // Injectable dependencies
					  request = require("request-promise-native"),
					  childProcess = require("child_process"),
				  } = {}) => {

	class Docker {

		static runLocal({ env, cpu, memory }) {
			const envArgs = Object.keys(env).map(key => `-e ${key}=${JSON.stringify(env[key])}`).join(" ");

			const cmd = `docker run ${envArgs} -d --cpu-quota=${cpu * 100000} --memory ${memory}m conorturner/bach-slave`;

			return new Promise((resolve, reject) => {
				childProcess.exec(cmd, (error, stdout, stderr) =>
					error ? reject(error) : resolve({ stdout, stderr }));
			});
		}

		static runRemote({ tag, env, cpu, memory, remoteHost }) {

			const create = () => {
				const options = {
					method: "POST",
					url: `http://${remoteHost}/v1.24/containers/create`,
					body: {
						Image: "conorturner/bach-slave",
						Env: Object.keys(env).map(key => `${key}=${env[key]}`),
						// name: tag,
						AttachStdout: true,
						AttachStdin: true,
						AttachStderr: true,
						HostConfig: {
							CpuQuota: 100000 * cpu,
							CpuPeriod: 100000,
							Memory: memory * 1e6,
							MemorySwap: -1
						}
					},
					json: true
				};

				return request(options)
					.catch(error => {
						if (error.statusCode === 404) {
							console.error("Slave docker image not pulled on host.");
							process.exit(1);
						}
						return Promise.reject(error);
					});
			};

			const start = ({ Id, Warnings }) => {
				if (Warnings) return Promise.reject(Warnings);
				// console.log("started:", Id);

				const options = {
					method: "POST",
					url: `http://strider.local:2375/v1.24/containers/${Id}/start`
				};

				return request(options);
			};

			return create().then(start);
		}

		static run({ tag, env, cpu, memory }) {
			if (process.env.REMOTE_DOCKER_HOST) return Docker.runRemote({
				tag,
				env,
				cpu,
				memory,
				remoteHost: process.env.REMOTE_DOCKER_HOST
			});
			else return Docker.runLocal({ env, cpu, memory });
		}

	}

	return Docker;
};
