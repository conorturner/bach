// Classes
const StreamCluster = require("../StreamCluster/StreamCluster");
const MapReduceCluster = require("../MapReduceCluster/MapReduceCluster")();

class Orchestrator {

	run(bachfile, options) {

		switch (options.type) {
			case "task": {
				// single task, single data stream
				break;
			}
			case "block": {
				return this.runMapCluster(bachfile, options);
			}
			case "stream": {
				return this.runStreamCluster(bachfile, options);
			}
		}

	}

	runMapCluster(bachfile, { dataUri, partition, target, ip }) {
		const mapReduceCluster = new MapReduceCluster({ bachfile, nTasks: partition, target, callbackAddress: ip });
		return mapReduceCluster.run({ dataUri });
	}

	runStreamCluster(bachfile, { inputStream, partition, target, ip, lb }) {
		// TODO: if partition is set to 'auto' - scale partitions up and down based on input buffer length/some other constraint

		const streamCluster = new StreamCluster({ target, bachfile, callbackAddress: ip, nWorkers: lb });
		streamCluster.setDesiredNodes(partition);
		return streamCluster.pipeInputStream(inputStream);
	}
}

module.exports = Orchestrator;
