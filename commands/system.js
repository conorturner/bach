const os = require("os");
const program = require("commander");
const asciichart = require("asciichart");

// const System = require("../modules/System/System");
//
// program
// 	.command("monitor")
// 	.option("-j, --json", "Output as json flag")
// 	.action((cmd) => {
// 		const system = new System();
// 		system.record();
//
// 		process.on("SIGINT", () => {
// 			system.stop();
//
// 			const report = system.report();
//
// 			if (cmd.json) console.log(JSON.stringify(report));
// 			else {
// 				console.log("CPU Usage (%)");
// 				console.log(asciichart.plot(
// 					report.map(({ cpuUsage }) => cpuUsage),
// 					{ height: 10 }
// 				));
//
// 				console.log("Memory Usage (%)");
// 				console.log(asciichart.plot(
// 					report.map(({ memUsage }) => memUsage),
// 					{ height: 10 }
// 				));
// 			}
// 		});
//
// 	});

module.exports = program;
