const childProcess = require("child_process");

const { INPUT_TYPE, BINARY, ARGS } = process.env;

switch (INPUT_TYPE) {
	case "stdin": {

		const options = { stdio: [process.stdin, process.stdout, process.stderr] }; // share STD interface with this parent process
		const child = childProcess.spawn(BINARY, JSON.parse(ARGS), options);
		child.on("close", (code) => {
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
		console.log("tcp", BINARY, ARGS);
		break;
	}
}
