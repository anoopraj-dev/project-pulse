import crypto from 'crypto'
import Consultation from '../models/consultation.model.js'
import Appointment from '../models/appointments.model.js'

export const createConsultation = async ({appointmentId}) =>{
     //------------- Find appointment -----------
     const appointment = await Appointment.findById(appointmentId);

     if(!appointment){
        throw new Error('Appointment not found');
     }

     //--------- Prevent duplicate consultation -------------
     const existing = await Consultation.findOne({
        appointment:appointmentId
     });

     if(existing){
        return existing;
     }

     //------------- Generate session Id and token -----------
     const sessionId = crypto.randomUUID();

     const tokenExpiresAt = new Date(appointment.appointmentDate);
     tokenExpiresAt.setMinutes(
        tokenExpiresAt.getMinutes() + (appointment.duration || 30)+10
     );

     const consultation = await Consultation.create({
        appointment:appointmentId,
        patient:appointment.patient,
        doctor:appointment.doctor,
        sessionId,
        token:crypto.randomBytes(16).toString('hex'),
        tokenExpiresAt,
        status:'scheduled'
     })

     await consultation.save();

     await Appointment.findByIdAndUpdate(
        appointment._id,
        {
            consultation:consultation._id,
        }
     )

     return consultation;
}