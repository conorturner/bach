/* eslint-disable indent */

module.exports = ({ // Injectable dependencies
					  request = require("request-promise-native"),
					  childProcess = require("child_process"),
					  tar = require("tar-fs"),
					  http = require("http"),
					  split = require("binary-split")
				  } = {}) => {

	class Docker {

		static run({ tag, env, cpu, memory }) {

			const create = () => {
				const options = {
					method: "POST",
					url: "http://strider.local:2375/v1.24/containers/create",
					body: {
						Image: "conorturner/bach-slave",
						Env: Object.keys(env).map(key => `${ key }=${ env[key] }`),
						// name: tag,
						AttachStdout: true,
						AttachStdin: true,
						AttachStderr: true,
						HostConfig: {
							CpuQuota: 100000 * cpu,
							CpuPeriod: 100000,
							Memory: memory * 1e6,
							MemorySwap: memory * 1e6
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
					url: `http://strider.local:2375/v1.24/containers/${ Id }/start`
				};

				return request(options);
			};

			return create().then(start);
		}

	}

	return Docker;
};
