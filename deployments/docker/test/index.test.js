/* eslint-disable no-undef */
const http = require("http");
const childProcess = require("child_process");
const tar = require("tar-fs");

const PORT = 9001;

describe("Test Docker Wrapper", () => {

	beforeAll((done) => {
		childProcess.execSync("rm -rf ./app");
		done();
	});

	it("Slave should request application code", (done) => {

		const N_BYTES = 1e8;
		let echoedBytes = 0, consumed;

		const server = http.createServer();
		server.listen(PORT);

		server.on("request", (req, res) => {
			// console.log(req.url, req.headers)
			const type = req.url.split("/").pop();

			switch (type) { // SSR - super simple routing :D
				case "app": {
					const tarStream = tar.pack("./test/src");
					tarStream.pipe(res);
					// res.end();
					break;
				}
				case "config": {
					res.end(JSON.stringify({
						BINARY: "node",
						ARGS: ["./app/echo.js"],
						TASK_TYPE: "mapper",
						DATA_URI: "https://storage.googleapis.com/public-stuff/GDELT1MIL.dat",
						DATA_START: 0,
						DATA_END: N_BYTES - 1
					}));
					break;
				}
				case "callback": {
					let buffer = []; // this only supports 1 request
					const clientEnd = () => {
						buffer = Buffer.concat(buffer);
						echoedBytes = buffer.length;
					};

					req.on("data", (data) => buffer.push(data));
					req.on("end", () => {
						clientEnd();
						res.end();
					});
					req.on("aborted", clientEnd);
					break;
				}
				case "close": {
					consumed = parseInt(req.headers.consumed, 10);

					if (consumed === N_BYTES) console.log("slave read all bytes");
					else console.log("slave did not complete", consumed);

					res.end();
					break;
				}
				default: {
					done(new Error("Unexpected request: " + type));
					break;
				}
			}
		});

		// const cmd = `docker run -e CALLBACK_ENDPOINT=http://192.168.0.10:${PORT}/uuid-1234 bach-slave`;
		const cmd = `CALLBACK_ENDPOINT=http://localhost:${PORT}/uuid-1234 node index`;

		childProcess.exec(cmd, (err, stdout, stderr) => {
			if (err) return console.error(err);
			if (stderr) console.error(stderr);
			console.log(stdout);
			console.log(stderr);
			server.close();

			expect(consumed).toBe(echoedBytes);
			done();
		});

	});

});
