import { buildUTCDate } from "./timeUtils.js";

export const validateAdvanceBooking = (date, time, minHours = 0) => {
    const appointmentDateTime = buildUTCDate(date, time);
    const now = new Date();
    
    const diffInMs = appointmentDateTime - now;
    const requiredMs = minHours * 60 * 60 * 1000;

    if (diffInMs < requiredMs) {
        if (minHours === 0) {
            throw new Error("Cannot book appointments in the past");
        }
        throw new Error(
            `Appointments must be booked at least ${minHours} hour(s) in advance`
        );
    }
};