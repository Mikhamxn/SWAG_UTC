import { useEffect, useState } from "react";
import { Save, BookOpen, User } from "lucide-react";

function AsignarMateria() {
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [asignacion, setAsignacion] = useState({
    profesor_id: "",
    materia_id: "",
  });
  const [mensaje, setMensaje] = useState("");

  // Cargar datos desde API
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resProfes = await fetch("/api/profesores");
        const resMaterias = await fetch("/api/materias");

        if (!resProfes.ok || !resMaterias.ok) {
          throw new Error("Error al cargar datos desde el servidor");
        }

        const dataProfes = await resProfes.json();
        const dataMaterias = await resMaterias.json();

        setProfesores(dataProfes);
        setMaterias(dataMaterias);
      } catch (error) {
        setMensaje("No se pudieron cargar los datos.");
      }
    };

    cargarDatos();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setAsignacion({ ...asignacion, [name]: value });
  };

  const guardarAsignacion = async () => {
    if (!asignacion.profesor_id || !asignacion.materia_id) {
      setMensaje("Selecciona un profesor y una materia.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/asignacion_detalle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asignacion),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Asignación guardada correctamente");
        setAsignacion({ profesor_id: "", materia_id: "" });
      } else {
        setMensaje(data.message || "Error al guardar asignación");
      }
    } catch (err) {
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Asignar Materia a Profesor
        </h1>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Profesor
            </label>
            <select
              name="profesor_id"
              value={asignacion.profesor_id}
              onChange={manejarCambio}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            >
              <option value="">Selecciona un profesor</option>
              {profesores.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nombre} {prof.apellido_paterno}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Materia
            </label>
            <select
              name="materia_id"
              value={asignacion.materia_id}
              onChange={manejarCambio}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
            >
              <option value="">Selecciona una materia</option>
              {materias.map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={guardarAsignacion}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Asignar Materia
          </button>

          {mensaje && (
            <p className="text-center mt-4 text-sm font-medium text-gray-700 bg-gray-100 py-2 rounded-lg">
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AsignarMateria;
