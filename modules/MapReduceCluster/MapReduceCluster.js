module.exports = ({
					  http = require("http"),
					  Task = require("../Task/Task")(),
					  HttpStorage = require("../Storage/HttpStorage/HttpStorage")
				  } = {}) => {

	class MapReduceCluster {

		constructor({ bachfile, nTasks, target, callbackAddress, callbackPort = 9001 } = {}) {
			this.bachfile = bachfile;
			this.callbackPort = callbackPort;
			this.callbackAddress = callbackAddress;
			this.target = target;
			this.tasks = [];
			this.buffers = {};
			this.server = http.createServer();
			this.server.on("listening", () => this.startTasks(nTasks));

			this.server.on("request", (req, res) => {
				// console.log(req.url, req.headers)
				const type = req.url.split("/").pop();

				switch (type) { // SSR - super simple routing :D
					case "callback": {
						this.handleCallbackRequest(req, res);
						break;
					}
					case "end": {
						this.handleEndRequest(req, res);
						break;
					}
					default: {
						console.log("unknown type:", type);
					}
				}
			});
		}

		handleCallbackRequest(req, res) {
			const taskId = MapReduceCluster.getTaskId(req.url);
			let chunks = [];
			req.on("data", (data) => {
				chunks.push(data);
			});

			req.on("end", () => {
				if (this.buffers[taskId]) this.buffers[taskId] = Buffer.concat([this.buffers[taskId], ...chunks]);
				else this.buffers[taskId] = Buffer.concat(chunks);
				res.end();
			});
		}

		handleEndRequest(req, res) {
			res.end();

			const taskId = MapReduceCluster.getTaskId(req.url);
			const bytesRead = parseInt(req.headers.consumed.split("=").pop(), 10);

			const taskIndex = this.tasks.findIndex(({ uuid }) => uuid === taskId);
			const task = this.tasks[taskIndex];
			const targetBytesRead = (task.byteRange.end - task.byteRange.start);

			if (bytesRead === targetBytesRead) {
				console.log("Completed read precisely.");
				console.log(Object.keys(this.buffers).map(key => this.buffers[key].length));
			}
			else {
				if (bytesRead > targetBytesRead) {
					console.log("Over read", JSON.stringify(Object.assign({
						taskId,
						bytesRead,
						targetBytesRead
					}, task.byteRange)));
					return;
				}
				console.log(JSON.stringify(Object.assign({ taskId, bytesRead, targetBytesRead }, task.byteRange)));
				const newStart = task.byteRange.start + bytesRead;
				this.startTask({ start: newStart, end: task.byteRange.end, uuid: taskId, index: taskIndex });
			}
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
				})
				.catch(error => console.error("error starting tasks", error));

		}

		startTask({ start, end, uuid, index }) {
			const task = new Task({ bachfile: this.bachfile, target: this.target, uuid });

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

			task.byteRange = { start, end }; // TODO: move this somewhere better
			task.run({ bachfile: this.bachfile, env }).catch(err => console.error("task.run", err));
			if (index === undefined) this.tasks.push(task);
			else this.tasks[index] = task;
		}

		run({ dataUri }) {
			this.dataUri = dataUri;
			this.server.listen(this.callbackPort);
			return Promise.resolve(); // await end event
		}
	}

	return MapReduceCluster;
};
