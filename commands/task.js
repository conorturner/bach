const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const program = require("commander");

program
	.command("task <cmd>")
	.option("-r, --recursive", "Remove recursively")
	.action((dir, cmd) => {
		console.log(dir,cmd);
	});

module.exports = program;
