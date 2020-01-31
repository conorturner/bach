class GoogleCloud {

	constructor({ childProcess = require("child_process") } = {}) {
		this.childProcess = childProcess;
	}

	deployCloudFunction({ path, name, runtime, entry, trigger }) {
		const cmd = `gcloud functions deploy ${ name } --runtime ${ runtime } --entry-point ${ entry } --trigger-topic ${ trigger } --region europe-west1 --memory=512 --timeout=540`;
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
	}

	sendPubSubMessage({ name, message }) {
		const cmd = `gcloud pubsub topics publish ${ name } --message ${ JSON.stringify(JSON.stringify(message)) }`;

		return new Promise((resolve, reject) => {
			this.childProcess.exec(cmd, (error, stdout, stderr) =>
				error ? reject(error) : resolve({ stdout, stderr }));
		});
	}
}

module.exports = GoogleCloud;
