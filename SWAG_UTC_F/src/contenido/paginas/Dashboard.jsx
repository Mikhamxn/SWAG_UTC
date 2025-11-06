import React from "react";
import { motion } from "framer-motion";

const MotionSection = motion.section;

const Dashboard = () => {
  return (
    <MotionSection
      className="panel-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 className="panel-card__title">Panel principal</h2>
      <p className="panel-card__subtitle">
        Usa el menú lateral para acceder a las funciones del Sistema Web de Asistencia y Gestionamiento.
      </p>
    </MotionSection>
  );
};

export default Dashboard;
