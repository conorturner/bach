/* eslint-disable indent */
class Docker {

	constructor({
					request = require("request-promise-native"),
					childProcess = require("child_process"),
					tar = require("tar-fs"),
					http = require("http")
				} = {}) {

		this.request = request;
		this.tar = tar;
		this.http = http;
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
		const tarStream = this.tar.pack(`${workdir}`);

		const options = {
			hostname: "strider.local",
			port: 2375,
			path: "/v1.24/build",
			method: "POST",
			headers: {
				"Content-Type": "application/x-tar"
			}
		};

		return new Promise(resolve => {
			const req = this.http.request(options, (res) => {
				console.log(`STATUS: ${res.statusCode}`);
				console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
				res.pipe(process.stdout);
				res.on("close", () => resolve());
			});

			req.on("error", (e) => console.error(`problem with request: ${e.message}`));

			tarStream.pipe(req);
		});
	}

}

module.exports = Docker;
