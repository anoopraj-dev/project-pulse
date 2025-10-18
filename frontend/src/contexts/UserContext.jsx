import { createContext, useContext, useReducer } from "react";
import { useEffect } from "react";
import { api } from "../api/api.js";

//initial state
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


//reducer function
const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, ...action.payload,isLoading: false};
    case "CLEAR_USER":
      return {...initialState,isLoading: false};

    case 'SET_LOADING':
      return { ...state,isLoading:action.payload}
    default:
      return state;
  }
};

//creating context
const UserContext = createContext({
  ...initialState,
  dispatch: () => null,
});
//provider
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        console.log(res.data)
        if (res.data.success) {
          dispatch({ type: "SET_USER", payload: res.data.user });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (err) {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
