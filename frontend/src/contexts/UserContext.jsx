import { createContext, useContext, useReducer } from "react";

const initialState = {
  email: "",
  id: "",
  role: "",
  token: "",
  firstLogin:true
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, ...action.payload };
    case "CLEAR_USER":
      return {};
    default:
      return state;
  }
};

const UserContext = createContext({
  ...initialState,
  dispatch: () => null,
});

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
