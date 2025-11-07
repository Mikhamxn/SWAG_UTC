import { useState, useEffect } from "react";
import { UserPlus, Edit2, Trash2, Save, X, Users } from "lucide-react";

function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    materia: "",
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profesores")
      .then((res) => res.json())
      .then((data) => {
        setProfesores(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar profesores:", err);
        setLoading(false);
      });
  }, []);

  const agregar = async () => {
    if (!nuevo.nombre || !nuevo.apellidoPaterno || !nuevo.materia)
      return alert("Completa los campos obligatorios");

    const res = await fetch("/api/profesores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });

    const data = await res.json();
    setProfesores([...profesores, data]);
    setNuevo({ nombre: "", apellidoPaterno: "", apellidoMaterno: "", materia: "" });
  };

  const eliminar = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este profesor?")) return;

    await fetch(`/api/profesores/${id}`, { method: "DELETE" });
    setProfesores(profesores.filter((p) => p.id !== id));
  };

  const editar = (id) => {
    const prof = profesores.find((p) => p.id === id);
    setEditando({ ...prof });
  };

  const guardar = async () => {
    const res = await fetch(`/api/profesores/${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editando),
    });

    const data = await res.json();
    setProfesores(profesores.map((p) => (p.id === editando.id ? data : p)));
    setEditando(null);
  };

  const cancelarEdicion = () => setEditando(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Gestión de Profesores
              </h1>
              <p className="text-gray-600 mt-1">Administra el equipo docente</p>
            </div>
          </div>
        </div>

        {/* Formulario de agregar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Agregar Nuevo Profesor
          </h2>
          <div className="flex flex-col md:flex-row flex-wrap gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Apellido Paterno"
              value={nuevo.apellidoPaterno}
              onChange={(e) => setNuevo({ ...nuevo, apellidoPaterno: e.target.value })}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Apellido Materno"
              value={nuevo.apellidoMaterno}
              onChange={(e) => setNuevo({ ...nuevo, apellidoMaterno: e.target.value })}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Materia"
              value={nuevo.materia}
              onChange={(e) => setNuevo({ ...nuevo, materia: e.target.value })}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={agregar}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
            >
              <UserPlus className="w-5 h-5" />
              Agregar
            </button>
          </div>
        </div>

        {/* Modal de edición */}
        {editando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit2 className="w-6 h-6 text-blue-600" />
                  Editar Profesor
                </h2>
                <button
                  onClick={cancelarEdicion}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={editando.nombre}
                    onChange={(e) =>
                      setEditando({ ...editando, nombre: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido Paterno
                  </label>
                  <input
                    type="text"
                    value={editando.apellidoPaterno}
                    onChange={(e) =>
                      setEditando({ ...editando, apellidoPaterno: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    value={editando.apellidoMaterno}
                    onChange={(e) =>
                      setEditando({ ...editando, apellidoMaterno: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materia
                  </label>
                  <input
                    type="text"
                    value={editando.materia}
                    onChange={(e) =>
                      setEditando({ ...editando, materia: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={guardar}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
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

        {/* Lista de profesores */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
            <h2 className="text-2xl font-bold text-white">
              Lista de Profesores ({profesores.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Cargando profesores...
            </div>
          ) : profesores.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No hay profesores registrados. ¡Agrega el primero!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Apellido Paterno
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Apellido Materno
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Materia
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profesores.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {p.nombre}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {p.apellidoPaterno}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {p.apellidoMaterno}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {p.materia}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => editar(p.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => eliminar(p.id)}
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

export default Profesores;
