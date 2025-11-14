"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Trash2, Eye, EyeOff, X, RefreshCw } from "lucide-react";

type Student = {
  id: string;
  nickname: string;
  createdAt: string;
};

type Props = {
  initialStudents: Student[];
};

export default function StudentManager({ initialStudents }: Props) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!nickname.trim()) {
      setError("El apodo es requerido");
      setLoading(false);
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setError("El PIN debe tener 4 dígitos");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al crear estudiante");
        setLoading(false);
        return;
      }

      // Agregar el nuevo estudiante a la lista
      setStudents([data.student, ...students]);
      setNickname("");
      setPin("");
      setShowModal(false);
      setError("");
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
      console.error("Error creating student:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string, nickname: string) => {
    if (!confirm(`¿Estás seguro de eliminar al estudiante "${nickname}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/students?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Error al eliminar estudiante");
        return;
      }

      // Remover el estudiante de la lista
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Error al eliminar estudiante");
    }
  };

  const refreshStudents = async () => {
    try {
      const response = await fetch("/api/admin/students");
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error("Error refreshing students:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de crear */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Estudiantes</h2>
          <p className="text-sm text-gray-500">
            Total: {students.length} estudiante{students.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshStudents}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blueSky to-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <UserPlus className="w-5 h-5" />
            Crear Estudiante
          </motion.button>
        </div>
      </div>

      {/* Lista de estudiantes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {students.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-semibold mb-2">No hay estudiantes aún</p>
            <p className="text-sm">Crea tu primer estudiante usando el botón de arriba</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Apodo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Fecha de creación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blueSky to-blue-600 text-white flex items-center justify-center font-bold text-lg mr-3">
                          {student.nickname.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-bold text-gray-800">{student.nickname}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(student.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteStudent(student.id, student.nickname)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de crear estudiante */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-gray-800">Crear Estudiante</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleCreateStudent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Apodo del estudiante
                    </label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Ej: Juan, Maria, Pedro..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blueSky focus:outline-none text-base"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      PIN (4 dígitos)
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? "text" : "password"}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                        maxLength={4}
                        placeholder="••••"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blueSky focus:outline-none text-center text-2xl tracking-widest"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {showPin ? (
                          <EyeOff className="w-5 h-5 text-gray-500" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      disabled={loading}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-greenSuccess to-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          Crear
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
