import { getCPUUsage } from "./cpuUsage.js";

export const AlertRules = {
  slowApi(duration) {
    if (duration > 200) {
      return {
        title: "Slow API response",
        severity: "high",
        description: `Response time ${duration} ms`,
        service: "api",
      };
    }
  },

  errorRate(errors) {
    if (errors > 5) {
      return {
        title: "High API error rate",
        severity: "critical",
        description: `${errors}% errors detected`,
        service: "api",
      };
    }
  },

  cpuUsage() {
    const cpuPercent = getCPUUsage(); 

    if (cpuPercent > 80) {
      return {
        title: "High CPU usage",
        severity: cpuPercent > 90 ? "critical" : "high",
        description: `CPU usage at ${cpuPercent}%`,
        service: "system",
      };
    }
  },
};