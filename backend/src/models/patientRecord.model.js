import mongoose, { Schema } from "mongoose";

const PatientRecordSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    uploadedBy: {
      type: String,
      enum: ["patient", "doctor"],
      default: "patient",
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["lab", "imaging", "prescription", "other"],
      default: "other",
    },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    cloudinaryId: { type: String },
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
  },
  { collection: "patient_records", timestamps: true }
);

const PatientRecord = mongoose.model("PatientRecord", PatientRecordSchema);
export default PatientRecord;
