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
	.action((action, cmd) => {
		console.log("not yet :D");
	});

program
	.command("build")
	.action((action, cmd) => {
		// console.log(process.cwd())
		task.build(process.cwd());
	});

module.exports = program;
