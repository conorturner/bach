module.exports = ({
					  http = require("http"),
					  Task = require("../Task/Task")(),
					  HttpStorage = require("../Storage/HttpStorage/HttpStorage"),
					  uuidv4 = require("uuid/v4")
				  } = {}) => {

	class MapReduceCluster {

		constructor({ bachfile, nTasks, target, callbackAddress, callbackPort = 9001 } = {}) {
			this.bachfile = bachfile;
			this.callbackPort = callbackPort;
			this.callbackAddress = callbackAddress;
			this.target = target;
			this.tasks = [];
			this.server = http.createServer();
			this.server.on("listening", () => {
				this.startTasks(nTasks);
			});

			let sum = 0;
			this.server.on("request", (req, res) => {
				// console.log(req.url, req.headers)
				const taskId = MapReduceCluster.getTaskId(req.url);
				console.time(taskId);
				req.on("data", (data) => {
					// console.log(taskId)
					sum += data.length;
					// console.log(sum/1e6);
				});

				req.on("end", () => {
					console.timeEnd(taskId);
					res.end();
				});
				// res.end();
				// parse request
				// if request is a open event - stream into buffer
				// if request is a close event
				//   if close requires restart - call task restart
				//   else - emit task complete
			});
		}

		static getTaskId(url) {
			const regex = /([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})/ig;
			const result = regex.exec(url);
			if (result) return result[0];
		}

		startTasks(nTasks) {
			const httpStorage = new HttpStorage();

			console.time("httpStorage.getChunkIndexes");
			httpStorage.getChunkIndexes(this.dataUri, nTasks)
				.then(indexArray => {
					console.log(indexArray);
					console.timeEnd("httpStorage.getChunkIndexes");
					for (let i = 0; i < nTasks; i++) this.startTask(indexArray[i]);
				});

		}

		startTask({ start, end }) {
			const task = new Task({ bachfile: this.bachfile, target: this.target });

			const env = {
				INPUT_TYPE: "storage",
				BINARY: this.bachfile.binary,
				ARGS: this.target === "local" ? JSON.stringify(this.bachfile.args) : this.bachfile.args,
				SOURCE_HOST: this.callbackAddress,
				SOURCE_PORT: this.callbackPort,
				DATA_URI: this.dataUri,
				DATA_START: start,
				DATA_END: end,
				UUID: task.uuid // TODO: move this inside task class
			};

			task.run({ bachfile: this.bachfile, env }).catch(err => console.error("task.run", err));
			this.tasks.push(task);
		}

		run({ dataUri }) {
			this.dataUri = dataUri;
			this.server.listen(this.callbackPort);
			return Promise.resolve(); // await end event
		}
	}

	return MapReduceCluster;
};
