const TaskBuilder = require("../TaskBuilder/TaskBuilder");

class CloudFunctionBuilder extends TaskBuilder {
	constructor({ path }) {
		super({ path });
	}

	build(bachfile) {
		this.inject(`${__dirname}/injections/cloud-function-wrapper.js`, "/build/function.js");
		// this.inject(`${__dirname}/injections/.gcf.package.json`, "/build/package.json");
		return Promise.resolve({});
	}

	deploy(bachfile) {
		const name = bachfile["logical-name"];
		try {
			this.childProcess.execSync(`gcloud pubsub topics create bach-${name}`, { stdio: [null, null, null] });
		}
		catch (e) {
			if (e.message && e.message.includes("Resource already exists in the project"))
				console.log(`- pub/sub topic bach-${name} exits`);
			else throw e;
		}

		const cmd = `gcloud functions deploy bach-${name} --runtime nodejs8 --entry-point invoke --trigger-topic bach-${name}`;
		const wrapper = `cd ${this.path}/build ; ${cmd}`;


		return new Promise((resolve, reject) => {
			this.childProcess.exec(wrapper, (error, stdout, stderr) =>
				error ? reject(error) : resolve({ stdout, stderr }));
		});
	}
}

module.exports = CloudFunctionBuilder;
