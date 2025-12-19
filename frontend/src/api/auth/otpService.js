import { api } from "../axiosInstance";

//----------- RESEND OTP -------------------
export const resendOtp = async ({email,type}) => {
    try {
        const res = await api.post('/api/auth/resend-otp', {email,type});
        return res.data;
    } catch (error) {
        throw(
            error?.response?.data ||
            error?.message ||
            'Failed to resend OTP'
        )
        
    }
}

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async ({ otp, email, type }) => {
  try {
    const res = await api.post("/api/auth/verify-email", {
      otp,
      email,
      type,
    });
    return res.data;
  } catch (error) {
    throw (
      error?.response?.data ||
      error?.message ||
      "OTP verification failed"
    );
  }
};