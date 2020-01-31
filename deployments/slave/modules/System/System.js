class System {

	constructor({ os = require("os") } = {}) {
		this.os = os;
		this.sysTrace = [];
		this.previousCpu = this.os.cpus();
	}

	start({ interval = 100 } = {}) {
		this.interval = setInterval(() => this.record(), interval);
	}

	record(){
		const usage = {
			cpuTime: this.getCpuUsage(this.previousCpu),
			mem: {
				free: this.os.freemem(),
				total: this.os.totalmem()
			}
		};

		this.sysTrace.push(usage);
		this.previousCpu = this.os.cpus();

		return usage;
	}

	stop() {
		clearInterval(this.interval);
	}

	report() {
		return this.sysTrace.map(usage => this.getPercentages(usage));
	}

	getPercentages({ cpuTime, mem }){
		return {
			cpuUsage: (1 - cpuTime.idle / (cpuTime.user + cpuTime.sys + cpuTime.idle + cpuTime.nice + cpuTime.irq)) * 100,
			memUsage: (1 - mem.free / mem.total) * 100
		};
	}

	getCpuUsage(previous) {
		if (!previous) throw new Error("Can only calculate usage in an interval");

		const current = this.os.cpus();

		const delta = previous.map((cpu, index) => {
			const { times: { user: u1, nice: n1, sys: s1, idle: id1, irq: ir1 } } = cpu;
			const { times: { user: u2, nice: n2, sys: s2, idle: id2, irq: ir2 } } = current[index];

			return Object.assign(cpu, {
				times: {
					user: u2 - u1,
					nice: n2 - n1,
					sys: s2 - s1,
					idle: id2 - id1,
					irq: ir2 - ir1
				}
			});
		});

		const sum = delta
			.reduce((acc, { times }) => ({
				user: acc.user + times.user,
				nice: acc.nice + times.nice,
				sys: acc.sys + times.sys,
				idle: acc.idle + times.idle,
				irq: acc.irq + times.irq
			}), { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 });

		return {
			user: sum.user / delta.length,
			nice: sum.nice / delta.length,
			sys: sum.sys / delta.length,
			idle: sum.idle / delta.length,
			irq: sum.irq / delta.length
		};
	}

}

module.exports = System;
