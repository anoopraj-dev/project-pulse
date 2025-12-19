import { api } from "../axiosInstance";


// --------------- ONBOARDING  APIS----------------

//--------------- Personal Info-------------
export const submitDoctorPersonalInfo = (formData) => {
  return api.post("/api/doctor/personal-info", formData);
};

//-------------- Professional Info --------------
export const submitDoctorProfessionalInfo = (formData) => {
  return api.post("/api/doctor/professional-info", formData);
};

//---------------- Service Info -----------------
export const submitDoctorServicesInfo = (formData) => {
  return api.post("/api/doctor/services-info", formData);
};



// ------------------- PROFILE  PAGE APIS --------------

// -------- Fetch doctor profile --------
export const fetchDoctorProfile = (id) => {
  if (id) {

    return api.get(`/api/admin/doctor/${id}`);  // Admin reviewing doctor profile
  }
    return api.get("/api/doctor/profile");  // Doctor viewing own profile
};

// -------- Approve doctor (Admin) --------
export const approveDoctorProfile = (doctorId) => {
  return api.post(`/api/admin/doctor/approve/${doctorId}`);
};

// -------- Reject doctor (Admin) --------
export const rejectDoctorProfile = (doctorId) => {
  return api.delete(`/api/admin/doctor/reject/${doctorId}`);
};