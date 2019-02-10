const childProcess = require("child_process");
const net = require("net");

exports.invoke = event => {
	const env = JSON.parse(Buffer.from(event.data, "base64").toString());
	// console.log(env);

	const { INPUT_TYPE, BINARY, ARGS, SOURCE_HOST, SOURCE_PORT } = env;

	switch (INPUT_TYPE) {
		case "storage": {
			//TODO: create a read connection to some abstract cloud storage url (http or otherwise)
			console.log("storage", BINARY, ARGS);
			break;
		}
		case "tcp": {
			return new Promise(resolve => {
				try {
					const options = { stdio: ["pipe", process.stdout, process.stderr] }; // share STD interface with this parent process
					const child = childProcess.spawn(BINARY, ARGS, options);
					console.time("client connected");
					const client = net.connect(SOURCE_PORT, SOURCE_HOST, () => console.timeEnd("client connected"));
					client.setTimeout(10 * 1000, () => {
						console.error("tcp connection timed out");
						client.end();
						resolve();
					});
					client.pipe(child.stdin);

					child.on("close", (code) => {
						console.log("child closed:", code);
						client.end();
						resolve(null);
					});
					child.on("error", (code) => {
						console.log(code);
						resolve(null);
					});
					client.on("error", (code) => {
						console.log(code);
						resolve(null);
					});
				}
				catch (e) {
					console.error(e);
					resolve(null);
				}

			});
		}
	}

};
