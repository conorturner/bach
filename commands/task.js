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
	.command("run")
	.option("-t, --target <target>", "Specify target")
	.option("-d, --data <data>", "Specify data source")
	.action((cmd) => {
		const { data, target } = cmd;
		if (!data) {
			console.log("--data required");
			return;
		}
		const path = process.cwd();
		const bachfile = require(`${path}/bachfile.json`);
		console.log(bachfile);

		const options = { dataUri: `${path}/${data}`, target };

		console.time("run");
		orchestrator.run(bachfile, options)
			.then(result => {
				console.timeEnd("run");
			})
			.catch(console.error);
	});

program
	.command("build")
	.action((action, cmd) => {
		// console.log(process.cwd())

		task.build(process.cwd())
			.then(result => console.log(result.stdout))
			.catch(console.error);
	});

module.exports = program;
