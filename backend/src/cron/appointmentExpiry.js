import cron from 'node-cron'
import { expireAppointments } from '../utils/AppointmentExpiry.js';
cron.schedule("*/10 * * * *", async () => {
    try {
        await expireAppointments();
        console.log('Expired appoinments check completed');
    } catch (error) {
        console.log(error)
    }
})