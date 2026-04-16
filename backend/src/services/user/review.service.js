import Consultation from '../../models/consultation.model.js'
import Review from '../../models/review.model.js'

export const submitReviewService = async({
    consultationId,
    patientId,
    doctorId,
    rating,
    review
}) => {
    const consultation = await Consultation.findById(consultationId);
    
    if(!consultation){
        throw new Error('Consultation not found');
    }

    const isParticipant = 
        consultation.patient.toString() === patientId ||
        consultation.doctor.toString() === doctorId;

    if(!isParticipant){
        throw new Error('Unathorized action');
    }

    const existing = await Review.findOne({consultation:consultationId});

    if(existing){
        existing.rating = rating;
        existing.review = review;
        await existing.save();

        return existing;
    }

    const newReview = await Review.create({
        consultation:consultationId,
        patient:consultation.patient,
        doctor:consultation.doctor,
        rating,
        review:review || '',
    });

    return newReview;
}