import { api } from "../axiosInstance";

//------------ ONBOARDING APIS ----------

// -------- Personal Info----------
export const submitPatientPersonalInfo = (payload) => {
  return api.post("/api/patient/personal-info", payload,{
    headers:{'Content-Type': 'multipart/form-data'}
  });
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


//------------- Update Patient Profile ------------
export const updatePatientProfile = (payload) => {
  return api.put('/api/patient/update-profile', payload);
}


//------------- DOCTORS DISPLAY -------------
export const getAllDoctors = ()=>{
  return api.get('/api/patient/doctors')
  
}
//---------------- View Doctor ------------------
export const viewDoctorProfile = (id) => {
  return api.get(`/api/patient/doctor/${id}`)
}

export const viewDoctorAvailability = (id) =>{
  return api.get(`/api/patient/doctor/:{id}`)
}


//-------------- Get Chats ------------------
export const getConversations = () => {
  return api.get('/api/patient/messages')
}


//-------------- View Doctors availability ----------------

