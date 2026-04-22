import cron from "node-cron";
import { runSettlementService } from "../services/user/settlement.service.js";


  cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("Running settlement cron...");
      await runSettlementService();
      console.log("Settlement cron completed");
    } catch (error) {
      console.log("Settlement cron failed", error);
    }
  });
