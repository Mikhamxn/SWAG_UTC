import { useState, useEffect } from "react";
import { UserPlus, Edit2, Trash2, Save, X, Users } from "lucide-react";

function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", matricula: "", grupo: "" });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alumnos")
      .then((res) => res.json())
      .then((data) => {
        setAlumnos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar alumnos:", err);
        setLoading(false);
      });
  }, []);

  const agregar = async () => {
    if (!nuevo.nombre || !nuevo.matricula || !nuevo.grupo)
      return alert("Completa todos los campos");

    const res = await fetch("/api/alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });

    const data = await res.json();
    setAlumnos([...alumnos, data]);
    setNuevo({ nombre: "", matricula: "", grupo: "" });
  };

  const eliminar = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este alumno?")) return;

    await fetch(`/api/alumnos/${id}`, {
      method: "DELETE",
    });
    setAlumnos(alumnos.filter((a) => a.id !== id));
  };

  const editar = (id) => {
    const alum = alumnos.find((a) => a.id === id);
    setEditando({ ...alum });
  };

  const guardar = async () => {
    const res = await fetch(`/api/alumnos/${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editando),
    });
    const data = await res.json();

    setAlumnos(alumnos.map((a) => (a.id === editando.id ? data : a)));
    setEditando(null);
  };

  const cancelarEdicion = () => setEditando(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-green-500 to-teal-600 p-3 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Gestión de Alumnos
              </h1>
              <p className="text-gray-600 mt-1">Administra el registro estudiantil</p>
            </div>
          </div>
        </div>

        {/* Formulario de agregar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-600" />
            Agregar Nuevo Alumno
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "nombre", label: "Nombre" },
              { key: "apellido", label: "Apellido" },
              { key: "correo", label: "Correo" },
              { key: "matricula", label: "Matrícula" },
              { key: "carrera", label: "Carrera" },
              { key: "registrador", label: "Registrador" },
            ].map((campo) => (
              <input
                key={campo.key}
                type="text"
                placeholder={campo.label}
                value={nuevo[campo.key]}
                onChange={(e) =>
                  setNuevo({ ...nuevo, [campo.key]: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
            ))}
          </div>
          <button
            onClick={agregar}
            className="mt-4 bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
          >
            <UserPlus className="w-5 h-5" />
            Agregar
          </button>
        </div>

        {/* Modal de edición */}
        {editando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit2 className="w-6 h-6 text-green-600" />
                  Editar Alumno
                </h2>
                <button
                  onClick={cancelarEdicion}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { key: "nombre", label: "Nombre" },
                  { key: "apellido", label: "Apellido" },
                  { key: "correo", label: "Correo" },
                  { key: "matricula", label: "Matrícula" },
                  { key: "carrera", label: "Carrera" },
                  { key: "registrador", label: "Registrador" },
                ].map((campo) => (
                  <input
                    key={campo.key}
                    type="text"
                    placeholder={campo.label}
                    value={editando[campo.key]}
                    onChange={(e) =>
                      setEditando({ ...editando, [campo.key]: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                  />
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={guardar}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
                >
                  <Save className="w-5 h-5" />
                  Guardar
                </button>
                <button
                  onClick={cancelarEdicion}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de alumnos */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-green-500 to-teal-600">
            <h2 className="text-2xl font-bold text-white">
              Lista de Alumnos ({alumnos.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Cargando alumnos...
            </div>
          ) : alumnos.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No hay alumnos registrados. ¡Agrega el primero!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Nombre",
                      "Apellido",
                      "Correo",
                      "Matrícula",
                      "Carrera",
                      "Registrador",
                      "Acciones",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {alumnos.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{a.nombre}</td>
                      <td className="px-6 py-4 text-gray-700">{a.apellido}</td>
                      <td className="px-6 py-4 text-gray-700">{a.correo}</td>
                      <td className="px-6 py-4 text-gray-700">{a.matricula}</td>
                      <td className="px-6 py-4 text-gray-700">{a.carrera}</td>
                      <td className="px-6 py-4 text-gray-700">{a.registrador}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => editar(a.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => eliminar(a.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Alumnos;
