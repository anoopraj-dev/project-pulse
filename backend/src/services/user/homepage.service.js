
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import Appointment from "../../models/appointments.model.js";

export const getHomepageStats = async () => {
  const results = await Promise.allSettled([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Appointment.countDocuments(),
  ]);

  const [doctors, patients, appointments] = results.map((r) =>
    r.status === "fulfilled" ? r.value : 0
  );

  return {
    doctors,
    patients,
    appointments,
  };
};