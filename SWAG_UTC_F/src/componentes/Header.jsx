import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

const Encabezado = motion.header;
const BotonAnimado = motion.button;

const Header = ({ alHacerClickMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const esModoOscuro = theme === "dark";

  return (
    <Encabezado
      className="border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-oscuro-200/60 dark:bg-oscuro-100/80"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <BotonAnimado
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-primario-200 hover:text-primario-600 dark:border-oscuro-200 dark:bg-oscuro-100 dark:text-neutro-200 dark:hover:border-esmeralda-500/40 dark:hover:text-esmeralda-500 lg:hidden"
            onClick={alHacerClickMenu}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            Menú
          </BotonAnimado>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-neutro-400">
              Gestión Académica
            </p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-neutro-50 sm:text-2xl">
              SWAG · Sistema Web de Asistencia y Gestionamiento
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={esModoOscuro}
          aria-label={esModoOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm transition hover:border-primario-200 hover:text-primario-600 dark:border-oscuro-200 dark:bg-oscuro-100 dark:text-neutro-300 dark:hover:border-esmeralda-500/40 dark:hover:text-esmeralda-500"
        >
          <span>{esModoOscuro ? "Modo oscuro" : "Modo claro"}</span>
        </button>
      </div>
    </Encabezado>
  );
};

export default Header;
