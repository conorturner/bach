class Docker {

	constructor({ shell = require("shelljs") } = {}) {
		this.shell = shell;
	}

	createFromBachfile(path){
		this.shell.exec('git commit -am "Auto-commit"')
	}

}

module.exports = Docker;
