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


//--------------- Fetch Doctor for appointment --------------
export const  getBookingInfo = (id) =>{
  return api.get(`/api/patient/doctor/${id}/booking-info`)
}

//-------------------- Book appointment -------------------
export const bookAppointment = (payload) => {
  return api.post('/api/patient/appointments/book-appointment',payload)
}

//--------------------- Fetch All appointments --------------
export const fetchAppointments = () => {
  return api.get('/api/patient/appointments')
}

export const viewAppointmentDetails = (id) => {
  return api.get(`/api/patient/appointments/${id}`)
}

export const cancelAppointment = (id) => {
  return api.patch(`/api/patient/appointments/${id}`)
}

//--------------- Fetch Payments ---------------------
export const fetchPatientPayments = () =>{
  return api.get('/api/patient/payments')
}

export const updatePaymentStatus = (data) =>{
  return api.patch(`/api/patient/payment-status`,data)
}

export const retryPayment = (id) => {
  return api.post(`/api/patient/payments/retry/${id}`)
}

//------------------- Wallet -------------
export const getPatientWallet = () =>{
  return api.get('/api/patient/wallet')
}

export const refundToWallet = (appointmentId,amount) =>{
  return api.post(`/api/patient/refund/${appointmentId}`,amount)
}

export const createWalletOrder = (payload) =>{
  return api.post('/api/patient/create-wallet-order',payload)
}


