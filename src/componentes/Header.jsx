import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

const MotionHeader = motion.header;
const MotionButton = motion.button;

const Header = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <MotionHeader
      className="app-header"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="app-header__left">
        <MotionButton
          type="button"
          className="app-header__menu"
          onClick={onMenuClick}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
        >
          Menú
        </MotionButton>
        <div>
          <h1 className="app-header__title">
            SWAG · Sistema Web de Asistencia y Gestionamiento
          </h1>
          <p className="app-header__subtitle">Gestión académica centralizada</p>
        </div>
      </div>
      <div className="app-header__actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-pressed={!isDark}
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          <span className="theme-toggle__text">
            {isDark ? "Modo oscuro" : "Modo claro"}
          </span>
        </button>
      </div>
    </MotionHeader>
  );
};

export default Header;
