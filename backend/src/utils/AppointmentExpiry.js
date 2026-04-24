import Appointment from "../models/appointments.model.js";

export const expireAppointments = async () => {
    const now = new Date();

    const appointments = await Appointment.find({
        status: { $in: ['confirmed', 'ongoing'] }
    }).populate('consultation');

    for (const appt of appointments) {
        const [hours, minutes] = appt.timeSlot.split(':').map(Number);

        const startTime = new Date(appt.appointmentDate);
        startTime.setHours(hours, minutes, 0, 0);

        const endTime = new Date(
            startTime.getTime() + (appt.duration + appt.buffer) * 60000
        );

        if (now > endTime) {
            const consult = appt.consultation;

            // if consultation not completed
            if (!consult || consult.status !== 'completed') {

                // -------- Update Appointment --------
                appt.status = 'expired';
                await appt.save();

                // -------- Update Consultation --------
                if (consult && consult.status !== 'completed') {
                    consult.status = 'cancelled'; 
                    await consult.save();
                }
            }
        }
    }
};