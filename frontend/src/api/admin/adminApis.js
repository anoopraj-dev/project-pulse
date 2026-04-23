import { api } from "../axiosInstance";

//-------- Dashboard stats -----------
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


// --------Get doctor for review ------------
export const fetchDoctorById = async (id) => {
  const response = await api.get(`/api/admin/doctor/${id}`);
  return response.data;
};


// ------------ Block Doctor --------------
export const blockDoctor = (id,formData) =>{
   return api.patch(`/api/admin/doctor/block/${id}`,formData);
}
//------------- Unblock Doctor ------------
export const unblockDoctor =async(id) =>{
  const response = await api.patch(`/api/admin/doctor/unblock/${id}`)
  return response.data;
}

// -------------- Revoke Profile Status -----------
export const revokeProfileStatus = (id,formData) => {
  return api.patch(`/api/admin/doctor/status/${id}`, formData)
}

//---------- Get all doctors ------------
export const getAllDoctors = async () =>{
  const response = await api.get('/api/admin/doctors');
  return response.data;
}


//------------- Fetch All Patients -----------------
export const getAllPatients = () =>{
  return api.get('/api/admin/patients')
}

//----------------- Get Patient for review --------
export const fetchPatientById = (id) => {
  return api.get(`/api/admin/patient/${id}`)
}

//----------------- Block Patient -----------------
export const blockPatientProfile = (id,formData) => {
  return api.patch(`/api/admin/patient/block/${id}`,formData)
}

//----------------- Unblock Patient -----------------
export const unblockPatientProfile = (id) => {
  return api.patch(`/api/admin/patient/unblock/${id}`)
}

//--------------- Appointments ----------------------
export const fetchAppointments = () =>{
  return api.get('/api/admin/appointments')
}


//--------- Support center and settings ---------
export const fetchSupportTickets = () =>{
  return api.get('/api/admin/support/tickets')
}

export const fetchSystemAlerts = () =>{
  return api.get('/api/admin/support/alerts')
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

//-------------- Revenue -----------
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

