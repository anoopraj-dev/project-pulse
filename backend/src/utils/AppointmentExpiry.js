import Appointment from "../models/appointments.model.js";
import { buildUTCDate } from "./timeUtils.js";
import { createNotification } from "../services/user/notification.service.js";
import { sendEmail } from "../config/nodemailer.js";
import { emailTemplate } from "./emailTemplate.js";


export const expireAppointments = async () => {
    const now = new Date();

    const appointments = await Appointment.find({
        status: { $in: ['confirmed', 'ongoing', 'pending'] }
    }).populate('consultation').populate('patient').populate('doctor');


    for (const appt of appointments) {
        const startTime = buildUTCDate(appt.appointmentDate, appt.timeSlot);

        const endTime = new Date(
            startTime.getTime() + (appt.duration + (appt.buffer || 0)) * 60000
        );

        if (now > endTime) {
            const consult = appt.consultation;

            // if consultation not completed
            if (!consult || consult.status !== 'completed') {

                // ---------------- UPDATE APPOINTMENT ----------------
                appt.status = 'expired';
                await appt.save();

                // ---------------- UPDATE CONSULTATION ----------------
                if (consult) {
                    consult.status = 'cancelled'; 
                    await consult.save();
                }

                // ---------------- NOTIFICATIONS AND EMAILS ----------------
                const { patient, doctor } = appt;
                const appointmentDateString = new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                if (patient) {
                    try {
                        // Patient Notification
                        await createNotification({
                            userId: patient._id.toString(),
                            role: 'patient',
                            title: 'Appointment Expired',
                            message: `Your appointment with Dr. ${doctor?.name || 'Doctor'} scheduled for ${appointmentDateString} at ${appt.timeSlot} has expired.`
                        });

                        // Patient Email
                        if (patient.email) {
                            sendEmail({
                                from: `"PULSE360" <${process.env.GMAIL_USER}>`,
                                to: patient.email,
                                subject: "Appointment Expired - Refund Processed",
                                html: emailTemplate({
                                    title: "Appointment Expired",
                                    subtitle: "PULSE360 Appointment Update",
                                    body: `<p>Hello <strong>${patient.name}</strong>,</p>
                                           <p>Your appointment with <strong>Dr. ${doctor?.name || 'Doctor'}</strong> scheduled for <strong>${appointmentDateString}</strong> at <strong>${appt.timeSlot}</strong> has expired as it was not completed.</p>
                                           <p>A full refund of the appointment amount has been initiated and will be credited to your wallet shortly.</p>`,
                                    highlightText: "Refund Processed to Wallet",
                                    highlightType: "success"
                                })
                            }).catch(err => console.error("Error sending patient expiry email:", err.message));
                        }
                    } catch (err) {
                        console.error("Error processing patient expiry notification/email:", err.message);
                    }
                }

                if (doctor) {
                    try {
                        // Doctor Notification
                        await createNotification({
                            userId: doctor._id.toString(),
                            role: 'doctor',
                            title: 'Appointment Expired',
                            message: `Your appointment with ${patient?.name || 'Patient'} scheduled for ${appointmentDateString} at ${appt.timeSlot} has expired.`
                        });

                        // Doctor Email
                        if (doctor.email) {
                            sendEmail({
                                from: `"PULSE360" <${process.env.GMAIL_USER}>`,
                                to: doctor.email,
                                subject: "Appointment Expired",
                                html: emailTemplate({
                                    title: "Appointment Expired",
                                    subtitle: "PULSE360 Appointment Update",
                                    body: `<p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
                                           <p>Your scheduled appointment with <strong>${patient?.name || 'Patient'}</strong> on <strong>${appointmentDateString}</strong> at <strong>${appt.timeSlot}</strong> has expired as the consultation session was not completed.</p>
                                           <p>No payout has been credited for this session.</p>`,
                                    highlightText: "Session Expired",
                                    highlightType: "warning"
                                })
                            }).catch(err => console.error("Error sending doctor expiry email:", err.message));
                        }
                    } catch (err) {
                        console.error("Error processing doctor expiry notification/email:", err.message);
                    }
                }
            }
        }
    }

};