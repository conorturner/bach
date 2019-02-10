// Classes
const Task = require("../Task/Task.js");
const LocalStorage = require("../Storage/LocalStorage/LocalStorage");
const StreamCluster = require("../StreamCluster/StreamCluster");

class Orchestrator {

	constructor({ task = new Task(), localStorage = new LocalStorage() } = {}) {
		this.task = task;
		this.localStorage = localStorage;
	}

	run(bachfile, options) {

		switch (options.type) {
			case "task": {
				// single task, single data stream
				break;
			}
			case "block": {
				return this.runMapper(bachfile, options);
			}
			case "stream": {
				return this.runStreamProcessor(bachfile, options);
			}
		}

	}

	runMapper(bachfile, { dataUri, partition }) {
		// TODO: accept other uri types than local

		return this.localStorage.getTileReadStreams(dataUri, partition)
			.then(({ readStreams, fd }) => Promise.all(readStreams.map((readStream, i) => {
				console.time(`task ${ i } - ${ Math.round((readStream.end - readStream.start) / 1e6) }mb`);

				const env = { INPUT_TYPE: "stdin", BINARY: bachfile.binary, ARGS: JSON.stringify(bachfile.args) };
				const child = this.task.run({ bachfile, inputStream: readStream, env });

				return new Promise(resolve => child.on("close", (code) => {
					console.timeEnd(`task ${ i } - ${ Math.round((readStream.end - readStream.start) / 1e6) }mb`);
					resolve(code);
				}));
			})).then(result => {
				this.localStorage.fs.closeSync(fd);
				return result;
			}));
	}

	runStreamProcessor(bachfile, { inputStream, partition, target, ip }) {
		// TODO: if partition is set to 'auto' - scale partitions up and down based on input buffer length/some other constraint

		const streamCluster = new StreamCluster({ target, bachfile, callbackAddress: ip });
		streamCluster.setDesiredNodes(partition);
		streamCluster.pipeInputStream(inputStream);

		return new Promise(resolve => streamCluster.loadBalancer.on("close", resolve));
	}
}

module.exports = Orchestrator;
