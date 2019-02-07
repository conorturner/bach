const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const program = require("commander");

// Classes
const Task = require("../modules/Task/Task.js");
const LocalStorage = require("../modules/Storage/LocalStorage/LocalStorage");
const Orchestrator = require("../modules/Orchestrator/Orchestrator");

// Instances
const task = new Task();
const localStorage = new LocalStorage();
const orchestrator = new Orchestrator();

// User Interface
program
	.command("task-run")
	.option("-t, --target <target>", "Specify target")
	.option("-d, --data <data>", "Specify data source")
	.option("-p, --partition <partition>", "How many partitions/shards should be used")
	.option("-s, --scan", "should the range of resources be scanned")
	.action((cmd) => {
		const { target, partition = "1" } = cmd;
		const path = process.cwd();
		const bachfile = require(`${path}/bachfile.json`);
		console.log(bachfile);

		const type = (process.stdin.isTTY ? !cmd.data : true) ? cmd.data ? "block" : "stream"  : "unknown"; // XOR baby
		const options = { type, target, partition: parseInt(partition, 10) };
		if (cmd.data && !process.stdin.isTTY) return console.log("Cannot specify both data and pipe input");
		if (cmd.data) options.dataUri = `${path}/${cmd.data}`;
		if (!process.stdin.isTTY) options.inputStream = process.stdin;

		console.time(`${partition} tiles`);
		return orchestrator.run(bachfile, options)
			.then(result => {
				console.timeEnd(`${partition} tiles`);
			})
			.catch(console.error);


	});

program
	.command("task-build")
	.action((action, cmd) => {
		// console.log(process.cwd())

		task.build(process.cwd())
			.then(result => console.log(result.stdout))
			.catch(console.error);
	});

module.exports = program;
