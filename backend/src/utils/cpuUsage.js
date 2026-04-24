import os from "os";

export function getCPUUsage() {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach((core) => {
    for (let type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });

  const idleAvg = idle / cpus.length;
  const totalAvg = total / cpus.length;

  return 100 - Math.floor((idleAvg / totalAvg) * 100);
}