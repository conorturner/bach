const { CALLBACK_ENDPOINT } = process.env;

const Slave = require("./modules/Slave");
const Mapper = require("./modules/Mapper");
const Streamer = require("./modules/Streamer");
const slave = new Slave({ CALLBACK_ENDPOINT });

slave.init()
	.then((config) => {
		const { TASK_TYPE, DATA_URI, DATA_START, DATA_END, BINARY, ARGS } = config;

		switch (TASK_TYPE) {
			case "mapper": {
				const mapper = new Mapper({ CALLBACK_ENDPOINT, DATA_URI, DATA_START, DATA_END, BINARY, ARGS });
				return mapper.run();
			}
			case "stream": {
				const streamer = new Streamer({ CALLBACK_ENDPOINT, BINARY, ARGS });
				return streamer.start();
			}
			default: {
				break;
			}
		}
	})
	.catch(error => {
		console.log("error getting config", error);
		process.exit(1);
	});

process.on("uncaughtException", (err) => {
	console.error(err);
	process.exit(1);
});
