const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const program = require("commander");

// Classes
const Task = require("../modules/Task/Task.js");
const Orchestrator = require("../modules/Orchestrator/Orchestrator");

// Instances
const task = new Task();
const orchestrator = new Orchestrator();

// User Interface
program
	.command("task-run")
	.option("-t, --target <target>", "Specify target")
	.option("-d, --data <data>", "Specify data source")
	.option("-p, --partition <partition>", "How many partitions/shards should be used")
	.option("--ip <ip>", "host ip")
	.option("--lb <lb>", "number of load balancer processes")
	.option("-s, --scan", "should the range of resources be scanned")
	.action((cmd) => {
		const { target = "local", partition = "1", ip, lb } = cmd;
		const path = process.cwd();
		const bachfile = task.readBachfile(path);
		if (!bachfile) return console.error("Unable to find bachfile:", `${path}/bachfile.json`);
		console.error(bachfile);

		const type = (process.stdin.isTTY ? !cmd.data : true) ? cmd.data ? "block" : "stream" : "unknown"; // XOR baby

		const options = { type, target, partition: parseInt(partition, 10), ip, lb: lb ? parseInt(lb, 10) : null };

		if (cmd.data && !process.stdin.isTTY) return console.log("Cannot specify both data and pipe input");
		if (cmd.data) options.dataUri = `${path}/${cmd.data}`; // run workers in a map reduce style configuration (e.g. they go get their data from elsewhere)
		if (!process.stdin.isTTY) options.inputStream = process.stdin; // stream stdin of this process into workers

		console.time(`${partition} tiles`);
		return orchestrator.run(bachfile, options)
			.then(result => {
				console.timeEnd(`${partition} tiles`);
			})
			.catch(console.error);
	});

program
	.command("task-build")
	.option("-t, --target <target>", "Specify target docker|lambda")
	.action((cmd) => {
		// console.log(process.cwd())
		const { target = "docker" } = cmd;

		console.time("- build");
		task.build({ path: process.cwd(), target })
			.then(result => console.timeEnd("- build"))
			.catch(console.error);
	});

program
	.command("task-deploy")
	.action((action, cmd) => {
		// console.log(process.cwd())

		console.time("- deploy");
		task.deploy({ path: process.cwd(), target: null })
			.then(result => {
				console.timeEnd("- deploy");
				// console.log(result.stdout);
			})
			.catch(console.error);
	});

module.exports = program;

