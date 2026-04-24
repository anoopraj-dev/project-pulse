export const roles = {
  admin: ['approve_doctor', 'block_user', 'block_doctor', 'delete_user', 'view_patients', 'write_prescriptions'],
  doctor: ['view_patients', 'write_prescription', 'cancel_appointments'],
  patient: ['view_records', 'book_appointment'],
};
