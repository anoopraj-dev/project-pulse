export const calculateSettlement = (consultation, payment) => {
    const amount = payment.amount;
    const platformFee = amount * 0.1;

    // Use isPresent or joinedAt to determine presence
    const doctor = consultation.participants?.doctor?.isPresent || !!consultation.participants?.doctor?.joinedAt;
    const patient = consultation.participants?.patient?.isPresent || !!consultation.participants?.patient?.joinedAt;

    // ----------- Completed consultation (Both present and status is completed) ---------
    if (consultation.status === 'completed' && doctor && patient) {
        return {
            type: 'completed',
            platformFee,
            doctorPayout: amount - platformFee,
            patientRefund: 0,
        };
    }

    // ------------- If anyone missed (Doctor or Patient or Both) ----------
    // As per requirement: "If a consultation is not joined by either of the user or both... payment made should be refund"
    if (!doctor || !patient) {
        return {
            type: !doctor && !patient ? 'no_show' : !doctor ? 'doctor_no_show' : 'patient_no_show',
            platformFee: 0,
            doctorPayout: 0,
            patientRefund: amount
        };
    }

    // Default case (e.g. both joined but disconnected/cancelled without completion)
    // We'll still refund if it's not 'completed' but both were there? 
    // Usually yes, or follow the specific cancelled logic if needed.
    return {
        type: 'cancelled_early',
        platformFee: 0,
        doctorPayout: 0,
        patientRefund: amount
    };
};