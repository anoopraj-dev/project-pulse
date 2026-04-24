import Withdrawal from "../models/withdrawal.model.js";
import { processWithdrawalService } from "../services/doctor/withdrawal.service.js";

export const runWithdrawalCron = async () => {
  try {
    console.log("Withdrawal job started...");

    //----------- Get pending withdrawals ------------
    const withdrawals = await Withdrawal.find({
      status: "pending",
    }).limit(10);


    for (const withdrawal of withdrawals) {
      try {
        //----------- Process withdrawal ------------
        await processWithdrawalService(withdrawal._id);
      } catch (error) {
        console.error(
          "Withdrawal failed:",
          withdrawal._id,
          error.message
        );

        //----------- Mark failed ------------
        await Withdrawal.findByIdAndUpdate(withdrawal._id, {
          status: "failed",
          failureReason: error.message,
        });
      }
    }

    console.log("Withdrawal job completed");
  } catch (error) {
    console.error("Withdrawal cron error:", error);
  }
};