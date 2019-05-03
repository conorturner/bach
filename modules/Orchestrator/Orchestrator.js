// Classes
const StreamCluster = require("../StreamCluster/StreamCluster");
const MapReduceCluster = require("../MapReduceCluster/MapReduceCluster")();

class Orchestrator {

	static run(bachfile, options) {

		switch (options.type) {
			case "task": {
				// single task, single data stream
				break;
			}
			case "block": {
				return Orchestrator.runMapCluster(bachfile, options);
			}
			case "stream": {
				return Orchestrator.runStreamCluster(bachfile, options);
			}
		}
	}

	static runMapCluster(bachfile, { dataUri, partition, target, ip }) {
		const mapReduceCluster = new MapReduceCluster({ bachfile, nTasks: partition, target, callbackAddress: ip });
		return mapReduceCluster.run({ dataUri });
	}

	static runStreamCluster(bachfile, { inputStream, partition, target, ip, lb, max }) {
		const streamCluster = new StreamCluster({ partition, target, bachfile, callbackAddress: ip, nWorkers: lb, max });
		inputStream.pipe(streamCluster);

		return Promise.resolve();
	}
}

module.exports = Orchestrator;
