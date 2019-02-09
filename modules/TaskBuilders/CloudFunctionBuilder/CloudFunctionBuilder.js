const TaskBuilder = require("../TaskBuilder/TaskBuilder");
const GoogleCloud = require("../../GoogleCloud/GoogleCloud");

class CloudFunctionBuilder extends TaskBuilder {
	constructor({ path, googleCloud = new GoogleCloud() }) {
		super({ path });
		this.googleCloud = googleCloud;
	}

	build(bachfile) {
		this.mkdir("build/child");
		this.mkdir("build/parent");
		this.copySrc("build/child");
		this.inject(`${ __dirname }/injections/cloud-function-wrapper.js`, "/build/child/function.js");
		// this.inject(`${__dirname}/injections/.gcf.package.json`, "/build/package.json");
		return Promise.resolve({});
	}

	deploy(bachfile) {
		const name = bachfile["logical-name"];
		const childName = `bach-${ name }-child`;
		const parentName = `bach-${ name }-parent`;
		const topicName = `bach-${ name }-start-child`;

		return this.googleCloud.createPubSubTopic({ name: topicName })
			.then(result => {
				if (result.status === "exists") console.log(`- pub/sub topic ${ topicName } exits`);
				else console.log(`- pub/sub topic ${ topicName } created`);

				return this.googleCloud.deployCloudFunction({
					path: `${ this.path }/build/child`,
					name: childName,
					runtime: "nodejs8",
					entry: "invoke",
					trigger: topicName
				});

			});

	}
}

module.exports = CloudFunctionBuilder;
