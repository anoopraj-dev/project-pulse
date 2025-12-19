import { api } from "../axiosInstance";

// -------- FETCH CURRENT USER --------
export const fetchCurrentUser = async (signal) => {
  try {
    const res = await api.get("/api/auth/me", {
      withCredentials: true,
      signal,
    });
    return res.data;
  } catch (error) {
    throw (
      error?.response?.data ||
      error?.message ||
      "Failed to fetch user"
    );
  }
};
