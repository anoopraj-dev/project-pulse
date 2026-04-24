export const calculateSettlement = (consultation,payment) =>{
    const amount = payment.amount;
    const platformFee = amount*0.1;

    const doctor = consultation.participants?.doctor?.isPresent;
    const patient = consultation.participants?.patient?.isPresent;


    //----------- completed consultation ---------
    if(consultation.status === 'completed' && doctor && patient){
        return {
            type:'completed',
            platformFee,
            doctorPayout: amount - platformFee,
            patientRefund:0,
        }
    }

    //----------- doctor joined & patient didn't --------
    if(doctor && !patient){
        const remaining = amount - platformFee;

        return {
            type:'doctor_only_present',
            platformFee:0,
            doctorPayout: remaining*0.5,
            patientRefund:remaining*0.5,
        }
    }

    //------------- patient joined & doctor didn't ----------
    if(!doctor && patient){
        return {
            type:'patient_only_present',
            platformFee: 0,
            doctorPayout:0,
            patientRefund:amount
        }
    }

    //------------ no one joined -----------
    return {
        type:'no_show',
        platformFee:0,
        doctorPayout:0,
        patientRefund: amount
    }
}