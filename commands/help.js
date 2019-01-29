const program = require("commander");
const {version, description} = require("../package.json");

program.version(version).description(description);

module.exports = program;
