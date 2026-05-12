import Appointment from "../models/appointments.model.js";
import { buildUTCDate } from "./timeUtils.js";


export const expireAppointments = async () => {
    const now = new Date();

    const appointments = await Appointment.find({
        status: { $in: ['confirmed', 'ongoing', 'pending'] }
    }).populate('consultation');


    for (const appt of appointments) {
        const startTime = buildUTCDate(appt.appointmentDate, appt.timeSlot);

        const endTime = new Date(
            startTime.getTime() + (appt.duration + (appt.buffer || 0)) * 60000
        );

        if (now > endTime) {
            const consult = appt.consultation;

            // if consultation not completed
            if (!consult || consult.status !== 'completed') {

                // -------- Update Appointment --------
                appt.status = 'expired';
                await appt.save();

                // -------- Update Consultation --------
                if (consult) {
                    consult.status = 'cancelled'; 
                    await consult.save();
                }
            }
        }
    }

};