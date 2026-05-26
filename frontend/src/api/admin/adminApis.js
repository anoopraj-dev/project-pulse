import { api } from "../axiosInstance";

// ---------------- DASHBOARD STATS ----------------
export const fetchDashboardStats = async () => {
  const response = await api.get("/api/admin/dashboard");
  return response.data;
};

export const fetchRevenueOverview = async (range) => {
  const response = await api.get(`/api/admin/dashboard/revenue?range=${range}`);
  return response.data
}

export const fetchDashboardCounts = async() =>{
  const response = await api.get('/api/admin/dashboard/stats');
  return response.data
}

export const fetchUserGrowth = async () => {
  const response = await api.get('/api/admin/dashboard/user-growth');
  return response.data
}


// ---------------- GET DOCTOR FOR REVIEW ----------------
export const fetchDoctorById = async (id) => {
  const response = await api.get(`/api/admin/doctor/${id}`);
  return response.data;
};


// ---------------- BLOCK DOCTOR ----------------
export const blockDoctor = (id,formData) =>{
   return api.patch(`/api/admin/doctor/block/${id}`,formData);
}
// ---------------- UNBLOCK DOCTOR ----------------
export const unblockDoctor =async(id) =>{
  const response = await api.patch(`/api/admin/doctor/unblock/${id}`)
  return response.data;
}

// ---------------- REVOKE PROFILE STATUS ----------------
export const revokeProfileStatus = (id,formData) => {
  return api.patch(`/api/admin/doctor/status/${id}`, formData)
}

// ---------------- GET ALL DOCTORS ----------------
export const getAllDoctors = async () =>{
  const response = await api.get('/api/admin/doctors');
  return response.data;
}


// ---------------- FETCH ALL PATIENTS ----------------
export const getAllPatients = () =>{
  return api.get('/api/admin/patients')
}

// ---------------- GET PATIENT FOR REVIEW ----------------
export const fetchPatientById = (id) => {
  return api.get(`/api/admin/patient/${id}`)
}

// ---------------- BLOCK PATIENT ----------------
export const blockPatientProfile = (id,formData) => {
  return api.patch(`/api/admin/patient/block/${id}`,formData)
}

// ---------------- UNBLOCK PATIENT ----------------
export const unblockPatientProfile = (id) => {
  return api.patch(`/api/admin/patient/unblock/${id}`)
}

// ---------------- APPOINTMENTS ----------------
export const fetchAppointments = () =>{
  return api.get('/api/admin/appointments')
}


// ---------------- SUPPORT CENTER AND SETTINGS ----------------
export const fetchSupportTickets = () =>{
  return api.get('/api/admin/support/tickets')
}

export const fetchSystemAlerts = (page,limit) =>{
  return api.get('/api/admin/support/alerts',{
    params:{page,limit}
  })
}

export const updateTicketStatus = (id,status) => {
  return api.patch(`/api/admin/support/update-ticket/${id}`,{ status})
}

export const updateAlertStatus = (id,status) =>{
  return api.patch(`/api/admin/support/update-alert/${id}`,{status})
}

export const changePassword = (data) =>{
  return api.patch(`/api/admin/support/change-password`,data)
}

// ---------------- REVENUE ----------------
export const fetchRevenueSummary = (range) =>{
  return api.get(`/api/admin/revenue/summary?range=${range}`);
}

export const requestRevenueExport = () =>{
  return api.post('/api/admin/revenue/report')
}

export const getRevenueExportStatus = (id) =>{
  return api.get(`/api/admin/revenue/export-status/${id}`)
}


export const fetchDashboardAlerts = () =>{
  return api.get(`/api/admin/dashboard/alerts`)
}

