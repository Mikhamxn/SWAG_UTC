import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionSection = motion.section;
const MotionDiv = motion.div;

const Login = () => {
  const navigate = useNavigate();

  return (
    <MotionSection
      className="auth-screen flex items-center justify-center min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <MotionDiv
        className="auth-card bg-white p-8 rounded-2xl shadow-lg text-center w-80"
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
      >
        <h2 className="text-2xl font-bold mb-4">Selecciona tu rol</h2>
        <p className="muted-text mb-6 text-gray-500">
          Elige cómo deseas iniciar sesión.
        </p>

        <button
          onClick={() => navigate("/loginA")}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-4"
        >
          Soy Alumno
        </button>

        <button
          onClick={() => navigate("/loginM")}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Soy Maestro
        </button>
      </MotionDiv>
    </MotionSection>
  );
};

export default Login;
