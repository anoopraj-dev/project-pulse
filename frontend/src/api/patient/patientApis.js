import { api } from "../axiosInstance";

//------------ ONBOARDING APIS ----------

// -------- Personal Info----------
export const submitPatientPersonalInfo = (formData) => {
  return api.post("/api/patient/personal-info", formData);
};

// -------- Medical Info ----------
export const submitPatientMedicalInfo = (payload) => {
  return api.post("/api/patient/medical-info", payload);
};

// -------- LifeStyle Info ----------
export const submitPatientLifestyleInfo = (payload) => {
  return api.post("/api/patient/lifestyle-info", payload);
};


//--------- PROFILE PAGE APIS -----------

// -------- Fetch Patient Profile ----------
export const fetchPatientProfile = () => {
  return api.get("/api/patient/profile");
};
