import { api } from "../axiosInstance";


//---------------- Get All approved Doctors ----------------
export const getApprovedDoctors = () => {
  return api.get('/api/doctors/approved')
}

// -------------- Generic Search Api ---------------------
export const searchApi = ({ role,query, type, page = 1, limit = 10 ,filters ={}}) => {
  return api.get(`/api/${role}/search`, {
    params: {
      query,
      type,
      page,
      limit,
      ...filters
    },
  });
};


// -------------- Search Suggestions Api ---------------------
export const fetchSearchSuggestions = ({ role, query, type, limit = 6 }) => {
  return api.get(`/api/${role}/search/suggestions`, {
    params: {
      query,
      type,
      limit,
    },
  });
};

//---------------- fetch notifications ------------
export const getNotifications = (role) => {
  return api.get(`/api/${role}/notifications`)
}

// ----------------- Mark all read (notifications) ---------------
export const markNotificationsRead = (role) => {
  return api.patch(`/api/${role}/notifications/mark-all-read`);
}

//----------------- Messages -----------------------

export const getAllMessages = (role,id) => {
  return api.get(`/api/${role}/messages/${id}`)
}

export const getConversations = (role) => {
  return api.get(`/api/${role}/conversations`)
}

//----------------- Appointments Action ----------------
export const setAppointmentStatus = (id,role,payload) =>{
  return api.patch(`/api/${role}/appointments/${id}`,payload)
}

//----------------- Razorpay Payments -----------------
export const createRazorpayOrder = (payload) => {
  return api.post(`/api/${payload.role}/create-order`,payload)
}

export const verifyRazorpayPayment = (data, role) => {
  return api.post(`/api/${role}/verify-payment`,data)
}

//------------ Update payment status and Wallet ---------
export const updatePaymentStatus = () =>{
  return api.post('/api/payments/update-status')
}

//--------------- View payment invoice --------------
export const getReceipt = async (id,role) =>{
  return api.get(`/api/${role}/payments/${id}`,{
    responseType:'blob'
  })
}

//--------------- View consultation PDF --------------
export const getConsultationPDF = async (id, role) => {
  return api.get(`/api/${role}/appointments/consultation/${id}/pdf`, {
    responseType: 'blob'
  })
}

//--------------- Join Consultation ---------------
export const joinConsultation = async (consultationId,role) =>{
  return api.post(`/api/${role}/appointments/consultation/${consultationId}`)
}