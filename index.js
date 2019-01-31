#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const fs = require("fs");
const program = require("commander");

const init = () => {
	console.log(
		chalk.green(
			figlet.textSync("bach-cli", {
				font: "roman",
				horizontalLayout: "default",
				verticalLayout: "default"
			})
		)
	);
};

const askQuestions = () => {
	const questions = [
		{
			name: "FILENAME",
			type: "input",
			message: "What is the name of the file without extension?"
		},
		{
			type: "list",
			name: "EXTENSION",
			message: "What is the file extension?",
			choices: [".rb", ".js", ".php", ".css"],
			filter: (val) => val.split(".")[1]
		}
	];
	return inquirer.prompt(questions);
};

const createFile = (filename, extension) => {
	const filePath = `${process.cwd()}/${filename}.${extension}`
	shell.touch(filePath);
	return filePath;
};

const success = filepath => {
	console.log(
		chalk.white.bgGreen.bold(`Done! File created at ${filepath}`)
	);
};

fs.readdirSync(__dirname + "/commands").map(name => require(`./commands/${name}`)); // auto load command files
program.parse(process.argv);
