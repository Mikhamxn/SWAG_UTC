import { useContext } from "react";
import { AuthContext } from "../contexto/auth-context";

export const useAuth = () => useContext(AuthContext);
