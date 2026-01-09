import { createContext, useContext, useReducer, useEffect } from "react";
import { fetchCurrentUser } from "../api/auth/userService";

// -------- INITIAL STATE --------
const initialState = {
  email: "",
  id: "",
  role: "",
  token: "",
  firstLogin: true,
  name: "",
  profilePicture: "",
  isLoading: true,
  isAuthenticated:null
};

// -------- REDUCER --------
const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, ...action.payload, isAuthenticated:true, isLoading: false };

    case "CLEAR_USER":
      return { ...initialState, isAuthenticated:null, isLoading: false };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "UPDATE_PROFILE_PICTURE":
      return { ...state, profilePicture: action.payload };

    default:
      return state;
  }
};


// -------- CONTEXT --------
const UserContext = createContext({
  ...initialState,
  refreshUser: async () => null,
  dispatch: () => null,
});

export const UserProvider = ({ children }) => {

  const [state, dispatch] = useReducer(userReducer, initialState);
  
  // -------- REFRESH USER (manual trigger) --------
  const refreshUser = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const data = await fetchCurrentUser();

      if (data?.success) {
        dispatch({ type: "SET_USER", payload: data.user });
        return data.user;
      }

      dispatch({ type: "CLEAR_USER" });
      return null;
    } catch (error){
      
        if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
        return;
      }
      dispatch({ type: "CLEAR_USER" });
    }
    
  };

  // -------- INITIAL LOAD --------
  useEffect(() => {
    const controller = new AbortController();

    const initUser = async () => {
      try {
        const data = await fetchCurrentUser(controller.signal);

        if (data?.success) {
          dispatch({ type: "SET_USER", payload: data.user });
        } else {
          dispatch({ type:'CLEAR_USER' });
        }
      } catch (error){
        if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
        return;
        }
         dispatch({ type:'CLEAR_USER' });
      }
     
    };
    

    initUser();

    return () => controller.abort();
  }, []);

  
  return (
    <UserContext.Provider value={{ ...state, dispatch, refreshUser,}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
