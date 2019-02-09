class GoogleCloud {

	constructor({ childProcess = require("child_process") } = {}) {
		this.childProcess = childProcess;
	}

	deployCloudFunction({ path, name, runtime, entry, trigger }) {
		const cmd = `gcloud functions deploy ${ name } --runtime ${ runtime } --entry-point ${ entry } --trigger-topic ${trigger}`;
		const wrapper = `cd ${ path } ; ${ cmd }`;


		return new Promise((resolve, reject) => {
			this.childProcess.exec(wrapper, (error, stdout, stderr) =>
				error ? reject(error) : resolve({ stdout, stderr }));
		});
	}

	createPubSubTopic({ name }) {
		const cmd = `gcloud pubsub topics create ${ name }`;

		return new Promise((resolve, reject) => {
			this.childProcess.exec(cmd, (error, stdout, stderr) => {
				if (error)
					if (error.message && error.message.includes("Resource already exists in the project"))
						return resolve({ status: "exists" });
					else reject(error);

				else resolve({ status: "ok", stdout, stderr });
			});
		});
		//
		// try {
		// 	this.childProcess.execSync(`gcloud pubsub topics create bach-${ name }`, { stdio: [null, null, null] });
		// }
		// catch (e) {
		// 	if (e.message && e.message.includes("Resource already exists in the project"))
		// 		console.log(`- pub/sub topic bach-${ name } exits`);
		// 	else throw e;
		// }
	}
}

module.exports = GoogleCloud;