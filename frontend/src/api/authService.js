import { api } from "./axiosInstance";

//----------- AUTH SERVICE FUNCTIONS ----------------

//------ signup ------
export const signup = async (signupData) => {
    const response =  await api.post('/api/auth/signup', signupData);
    return response.data;
};

//------ signin (patient/doctor) ------
export const signin = async (email,password,role) => {
    const response = await api.post('/api/auth/signin', { email, password, role });
    return response.data;
};

//------- admin login -------
export const adminLogin = async (email,password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
};

//-------- update clerk user --------
export const updateClerkUser = async (userData,token,signal) => {
    const response = await api.post('/api/auth/update-clerkUser', userData,{
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal
    });
    return response.data;
};  