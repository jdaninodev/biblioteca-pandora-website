"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Trophy, LogIn, Target, Star, Shield, X, Menu } from "lucide-react";

type User = {
  id: string;
  nickname: string;
  role?: string;
};

export default function Navbar() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [pin, setPin] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [showMobileLogin, setShowMobileLogin] = useState(false);

  // Load user from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("bp_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const validatePin = (p: string) => /^\d{4}$/.test(p);

  const handleLogin = async () => {
    setError("");
    if (!nickname.trim()) return setError("¡Necesitas un apodo!");
    if (!validatePin(pin)) return setError("El PIN debe tener 4 números");

    try {
      const response = await fetch('/api/auth/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      const u: User = data.user;
      setUser(u);
      localStorage.setItem("bp_user", JSON.stringify(u));
      setNickname("");
      setPin("");
      setShowMobileLogin(false);
      
      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("bp_user");
    router.push("/");
  };

  const assignChallenge = () => {
    const types = ["Matemáticas", "Lectura crítica"];
    const chosen = types[Math.floor(Math.random() * types.length)];
    
    // Store the challenge type for the reto page
    localStorage.setItem("bp_current_challenge_type", chosen);
    
    // Redirect to reto page
    router.push("/reto");
  };

  return (
    <>
      {/* Navbar principal - Desktop y Mobile */}
      <nav className="bg-gradient-to-r from-blueSky to-blue-600 shadow-lg fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-28">
            
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-2 md:gap-3 cursor-pointer"
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="bg-white rounded-full p-1.5 md:p-2 shadow-md">
                <BookOpen className="text-blueDeep w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div className="text-white hidden sm:block">
                <div className="font-black text-lg md:text-2xl tracking-tight">
                  Biblioteca Pandora
                </div>
                <div className="text-xs font-medium text-white/90">
                  ¡Aventuras de aprendizaje!
                </div>
              </div>
              <div className="text-white sm:hidden">
                <div className="font-black text-base">Pandora</div>
              </div>
            </motion.div>

            {/* Desktop: Login/User Info */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <AnimatePresence mode="wait">
                {!user ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                  >
                    <div className="flex gap-2 items-center">
                      <input
                        aria-label="Apodo"
                        placeholder="Tu apodo"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blueSky focus:outline-none w-36"
                      />
                      <input
                        aria-label="PIN de 4 dígitos"
                        placeholder="PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                        maxLength={4}
                        type="password"
                        className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blueSky focus:outline-none w-20"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogin}
                        className="bg-greenSuccess text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <LogIn className="w-4 h-4" />
                        Entrar
                      </motion.button>
                    </div>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-redDanger text-xs font-semibold mt-2 bg-red-50 px-2 py-1 rounded"
                      >
                        {error}
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="user"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg flex gap-3 items-center"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-br from-yellowWarm to-orangeAccent rounded-full p-2">
                        <Star className="w-5 h-5 text-white fill-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium">Hola,</div>
                        <div className="text-base font-black text-gray-800">{user.nickname}</div>
                      </div>
                    </div>
                    
                    <div className="h-10 w-px bg-gray-200"></div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={assignChallenge}
                      className="bg-blueDeep text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Target className="w-4 h-4" />
                      Nuevo Reto
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                    >
                      Salir
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop & Mobile: Navigation Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/admin')}
                className="bg-white/90 hover:bg-white text-gray-800 px-3 md:px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-all"
              >
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-blueDeep" />
                <span className="hidden md:inline">Profesores</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/resultados')}
                className="bg-white/90 hover:bg-white text-gray-800 px-3 md:px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-all"
              >
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-orangeAccent" />
                <span className="hidden md:inline">Ranking</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile: Login/User Flotante en la parte inferior */}
      <div className="lg:hidden">
        <AnimatePresence>
          {!user && (
            <motion.button
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={() => setShowMobileLogin(true)}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-greenSuccess to-green-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl z-50 hover:scale-105 transition-transform"
            >
              <LogIn className="w-5 h-5" />
              Ingresar como Estudiante
            </motion.button>
          )}

          {user && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 z-50 border-2 border-blueSky"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="bg-gradient-to-br from-yellowWarm to-orangeAccent rounded-full p-2">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Hola,</div>
                    <div className="text-base font-black text-gray-800">{user.nickname}</div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={assignChallenge}
                  className="bg-blueDeep text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md"
                >
                  <Target className="w-4 h-4" />
                  Reto
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-gray-200 text-gray-700 p-2 rounded-lg font-bold"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Login Mobile */}
        <AnimatePresence>
          {showMobileLogin && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileLogin(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-gray-800">Ingresar</h2>
                  <button
                    onClick={() => setShowMobileLogin(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tu apodo</label>
                    <input
                      aria-label="Apodo"
                      placeholder="Escribe tu apodo"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blueSky focus:outline-none text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">PIN (4 dígitos)</label>
                    <input
                      aria-label="PIN de 4 dígitos"
                      placeholder="••••"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                      maxLength={4}
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blueSky focus:outline-none text-base text-center text-2xl tracking-widest"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-redDanger text-sm font-semibold bg-red-50 px-4 py-3 rounded-xl"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-greenSuccess to-green-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg text-lg"
                  >
                    <LogIn className="w-5 h-5" />
                    ¡Entrar!
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}