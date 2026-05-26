import { api } from "../axiosInstance";

// ---------------- AUTH SERVICE FUNCTIONS ----------------

// ---------------- SIGNUP ----------------
export const signup = async (signupData) => {
    const response =  await api.post('/api/auth/signup', signupData);
    return response.data;
};

// ---------------- SIGNIN (PATIENT/DOCTOR) ----------------
export const signin = async (email,password,role) => {
    const response = await api.post('/api/auth/signin', { email, password, role });
    return response.data;
};

// //------- admin login -------
// export const adminLogin = async (email,password) => {
//     const response = await api.post('/api/auth/login', { email, password });
//     return response.data;
// };

// ---------------- UPDATE CLERK USER ----------------
export const updateClerkUser = async (userData,token,signal) => {
    const response = await api.post('/api/auth/update-clerkUser', userData,{
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal
    });
    return response.data;
};  

// ---------------- LOGOUT USER ----------------
export const logoutUser = async () => {
  try {
    const res = await api.post("/api/auth/logout", {});
    return res.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};