const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const program = require("commander");

program
	.command('rm <dir>')
	.option('-r, --recursive', 'Remove recursively')
	.action((dir, cmd) => {
		console.log('remove ' + dir + (cmd.recursive ? ' recursively' : ''))
	});

module.exports = program;
