import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const MotionSection = motion.section;
const MotionHeader = motion.header;

const DashboardLayout = () => {
  return (
    <MotionSection
      className="dashboard-shell"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <MotionHeader
        className="dashboard-shell__intro"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h2 className="panel-card__title">Bienvenido al panel</h2>
        <p className="panel-card__subtitle">
          Selecciona una opción en el menú lateral para comenzar.
        </p>
      </MotionHeader>
      <div className="dashboard-shell__content">
        <Outlet />
      </div>
    </MotionSection>
  );
};

export default DashboardLayout;
