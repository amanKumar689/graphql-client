import { USERWHITESPACABLE_TYPES } from "@babel/types";
import { createContext, useReducer } from "react";
import jwt from "jsonwebtoken";
// ? Let's create context

// TODO - IntialStore
const initialState = {
  // Initialize context
  // initialize context
  user: null,
  login: () => {},
  logout: () => {},
  signup: () => {},
};
const token = localStorage.getItem("token");
if (token) {
  const user = jwt.decode(token);
  initialState.user = user;
}
const AuthContext = createContext(initialState);

// TODO Reducer

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "SIGNUP":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, {
    user: initialState.user,
  }); // --> intialize state

  function login(userData) {
    return dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }
  function logout() {
    localStorage.removeItem("token");
    return dispatch({
      type: "LOGOUT",
    });
  }
  function signup(userData) {
    return dispatch({
      type: "SIGNUP",
      payload: userData,
    });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, logout, login, signup }}
      {...props}
    />
  );
}
export { AuthProvider, AuthContext  };
