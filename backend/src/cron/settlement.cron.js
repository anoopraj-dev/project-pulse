import cron from "node-cron";
import { runSettlementService } from "../services/user/settlement.service.js";


  cron.schedule("*/1 * * * *", async () => {
    try {
      console.log("Running settlement check...");
      await runSettlementService();
      console.log("Settlement check completed");
    } catch (error) {
      console.error("Settlement check failed", error);
    }
  });
