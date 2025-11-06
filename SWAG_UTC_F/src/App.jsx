import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthProvider } from "./contexto/AuthContext";
import { ThemeProvider } from "./contexto/ThemeContext";
import Login from "./contenido/Auth/Login";
import Registro from "./contenido/Auth/Registro";
import { Toaster } from "./componentes/ui/toaster";
import Dashboard from "./contenido/paginas/Dashboard";
import ProtectedRoute from "./componentes/ProtectedRoute";
import Layout from "./componentes/Layout";
import DashboardLayout from "./componentes/DashboardLayout";
import NotFound from "./contenido/paginas/NotFound";
import Materias from "./contenido/paginas/Materias";
import RegistroAlumnos from "./contenido/paginas/RegistroAlumnos";
import Horarios from "./contenido/paginas/Horarios";
import "./App.css";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Helmet>
            <title>SWAG - Sistema Web de Asistencia y Gestionamiento</title>
            <meta
              name="description"
              content="Sistema integral para la gestión de asistencia y administración académica con control de estudiantes, materias, horarios y reportes en tiempo real."
            />
            <meta
              name="keywords"
              content="asistencia, gestión académica, estudiantes, materias, horarios, administración, educación, control"
            />
            <meta name="author" content="SWAG UTC" />
            <meta
              property="og:title"
              content="SWAG - Sistema Web de Asistencia y Gestionamiento"
            />
            <meta
              property="og:description"
              content="Sistema integral para la gestión de asistencia y administración académica"
            />
            <meta property="og:type" content="website" />
          </Helmet>

          <div className="app-background">
            <Routes>
              {/* RUTAS PROTEGIDAS DENTRO DEL LAYOUT */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route path="dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                </Route>

                <Route path="materias" element={<Materias />} />
                <Route path="horarios" element={<Horarios />} />
                <Route path="registro-alumnos" element={<RegistroAlumnos />} />
              </Route>

              {/* RUTAS PÚBLICAS */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
