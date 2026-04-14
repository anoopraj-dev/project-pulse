export const validateAdvanceBooking = (date,time,minHours = 1) =>{
    const [hours,minutes] = time.split(':').map(Number);

    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(hours,minutes,0,0);

    const now = new Date();
    const diffInMs = appointmentDateTime - now;

    const requiredMs = minHours*1*60*1000;

    if(diffInMs < requiredMs){
        throw new Error(
            `Appointments must be booked atleast ${minHours} hour(s) in advance`
        )
    }
}