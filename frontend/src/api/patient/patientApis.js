import { api } from "../axiosInstance";

// ---------------- ONBOARDING APIS ----------------

// ---------------- PERSONAL INFO ----------------
export const submitPatientPersonalInfo = (payload) => {
  return api.post("/api/patient/personal-info", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ---------------- MEDICAL INFO ----------------
export const submitPatientMedicalInfo = (payload) => {
  return api.post("/api/patient/medical-info", payload);
};

// ---------------- LIFESTYLE INFO ----------------
export const submitPatientLifestyleInfo = (payload) => {
  return api.post("/api/patient/lifestyle-info", payload);
};

// ---------------- PROFILE PAGE APIS ----------------

// ---------------- FETCH PATIENT PROFILE ----------------
export const fetchPatientProfile = () => {
  return api.get("/api/patient/profile");
};

// ---------------- UPDATE PATIENT PROFILE ----------------
export const updatePatientProfile = (payload) => {
  return api.put("/api/patient/update-profile", payload);
};

// ---------------- DOCTORS DISPLAY ----------------
export const getAllDoctors = () => {
  return api.get("/api/patient/doctors");
};

// ---------------- VIEW DOCTOR ----------------
export const viewDoctorProfile = (id) => {
  return api.get(`/api/patient/doctor/${id}`);
};

export const viewDoctorAvailability = (id) => {
  return api.get(`/api/patient/doctor/:{id}`);
};

// ---------------- GET CHATS ----------------
export const getConversations = () => {
  return api.get("/api/patient/messages");
};

// ---------------- FETCH DOCTOR FOR APPOINTMENT ----------------
export const getBookingInfo = (id) => {
  return api.get(`/api/patient/doctor/${id}/booking-info`);
};

// ---------------- BOOK APPOINTMENT ----------------
export const bookAppointment = (payload) => {
  return api.post("/api/patient/appointments/book-appointment", payload);
};

// ---------------- FETCH ALL APPOINTMENTS ----------------
export const fetchAppointments = (page,limit,status) => {
  return api.get("/api/patient/appointments",{
    params:{page,limit,status}
  });
};

export const viewAppointmentDetails = (id) => {
  return api.get(`/api/patient/appointments/${id}`);
};

export const cancelAppointment = (id) => {
  return api.patch(`/api/patient/appointments/${id}`);
};

// ---------------- FETCH PAYMENTS ----------------
export const fetchPatientPayments = (page,limit,status) => {
  return api.get("/api/patient/payments",{
    params:{page,limit,status}
  });
};

export const updatePaymentStatus = (data) => {
  return api.patch(`/api/patient/payment-status`, data);
};

export const retryPayment = (id) => {
  return api.post(`/api/patient/payments/retry/${id}`);
};

// ---------------- PATIENT RECORDS ----------------
export const fetchPatientRecords = () => {
  return api.get('/api/patient/medical-records');
};

export const uploadPatientRecord = (formData) => {
  return api.post('/api/patient/medical-records', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deletePatientRecord = (id) => {
  return api.delete(`/api/patient/medical-records/${id}`);
};

// ---------------- WALLET ----------------
export const getPatientWallet = () => {
  return api.get("/api/patient/wallet");
};

export const walletPayment = (bookingInfo) => {
  return api.post("/api/patient/wallet-pay", bookingInfo);
};

export const refundToWallet = (appointmentId, amount) => {
  return api.post(`/api/patient/refund/${appointmentId}`, amount);
};

export const createWalletOrder = (payload) => {
  return api.post("/api/patient/create-wallet-order", payload);
};

export const verifyWalletPayment = (payload) => {
  return api.post("/api/patient/verify-wallet-payment", payload);
};

// ---------------- CONSULTATION ----------------
export const endConsultation = (id) => {
  return api.patch(`/api/patient/appointments/consultation/${id}/end`)
};

export const submitReview = (id,data) =>{
  return api.post(`/api/patient/review/${id}`,data)
}


// ---------------- DASHBOARD ----------------
export const fetchDashboardStats = () =>{
  return api.get('/api/patient/dashboard/stats')
}

export const fetchUpcomingAppointments = () =>{
  return api.get('/api/patient/dashboard/upcoming-appointments')
}

export const fetchDashboardChart = (range = "week") => {
  return api.get("/api/patient/dashboard/chart", {
    params: { range },
  });
};

export const fetchPatientPrescriptions = () =>{
  return api.get('/api/patient/dashboard/prescriptions')
}

export const fetchPatientVitals = () =>{
  return api.get('/api/patient/dashboard/vitals')
}

// ---------------- SUPPORT AND SETTINGS ----------------

export const createSupportTicket = (data) =>{
  return api.post('/api/patient/support/ticket',data)
}

export const fetchSupportTickets = () =>{
  return api.get('/api/patient/support/tickets')
}

export const changePassword = (data) =>{
  return api.patch('/api/patient/support/change-password',data)
}

export const requestExportAccountInfo = () =>{
  return api.post('/api/patient/support/accountInfo')
}

export const getExportStatus = (id) =>{
  return api.get(`/api/patient/support/export-status/${id}`)
}