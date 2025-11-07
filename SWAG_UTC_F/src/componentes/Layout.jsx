import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";

const BarraAnimada = motion.aside;
const CapaAnimada = motion.div;
const ContenidoAnimado = motion.div;

const Layout = () => {
  const ubicacion = useLocation();
  const [barraAbierta, establecerBarraAbierta] = useState(false);

  const alternarBarra = () => establecerBarraAbierta((previo) => !previo);
  const cerrarBarra = () => establecerBarraAbierta(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:bg-oscuro-100 dark:bg-none">
      <BarraAnimada
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`fixed inset-y-0 left-0 z-40 w-72 transform shadow-2xl shadow-slate-900/10 transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] dark:shadow-black/40 lg:translate-x-0 ${
          barraAbierta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar cerrarBarra={cerrarBarra} />
      </BarraAnimada>

      <AnimatePresence>
        {barraAbierta && (
          <CapaAnimada
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={cerrarBarra}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen lg:pl-72">
        <Header alHacerClickMenu={alternarBarra} />
        <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
          <ContenidoAnimado
            key={ubicacion.pathname}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </ContenidoAnimado>
        </main>
      </div>
    </div>
  );
};

export default Layout;