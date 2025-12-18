import { createContext, useContext, useReducer } from "react";
import { useEffect } from "react";
import { api } from "../api/axiosInstance";

//-----------INITIAL STATE----------------
const initialState = {
  email: "",
  id: "",
  role: "",
  token: "",
  firstLogin:true,
  name:'',
  profilePicture:'',
  isLoading: true
};

//-----------REDUCER FUNCTION----------------
const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, ...action.payload,isLoading: false};
    case "CLEAR_USER":
      return {...initialState,isLoading: false};

    case 'SET_LOADING':
      return { ...state,isLoading:action.payload}
    case 'UPDATE_PROFILE_PICTURE':
      return { ...state, profilePicture: action.payload };
    default:
      return state;
  }
};

//-----------CONTEXT & PROVIDER----------------
const UserContext = createContext({
  ...initialState,
  dispatch: () => null,
});


export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // ----------- REFRESH USER FUNCTION ----------------
  const refreshUser = async () => {
    try {
      const res = await api.get("/api/auth/me", { withCredentials: true });
      if (res.data?.success) {
        dispatch({ type: "SET_USER", payload: res.data.user });
        return res.data.user;
      }
      dispatch({ type: "CLEAR_USER" });
      return null;
    } catch (err) {
      dispatch({ type: "CLEAR_USER" });
      return null;
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me", { signal: controller.signal });

        if (res.data?.success) {
          dispatch({ type: "SET_USER", payload: res.data.user });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (err) {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchUser();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <UserContext.Provider value={{ ...state, dispatch, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
