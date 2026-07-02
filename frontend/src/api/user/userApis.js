import { api } from "../axiosInstance";


// ---------------- GET ALL APPROVED DOCTORS ----------------
export const getApprovedDoctors = () => {
  return api.get('/api/doctors/approved')
}

export const fetchHomepageStats = () =>{
  return api.get('/api/home/stats')
}

export const fetchHomepageReviews = () => {
  return api.get('/api/home/reviews')
}

// ---------------- GENERIC SEARCH API ----------------
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


// ---------------- SEARCH SUGGESTIONS API ----------------
export const fetchSearchSuggestions = ({ role, query, type, limit = 6 }) => {
  return api.get(`/api/${role}/search/suggestions`, {
    params: {
      query,
      type,
      limit,
    },
  });
};

// ---------------- FETCH NOTIFICATIONS ----------------
export const getNotifications = (role) => {
  return api.get(`/api/${role}/notifications`)
}

// ---------------- MARK ALL READ (NOTIFICATIONS) ----------------
export const markNotificationsRead = (role) => {
  return api.patch(`/api/${role}/notifications/mark-all-read`);
}

// ---------------- MESSAGES ----------------

export const getAllMessages = (role,id) => {
  return api.get(`/api/${role}/messages/${id}`)
}

export const getConversations = (role) => {
  return api.get(`/api/${role}/conversations`)
}

// ---------------- APPOINTMENTS ACTION ----------------
export const setAppointmentStatus = (id,role,payload) =>{
  return api.patch(`/api/${role}/appointments/${id}`,payload)
}

// ---------------- RAZORPAY PAYMENTS ----------------
export const createRazorpayOrder = (payload) => {
  return api.post(`/api/${payload.role}/create-order`,payload)
}

export const verifyRazorpayPayment = (data, role) => {
  return api.post(`/api/${role}/verify-payment`,data)
}

// ---------------- UPDATE PAYMENT STATUS AND WALLET ----------------
export const updatePaymentStatus = () =>{
  return api.post('/api/payments/update-status')
}

// ---------------- VIEW PAYMENT INVOICE ----------------
export const getReceipt = async (id,role) =>{
  return api.get(`/api/${role}/payments/${id}`,{
    responseType:'blob'
  })
}

// ---------------- VIEW CONSULTATION PDF ----------------
export const getConsultationPDF = async (id, role) => {
  return api.get(`/api/${role}/appointments/consultation/${id}/pdf`, {
    responseType: 'blob'
  })
}

// ---------------- JOIN CONSULTATION ----------------
export const joinConsultation = async (consultationId,role) =>{
  return api.post(`/api/${role}/appointments/consultation/${consultationId}`)
}

