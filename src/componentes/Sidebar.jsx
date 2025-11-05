import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard", label: "Panel" },
  { to: "/materias", label: "Materias" },
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

const Sidebar = ({ onClose }) => {
  return (
    <div className="sidebar">
      <div className="sidebar__brand">
        <span>SWAG</span>
        <button type="button" className="sidebar__close" onClick={onClose}>
          Cerrar
        </button>
      </div>

      <MotionNav
        initial="hidden"
        animate="visible"
        className="sidebar__nav"
        aria-label="Secciones principales"
      >
        <MotionList style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {navItems.map((item, index) => (
            <MotionItem
              key={item.to}
              custom={index}
              variants={navVariants}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.97 }}
            >
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                }
                onClick={onClose}
              >
                {item.label}
              </NavLink>
            </MotionItem>
          ))}
        </MotionList>
      </MotionNav>
    </div>
  );
};

export default Sidebar;
