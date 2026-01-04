import { api } from "../axiosInstance";

// Dashboard stats
export const fetchDashboardStats = async () => {
  const response = await api.get("/api/admin/dashboard");
  return response.data;
};

// Get single doctor for review
export const fetchDoctorById = async (id) => {
  const response = await api.get(`/api/admin/doctor/${id}`);
  return response.data;
};

// Get all doctors
export const getAllDoctors = async () =>{
  const response = await api.get('/api/admin/doctors');
  return response.data;
}
