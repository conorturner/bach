const childProcess = require("child_process");
const net = require("net");
const http = require("http");
const https = require("https");
const URL = require("url");

const {
	INPUT_TYPE, BINARY, ARGS, SOURCE_HOST, SOURCE_PORT,
	DATA_URI, DATA_START, DATA_END, UUID
} = process.env;


const openCallback = (callback) => {
	let options = {
		method: "POST",
		hostname: SOURCE_HOST,
		port: SOURCE_PORT,
		path: `/${UUID}/callback`,
		headers: {
			range: `bytes=${DATA_START}-${DATA_END}`
		}
	};
	const req = http.request(options, callback);
	req.on("end", () => process.exit(0));
	req.setTimeout(10 * 1000, () => {
		console.error("callback connection timed out");
		process.exit(1);
	});
	return req;
};

const readStorage = (uri, callback) => {
	const url = URL.parse(uri);

	const options = {
		method: "GET",
		hostname: url.hostname,
		port: null,
		path: url.pathname,
		headers: {
			range: `bytes=${DATA_START}-${DATA_END}`
		}
	};
	const protocol = url.protocol === "https:" ? https : http;
	return protocol.request(options, callback).end();
};

switch (INPUT_TYPE) {
	case "stdin": {
		const options = { stdio: [process.stdin, process.stdout, process.stderr] }; // share STD interface with docker run
		const child = childProcess.spawn(BINARY, JSON.parse(ARGS), options);
		child.on("close", (code) => process.exit(code));
		break;
	}
	case "storage": {
		console.log("storage", BINARY, ARGS, DATA_URI, SOURCE_HOST);

		readStorage(DATA_URI, (res) => {
			const req = openCallback();
			res.pipe(req);
		});

		break;
	}
	case "tcp": {

		const options = { stdio: ["pipe", "pipe", "pipe"] }; // share STDERR with this parent process
		const child = childProcess.spawn(BINARY, JSON.parse(ARGS), options);
		const client = net.connect(SOURCE_PORT, SOURCE_HOST, () => {
		});

		client.setTimeout(10 * 1000, () => {
			console.error("tcp connection timed out");
			process.exit(1);
		});
		client.on("error", (error) => {
			console.error("client error:", error);
			process.exit(1);
		});
		client.on("end", () => {
			process.exit(0);
		});

		client.pipe(child.stdin);
		child.stderr.pipe(client);

		child.on("exit", () => {
			client.end();
			process.exit(1);
		});

		break;
	}
}
