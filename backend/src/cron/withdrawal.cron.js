import cron from 'node-cron';
import { runWithdrawalCron } from '../utils/withdrawal.js';

cron.schedule("*/1 * * * *", async () => {
  await runWithdrawalCron();
});