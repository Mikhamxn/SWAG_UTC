import React from "react";
import { motion } from "framer-motion";

const MotionSection = motion.section;
const MotionDiv = motion.div;

const Login = () => {
  return (
    <MotionSection
      className="auth-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <MotionDiv
        className="auth-card"
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
      >
        <h2>Iniciar sesión</h2>
        <p className="muted-text">Esta pantalla está pendiente de implementación.</p>
      </MotionDiv>
    </MotionSection>
  );
};

export default Login;
