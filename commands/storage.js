const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const program = require("commander");

const LocalStorage = require("../modules/Storage/LocalStorage/LocalStorage");

const localStorage = new LocalStorage();

program
	.command("storage [command] [uri]")
	.usage("create-index [uri]")
	.option("-r, --recursive", "Placeholder")
	.action((command, uri, cmd) => {
		if (!cmd) return console.log("Please specific a data uri"); //TODO: create dynamic inquirer based prompt system for leading through local/cloud storage to select one

		if (/[a-z/.]/i.test(uri)) {
			let path, cwd = process.cwd();

			if (uri.startsWith("./")) path = uri.replace("./", cwd, 1);
			else if (uri.startsWith("/")) path = uri;
			else path = `${cwd}/${uri}`;

			console.log(path);

			console.time("gen index");
			localStorage.createDelimiterIndex(path)
				.then(result => {
					console.timeEnd("gen index");
					console.log(result);
				})
				.catch(console.error);
		}
	});

module.exports = program;
