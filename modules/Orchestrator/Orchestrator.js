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

	runMapper(bachfile, { dataUri }) {
		// TODO: accept other uri types than local
		const { tile } = bachfile;
		const { min } = tile;

		return this.localStorage.getTileReadStreams(dataUri, min)
			.then(readStreams => {
				return Promise.all(readStreams.map(readStream => {
					return this.task.run({ bachfile, inputStream: readStream });
				}));
			});

		// const size = this.localStorage.getFileSize(dataUri);
		// const goalTileSize = Math.round(size / min);
		// console.log(size,goalTileSize);
		// 1. find exact chunk markers in file
		// 2. create read stream for each file
		// 3. run a task for each tile, streaming the data in
	}

}

module.exports = Orchestrator;
