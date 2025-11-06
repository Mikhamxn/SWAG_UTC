import { useContext } from "react";
import { ThemeContext } from "../contexto/theme-context";

export const useTheme = () => useContext(ThemeContext);
