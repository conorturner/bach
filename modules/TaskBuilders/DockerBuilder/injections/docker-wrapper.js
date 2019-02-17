const childProcess = require("child_process");
const net = require("net");
const zlib = require("zlib");
const { INPUT_TYPE, BINARY, ARGS, SOURCE_HOST, SOURCE_PORT } = process.env;

switch (INPUT_TYPE) {
	case "stdin": {

		const options = { stdio: [process.stdin, process.stdout, process.stderr] }; // share STD interface with this parent process
		const child = childProcess.spawn(BINARY, JSON.parse(ARGS), options);
		child.on("close", (code) => {
			process.exit(code);
			// console.log(`child process exited with code ${code}`);
		});

		break;
	}
	case "storage": {
		//TODO: create a read connection to some abstract cloud storage url (http or otherwise)
		console.log("storage", BINARY, ARGS);
		break;
	}
	case "tcp": {

		const options = { stdio: ["pipe", "pipe", process.stderr] }; // share STDERR with this parent process
		const child = childProcess.spawn(BINARY, JSON.parse(ARGS), options);
		const client = net.connect(SOURCE_PORT, SOURCE_HOST, () => {
			// console.log("client connected!")
		});

		client.setTimeout(10 * 1000, () => {
			console.error("tcp connection timed out");
			client.end(() => process.exit(1));
		});
		client.on("error", (error) => {
			console.error("client error:", error);
			process.exit(1);
		});

		client.pipe(child.stdin);
		child.stdout.pipe(client);

		child.on("exit", () => client.end());

		break;
	}
}
