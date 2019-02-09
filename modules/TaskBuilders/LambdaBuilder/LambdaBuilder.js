const TaskBuilder = require("../TaskBuilder/TaskBuilder");

class LambdaBuilder extends TaskBuilder {
	constructor({ path }) {
		super({ path });
	}

	build(bachfile){
		this.inject(`${__dirname}/injections/lambda-wrapper.js`, "/build/.lambda-wrapper.js");
		return Promise.resolve();
	}

	deploy(bachfile){


	}
}

module.exports = LambdaBuilder;
