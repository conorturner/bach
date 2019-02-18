/* eslint-disable indent */

module.exports = ({ // Injectable dependencies
					  request = require("request-promise-native"),
					  childProcess = require("child_process"),
					  tar = require("tar-fs"),
					  http = require("http"),
					  split = require("binary-split")
				  } = {}) => {

	class Docker {

		static run({ tag, env, inputStream, cpu, memory, entry, entryArgs }) {

			const create = () => {
				const options = {
					method: "POST",
					url: "http://strider.local:2375/v1.24/containers/create",
					body: {
						Image: tag,
						Env: Object.keys(env).map(key => `${ key }=${ env[key] }`),
						// name: tag,
						AttachStdout: true,
						AttachStdin: true,
						AttachStderr: true,
						Cmd: [entry, ...entryArgs],
						HostConfig: {
							CpuQuota: 100000 * cpu.max,
							CpuPeriod: 100000,
							Memory: memory.max * 1e6,
							MemorySwap: -1 // unlimited swap
						}
					},
					json: true
				};

				return request(options);
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

		static build({ tag, file, workdir }) {
			const tarStream = tar.pack(`${ workdir }`);

			const options = {
				hostname: "strider.local",
				port: 2375,
				path: `/v1.24/build?t=${tag}`,
				method: "POST",
				headers: {
					"Content-Type": "application/x-tar"
				}
			};

			return new Promise(resolve => {
				const req = http.request(options, (res) => {
					console.log(`STATUS: ${ res.statusCode }`);
					res.pipe(split("\n")).on("data", (data) => console.log(JSON.parse(data.toString()).stream.trim()));
					res.on("close", () => resolve());
				});

				req.on("error", (e) => console.error(`problem with request: ${ e.message }`));

				tarStream.pipe(req);
			});
		}

	}

	return Docker;
};
