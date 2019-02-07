// Classes
const Task = require("../Task/Task.js");
const LocalStorage = require("../Storage/LocalStorage/LocalStorage");

class Orchestrator {

	constructor({ task = new Task(), localStorage = new LocalStorage() } = {}) {
		this.task = task;
		this.localStorage = localStorage;
	}

	run(bachfile, options) {

		switch (bachfile.type) {
			case "task": {
				// single task, single data stream
				break;
			}
			case "mapper": {
				return this.runMapper(bachfile, options);
			}
		}

	}

	runMapper(bachfile, { dataUri, partition }) {
		// TODO: accept other uri types than local

		return this.localStorage.getTileReadStreams(dataUri, partition)
			.then(({ readStreams, fd }) => {
				return Promise.all(readStreams.map((readStream, i) => {
					console.time(`task ${i} - ${Math.round((readStream.end - readStream.start)/1e6)}mb`);

					return this.task.run({ bachfile, inputStream: readStream })
						.then(r => {
							console.timeEnd(`task ${i} - ${Math.round((readStream.end - readStream.start)/1e6)}mb`);
							return r;
						});
				})).then(result => {
					this.localStorage.fs.closeSync(fd);
					return result;
				});
			});
	}

	runStreamProcessor(bachfile, { inputStream, partition }){
		// read from input stream and split on delimiter defined in bachfile
		// use a load balancing strategy to send data chunk by chunk into the write stream for each partition
		// stream data out of paritions and recombine without ordering
		// TODO: if partition is set to 'auto' - scale partitions up and down based on input buffer length/some other constraint
	}

}

module.exports = Orchestrator;
