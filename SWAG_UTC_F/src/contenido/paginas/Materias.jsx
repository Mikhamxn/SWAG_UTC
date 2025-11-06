import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  crearMateria,
  getMaterias,
} from "../../services/materiasService";
import { motion } from "framer-motion";

const MotionContainer = motion.section;
const MotionHeader = motion.header;
const MotionWrapper = motion.div;
const MotionListSection = motion.section;
const MotionCard = motion.article;

const validationSchema = Yup.object({
  strClave: Yup.string()
    .trim()
    .max(16, "La clave no debe superar 16 caracteres")
    .required("La clave es obligatoria"),
  strNombre: Yup.string()
    .trim()
    .max(120, "El nombre no debe superar 120 caracteres")
    .required("El nombre es obligatorio"),
  intTotalSesiones: Yup.number()
    .typeError("Ingresa un total de sesiones válido")
    .integer("Solo números enteros")
    .min(1, "Debe ser al menos 1 sesión")
    .max(200, "No debe exceder 200 sesiones")
    .required("El total de sesiones es obligatorio"),
});

const Materias = () => {
  const queryClient = useQueryClient();

  const {
    data: materias = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["materias"],
    queryFn: getMaterias,
    staleTime: 1000 * 60,
  });

  const crearMateriaMutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        ...values,
        intTotalSesiones: Number(values.intTotalSesiones),
      };
      return crearMateria(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materias"] });
    },
  });

  return (
    <MotionContainer
      className="materias"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <MotionHeader
        className="materias__header"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h2 className="materias__title">Gestión de materias</h2>
        <p className="materias__subtitle">
          Registra materias y consulta el catálogo disponible dentro del sistema.
        </p>
      </MotionHeader>

      <Formik
        initialValues={{
          strClave: "",
          strNombre: "",
          intTotalSesiones: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          helpers.setStatus(undefined);
          try {
            await crearMateriaMutation.mutateAsync(values);
            helpers.resetForm();
            helpers.setStatus({ success: "Materia creada con éxito." });
          } catch (error) {
            console.error("No se pudo crear la materia", error);
            helpers.setStatus({
              error:
                "No se pudo registrar la materia. Verifica la información e inténtalo nuevamente.",
            });
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <MotionWrapper
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Form className="materias__form">
              <div className="materias__group" style={{ gridColumn: "1 / -1" }}>
                <label className="materias__label" htmlFor="strClave">
                  Clave
                </label>
                <Field
                  id="strClave"
                  name="strClave"
                  type="text"
                  className="materias__input"
                  placeholder="Ej. MAT101"
                />
                <ErrorMessage
                  name="strClave"
                  component="p"
                  className="materias__errors"
                />
              </div>

              <div className="materias__group" style={{ gridColumn: "1 / -1" }}>
                <label className="materias__label" htmlFor="strNombre">
                  Nombre
                </label>
                <Field
                  id="strNombre"
                  name="strNombre"
                  type="text"
                  className="materias__input"
                  placeholder="Nombre de la materia"
                />
                <ErrorMessage
                  name="strNombre"
                  component="p"
                  className="materias__errors"
                />
              </div>

              <div className="materias__group">
                <label className="materias__label" htmlFor="intTotalSesiones">
                  Total de sesiones
                </label>
                <Field
                  id="intTotalSesiones"
                  name="intTotalSesiones"
                  type="number"
                  min="1"
                  className="materias__input"
                  placeholder="Ej. 40"
                />
                <ErrorMessage
                  name="intTotalSesiones"
                  component="p"
                  className="materias__errors"
                />
              </div>

              <div className="materias__actions">
                <button
                  type="submit"
                  className="button-primary"
                  disabled={isSubmitting || crearMateriaMutation.isPending}
                >
                  {crearMateriaMutation.isPending
                    ? "Guardando..."
                    : "Registrar materia"}
                </button>
              </div>

              {status?.error && (
                <p className="materias__status materias__status--error">
                  {status.error}
                </p>
              )}
              {status?.success && (
                <p className="materias__status materias__status--success">
                  {status.success}
                </p>
              )}
            </Form>
          </MotionWrapper>
        )}
      </Formik>

      <MotionListSection
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
      >
        <div className="materias__list-header">
          <h3 className="panel-card__title">Listado de materias</h3>
          <p className="materias__list-description">
            Consulta el catálogo obtenido desde la API configurada.
          </p>
        </div>

        {isLoading && <p className="muted-text">Cargando materias...</p>}

        {isError && (
          <p className="materias__status materias__status--error">
            Ocurrió un error al obtener las materias: {error?.message || "Error desconocido"}
          </p>
        )}

        {!isLoading && !isError && materias.length === 0 && (
          <p className="muted-text">No hay materias registradas.</p>
        )}

        <div className="materias__list">
          {materias?.datos?.map((materia) => (
            <MotionCard
              key={materia.intMateria || materia.id || materia.strClave}
              className="materias__item"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              <p className="materias__item-code">{materia.strClave}</p>
              <h4 className="materias__item-name">{materia.strNombre}</h4>
              <p className="materias__item-meta">
                Total de sesiones: {materia.intTotalSesiones ?? "N/D"}
              </p>
            </MotionCard>
          ))}
        </div>
      </MotionListSection>
    </MotionContainer>
  );
};

export default Materias;
