"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      // Guardar sesión en localStorage
      localStorage.setItem("admin_session", data.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Error al conectar con el servidor");
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen pt-4 px-6 bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md transform -translate-y-8 md:-translate-y-12"
      >
        <div className="bg-white rounded-2xl shadow-medium p-8 border-2 border-blueDeep/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blueDeep text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-blueDeep mb-2">
              Acceso para Profesores
            </h1>
            <p className="text-gray-600">
              Ingresa tu contraseña de administrador
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña de Administrador
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blueDeep focus:outline-none text-lg"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-redDanger text-redDanger px-4 py-3 rounded-lg text-sm font-semibold"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blueDeep text-white py-3 rounded-lg font-bold text-lg shadow-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : "Ingresar"}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-blueDeep hover:underline text-sm font-medium"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
