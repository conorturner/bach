const Throttle = require("throttle");
const throttle = new Throttle(parseInt(process.argv.pop(),10) * 1e6);
process.stdin.pipe(throttle).pipe(process.stdout);
