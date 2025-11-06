import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard", label: "Panel" },
  { to: "/materias", label: "Materias" },
  { to: "/horarios", label: "Horarios" },
  { to: "/registro-alumnos", label: "Registro de Alumnos" },
];


const MotionNav = motion.nav;
const MotionList = motion.ul;
const MotionItem = motion.li;

const navVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * index, duration: 0.35, ease: "easeOut" },
  }),
};

const Sidebar = ({ cerrarBarra }) => {
  return (
    <div className="flex h-full flex-col gap-12 bg-white/95 px-6 py-8 ring-1 ring-slate-900/5 backdrop-blur-xl dark:bg-oscuro-100/90 dark:ring-oscuro-200">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primario-500 text-lg font-semibold text-white shadow-lg shadow-primario-500/25 dark:bg-esmeralda-500 dark:text-oscuro-50">
            S
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-neutro-400">
              SWAG
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
              Sistema Académico
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-neutro-400 dark:hover:bg-oscuro-200/60 dark:hover:text-esmeralda-500 lg:hidden"
          onClick={cerrarBarra}
        >
          Cerrar
        </button>
      </div>

      <MotionNav
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col"
        aria-label="Secciones principales"
      >
        <MotionList className="space-y-2">
          {navItems.map((item, index) => (
            <MotionItem
              key={item.to}
              custom={index}
              variants={navVariants}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.98 }}
            >
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "border-transparent bg-primario-500 text-white shadow-lg shadow-primario-500/25 dark:bg-esmeralda-500 dark:text-oscuro-50 dark:shadow-esmeralda-500/25"
                      : "border-transparent text-slate-500 hover:border-primario-200 hover:bg-primario-50 hover:text-primario-600 dark:text-neutro-300 dark:hover:border-esmeralda-500/40 dark:hover:bg-oscuro-200/50 dark:hover:text-esmeralda-500"
                  }`
                }
                onClick={cerrarBarra}
              >
                <span>{item.label}</span>
              </NavLink>
            </MotionItem>
          ))}
        </MotionList>
      </MotionNav>
    </div>
  );
};

export default Sidebar;
