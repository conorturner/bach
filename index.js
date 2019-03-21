#!/usr/bin/env node

const fs = require("fs");
const program = require("commander");
const debug = require("debug");
debug.enable("*");

fs.readdirSync(__dirname + "/commands").map(name => require(`./commands/${name}`)); // auto load command files
program.parse(process.argv);
