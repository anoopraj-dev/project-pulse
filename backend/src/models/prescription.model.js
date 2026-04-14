import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    consultation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true,
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    medicines: [{
        medicine: {
            type: String,
            required: true,
        },
        dosage: {
            type: String,
            required: true,
        },
        timing: {
            type: String,
            enum: ['before', 'after'],
            required: true,
        },
    }],
}, {
    timestamps: true,
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;