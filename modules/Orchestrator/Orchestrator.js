// Classes
const Task = require("../Task/Task.js");
const LocalStorage = require("../Storage/LocalStorage/LocalStorage");
const LoadBalancer = require("../LoadBalancer/LoadBalancer");

class Orchestrator {

	constructor({ task = new Task(), localStorage = new LocalStorage(), loadBalancer = new LoadBalancer() } = {}) {
		this.task = task;
		this.localStorage = localStorage;
		this.loadBalancer = loadBalancer;
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
				console.time(`task ${i} - ${Math.round((readStream.end - readStream.start) / 1e6)}mb`);

				const env = { INPUT_TYPE: "stdin", BINARY: bachfile.binary, ARGS: JSON.stringify(bachfile.args) };
				const child = this.task.run({ bachfile, inputStream: readStream, env });

				return new Promise(resolve => child.on("close", (code) => {
					console.timeEnd(`task ${i} - ${Math.round((readStream.end - readStream.start) / 1e6)}mb`);
					resolve(code);
				}));
			})).then(result => {
				this.localStorage.fs.closeSync(fd);
				return result;
			}));
	}

	runStreamProcessor(bachfile, { inputStream, partition }) {
		// read from input stream and split on delimiter defined in bachfile
		// stream data out of paritions and recombine without ordering
		// output chunks returned from processes may not be split on delimiter so some buffering will be required to prevent event corruption
		// TODO: if partition is set to 'auto' - scale partitions up and down based on input buffer length/some other constraint

		return this.loadBalancer.open()
			.then(({ server, localIp }) => {

				const { port } = server.address();
				const SOURCE_HOST = localIp;

				// const env = {
				// 				// 	INPUT_TYPE: "tcp",
				// 				// 	BINARY: bachfile.binary,
				// 				// 	ARGS: JSON.stringify(bachfile.args),
				// 				// 	SOURCE_HOST,
				// 				// 	SOURCE_PORT: port
				// 				// };

				const env = {
					INPUT_TYPE: 'tcp',
					BINARY: 'node',
					ARGS: JSON.stringify(['bin.js']),
					SOURCE_HOST: '1.1.1.1',
					SOURCE_PORT: '8080'
				};
				const tasks = new Array(partition).fill(null).map(() => this.task.run({ bachfile, env }));

				return this.loadBalancer.awaitSockets(tasks.length)
					.then(sockets => new Promise(resolve => {

						let remainder = "", roundRobin = 0;
						inputStream.on("readable", () => {
							let chunk;

							while ((chunk = inputStream.read()) !== null) { // TODO: throttle this based on upstream back pressure

								const string = remainder + chunk.toString();
								const units = string.split(bachfile.delimiter);
								remainder = units.splice(-1, 1)[0]; // take last chunk to append to next

								units.forEach(unit => {
									// use a load balancing strategy to send data chunk by chunk into the write stream for each partition
									sockets[roundRobin].write(unit + bachfile.delimiter);
									roundRobin = (roundRobin + 1) % tasks.length;
								});

							}

						});

						inputStream.on("end", () => {
							sockets.forEach(stream => stream.end(null)); // send end of stream to tasks

							Promise.all(tasks.map(task => new Promise(r => task.on("close", (code) => r(code)))))
								.then((result) => {
									this.loadBalancer.close();
									console.log(result);
									resolve();
								})
								.catch(err => {
									console.error(err);
									resolve();
								});
						});
					}));
			});
	}
}

module.exports = Orchestrator;
