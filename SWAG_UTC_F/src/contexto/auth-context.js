import { createContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});
