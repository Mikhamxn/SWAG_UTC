import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionSection = motion.section;
const MotionParagraph = motion.p;
const MotionHeading = motion.h1;

const NotFound = () => {
  return (
    <MotionSection
      className="not-found"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <MotionHeading
        className="not-found__title"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        404
      </MotionHeading>
      <MotionParagraph
        className="muted-text"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
      >
        No pudimos encontrar la página solicitada.
      </MotionParagraph>
      <Link to="/" className="button-primary not-found__button">
        Regresar al inicio
      </Link>
    </MotionSection>
  );
};

export default NotFound;
