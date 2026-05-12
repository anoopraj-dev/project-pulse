import { buildUTCDate } from "./timeUtils.js";

export const validateAdvanceBooking = (date, time, minHours = 1) => {
    const appointmentDateTime = buildUTCDate(date, time);
    const now = new Date();
    
    const diffInMs = appointmentDateTime - now;
    const requiredMs = minHours * 60 * 60 * 1000;

    if (diffInMs < requiredMs) {
        throw new Error(
            `Appointments must be booked at least ${minHours} hour(s) in advance`
        );
    }
};