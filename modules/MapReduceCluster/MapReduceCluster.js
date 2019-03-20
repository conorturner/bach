module.exports = ({
					  http = require("http"),
					  Task = require("../Task/Task")(),
					  tar = require("tar-fs"),
					  HttpStorage = require("../Storage/HttpStorage/HttpStorage")
				  } = {}) => {

	class MapReduceCluster {

		constructor({ bachfile, nTasks, target, callbackAddress, callbackPort = 9001 } = {}) {
			this.bachfile = bachfile;
			this.callbackPort = callbackPort;
			this.callbackAddress = callbackAddress;
			this.target = target;
			this.tasks = [];
			this.buffers = [];
			this.nComplete = 0;
			this.hasStarted = false; // not sure this flag is the best way
			this.server = http.createServer();
			this.server.on("listening", () => this.startTasks(nTasks));

			setTimeout(() => this.startupTimeout(), 150 * 1000);

			this.server.on("request", (req, res) => {
				this.hasStarted = true; // again, maybe not the best
				const type = req.url.split("/").pop();

				switch (type) { // SSR - super simple routing :D
					case "app": {
						// console.log("app");
						const tarStream = tar.pack(this.bachfile.src);
						tarStream.pipe(res);
						break;
					}
					case "heartbeat": {
						this.handleHeartbeatRequest(req, res);
						break;
					}
					case "callback": {
						// console.log("callback");
						this.handleCallbackRequest(req, res);
						break;
					}
					case "config": {
						// console.log("config");
						this.handleConfigRequest(req, res);
						break;
					}
					case "close": {
						// console.log("close");
						this.handleCloseRequest(req, res);
						break;
					}
					default: {
						console.log("unknown type:", type);
					}
				}
			});
		}

		onTaskComplete() {
			this.nComplete++;
			if (this.nComplete === this.tasks.length) {
				console.log(Buffer.concat(this.buffers).toString());
				console.log(Object.keys(this.buffers).reduce((acc, buffer) => buffer.length + acc, 0));
				console.timeEnd("time");
				this.server.close();
				this.cleanUpResources();
			}
		}

		handleConfigRequest(req, res) {
			const taskId = MapReduceCluster.getTaskId(req.url);
			const task = this.getTask({ taskId });
			const config = JSON.stringify({
				BINARY: this.bachfile.binary,
				ARGS: this.bachfile.args,
				TASK_TYPE: "mapper",
				DATA_URI: this.dataUri,
				DATA_START: task.byteRange.start,
				DATA_END: task.byteRange.end // the index of this may need to be -1
			});

			res.end(config);
		}

		handleCallbackRequest(req, res) {
			const taskId = MapReduceCluster.getTaskId(req.url);
			let chunks = [];
			req.on("data", (data) => {
				chunks.push(data);
			});

			req.on("end", () => {
				this.buffers.push(Buffer.concat(chunks));
				res.end();
			});
		}

		handleCloseRequest(req, res) {
			res.end();

			const taskId = MapReduceCluster.getTaskId(req.url);
			const bytesRead = parseInt(req.headers.consumed, 10);
			const task = this.getTask({ taskId });
			const targetBytesRead = (task.byteRange.end - task.byteRange.start) + 1; // because end index is inclusive e.g. (start=0, end=1, bytes 0 and 1 are read so n=2)

			if (bytesRead === targetBytesRead) {
				console.log("Task complete:", taskId);
				this.onTaskComplete();
				// TODO: cleanup of resources used for the given task need to be cleared up here e.g. delete/stop vms
			}
			else {
				console.log(`Task preempted with ${targetBytesRead - bytesRead} bytes remaining:`, taskId);
				this.startTask({ uuid: taskId, start: task.byteRange.start + bytesRead, end: task.byteRange.end });
			}
		}

		handleHeartbeatRequest(req, res) {
			res.end();

			const taskId = MapReduceCluster.getTaskId(req.url);
			const progress = parseInt(req.headers.progress, 10);
			const task = this.getTask({ taskId });
			const targetBytesRead = (task.byteRange.end - task.byteRange.start) + 1; // because end index is inclusive e.g. (start=0, end=1, bytes 0 and 1 are read so n=2)

			console.log(req.url, `${progress}/${targetBytesRead} (${Math.round((progress / targetBytesRead) * 100)}%)`);
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

		getTask({ taskId }) {
			const taskIndex = this.tasks.findIndex(({ uuid }) => uuid === taskId);
			return this.tasks[taskIndex];
		}

		setTask({ taskId, task }) {
			const taskIndex = this.tasks.findIndex(({ uuid }) => uuid === taskId);
			this.tasks[taskIndex] = task;
		}

		startTask({ start, end, uuid }) {
			const task = new Task({ bachfile: this.bachfile, target: this.target, uuid });
			const env = { CALLBACK_ENDPOINT: `http://${this.callbackAddress}:${this.callbackPort}/${task.uuid}` };

			if (uuid === undefined) this.tasks.push(task); // task must be in task array before run is called.
			else this.setTask({ taskId: uuid, task });

			task.byteRange = { start, end }; // TODO: move this somewhere better
			task.run({ bachfile: this.bachfile, env }).catch(err => console.error("task.run", err));
		}

		run({ dataUri }) {
			console.time("time");
			this.dataUri = dataUri;
			this.server.listen(this.callbackPort);
			return Promise.resolve(); // await end event
		}

		startupTimeout() {
			if (!this.hasStarted) {
				console.log("timeout on startup");
				this.cleanUpResources();
			}
		}

		cleanUpResources() {
			switch (this.target) {
				case "gce": {
					Promise.all(this.tasks.map(task => task.delete()))
						.then(() => console.log("cleaned up"))
						.catch(console.error);
				}
			}
		}
	}

	return MapReduceCluster;
};
