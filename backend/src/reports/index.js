import { buildPatientExport } from "../services/patient/export.service.js";
import { buildDoctorExport } from "../services/doctor/export.service.js";
import { buildAdminRevenueExport } from "../services/admin/export.service.js";

import { patientTemplate } from "./templates/patient.template.js";
import { doctorTemplate } from "./templates/doctor.template.js";
import { adminTemplate } from "./templates/admin.template.js";

export const REPORTS = {
  patient_full: {
    builder: buildPatientExport,
    template: patientTemplate,
  },

  doctor_full: {
    builder: buildDoctorExport,
    template: doctorTemplate,
  },

  admin_revenue_full: {
    builder: buildAdminRevenueExport,
    template: adminTemplate,
  },
};