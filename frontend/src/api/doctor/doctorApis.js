import { api } from "../axiosInstance";


// --------------- ONBOARDING  APIS----------------

//--------------- Personal Info-------------
export const submitDoctorPersonalInfo = (formData) => {
  return api.post("/api/doctor/personal-info", formData,{
    headers:{'Content-Type': 'multipart/form-data'}
  });
};

//-------------- Professional Info --------------
export const submitDoctorProfessionalInfo = (formData) => {
  return api.post("/api/doctor/professional-info", formData,{
    headers:{'Content-Type': 'multipart/form-data'}
  });
};

//---------------- Service Info -----------------
export const submitDoctorServicesInfo = (formData) => {
  return api.post("/api/doctor/services-info", formData);
};

// ------------------- PROFILE  PAGE APIS --------------

// -------- Fetch doctor profile --------
export const fetchDoctorProfile = () => {

    return api.get("/api/doctor/profile");  // Doctor viewing own profile
};

//------------ Verify documents (Admin) ------------
export const verifyDoctorDocuments = (id) => {
  return api.get(`/api/admin/doctor/${id}/documents`)
}

// -------- Approve doctor (Admin) --------
export const approveDoctorProfile = (doctorId) => {
  return api.patch(`/api/admin/doctor/approve/${doctorId}`);
};

// -------- Reject doctor (Admin) --------
export const rejectDoctorProfile = (id,formData) => {
  return api.patch(`/api/admin/doctor/reject/${id}`,formData);
};

//------------ Request Resubmission ------------------
export const requestResubmission = () => {
  return api.patch(`/api/doctor/request-resubmission`)
}

// ------------------- Resubmit Form -----------------
export const resubmitProfile = () => {
  return api.patch('/api/doctor/resubmit')
}

//------------- Update Profile --------------
export const updateDoctorProfile = (formData) => {
  return api.patch('/api/doctor/update-profile',formData,{
    headers:{'Content-Type': 'multipart/form-data'}
  })
}

//------------ Delete Certificate --------------
export const deleteDocuments = (id) => {
  return api.delete(`/api/doctor/delete-documents/${id}`)
}

// ------------------- AVAILABILITY ----------------
export const getAvailability = () => {
  return api.get('/api/doctor/availability');
};

export const saveAvailability = (payload) => {
  return api.post('/api/doctor/availability', payload);
};

// ------------------- Remove Unbooked Slot ----------------
export const removeAvailabilitySlot = (payload) => {
  return api.patch('/api/doctor/availability', payload);
};
//--------------------- APPOINTMENTS ----------------
export const fetchAppointments = () =>{
  return api.get('/api/doctor/appointments')
}

export const viewAppointmentDetails = (id) =>{
  return api.get(`/api/doctor/appointments/${id}`)
}


export const cancelAppointment = (id,reason) => {
  return api.patch(`/api/doctor/appointments/${id}`,reason)
}

//-------------------- VIEW PATIENT PROFILE ------------------
export const viewPatientProfile = (id) => {
  return api.get(`/api/doctor/appointments/patient-profile/${id}`)
}

export const getPatientMedicalRecords = (patientId) => {
  return api.get(`/api/doctor/appointments/patient-records/${patientId}`);
};

//------------------- PAYMENTS --------------------
export const fetchDoctorPayments = () =>{
  return api.get('/api/doctor/payments')
}


//-------------- consultation --------------
export const fetchPatientStats = (id) =>{
  return api.get(`/api/doctor/appointments/consultation/${id}`,)
}

export const endConsultation = (id) => {
  return api.patch(`/api/doctor/appointments/consultation/${id}/end`)
}

export const submitPrescription = (consultationId, prescriptionData) => {
  return api.post(`/api/doctor/appointments/consultation/${consultationId}/prescription`, prescriptionData)
}