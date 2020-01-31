const program = require("commander");

// Classes
const Task = require("../modules/Task/Task.js")();
const Orchestrator = require("../modules/Orchestrator/Orchestrator");

// User Interface
program
	.command("task-run")
	.option("-t, --target <target>", "Specify target")
	.option("-d, --data <data>", "Specify data source")
	.option("-p, --partition <partition>", "How many partitions/shards should be used")
	.option("-m, --max <max>", "Max partitions/shards that should be used")
	.option("--ip <ip>", "host ip")
	.option("--lb <lb>", "number of load balancer processes")
	.option("-s, --scan", "should the range of resources be scanned")
	.action((cmd) => {
		const { target = "local", partition, ip, lb, max } = cmd;
		const path = process.cwd();
		const bachfile = Task.readBachfile(path);
		if (!bachfile) return console.error("Unable to find bachfile:", `${path}/bachfile.json`);
		console.error(bachfile);

		let type;
		if (!process.stdin.isTTY) type = "stream";
		else if (cmd.data) type = "block";
		else type = "unknown";

		const options = {
			type,
			target,
			partition: partition ? parseInt(partition, 10) : null,
			ip,
			lb: lb ? parseInt(lb, 10) : null,
			max
		};

		if (cmd.data && !process.stdin.isTTY) return console.log("Cannot specify both data and pipe input");
		if (cmd.data) options.dataUri = cmd.data; // run workers in a map reduce style configuration (e.g. they go get their data from elsewhere)
		if (!process.stdin.isTTY) options.inputStream = process.stdin; // stream stdin of this process into workers

		return Orchestrator.run(bachfile, options)
			.then(result => {
			})
			.catch(console.error);
	});

module.exports = program;

