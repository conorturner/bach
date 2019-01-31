const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const program = require("commander");

const Task = require("../modules/Task/Task.js");
const task = new Task();

program
	.command("run")
	.option("-t, --target <target>", "Specify target")
	.option("-d, --data <data>", "Specify data source")
	.action((cmd) => {
		const data = cmd.data;
		if (!data) {
			console.log("--data required");
			return;
		}
		const path = process.cwd();
		const inputStream = `cat ${path}/${data}`;

		task.run({ path, target: cmd.target, inputStream })
			.then(result => console.log(result.stdout))
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
