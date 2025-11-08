"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Trophy, LogIn, Target, Star } from "lucide-react";

type User = {
  nickname: string;
  pin: string;
};

export default function Navbar() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [pin, setPin] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  // Load user from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("bp_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const validatePin = (p: string) => /^\d{4}$/.test(p);

  const handleLogin = () => {
    setError("");
    if (!nickname.trim()) return setError("¡Necesitas un apodo!");
    if (!validatePin(pin)) return setError("El PIN debe tener 4 números");

    const u: User = { nickname: nickname.trim(), pin };
    setUser(u);
    localStorage.setItem("bp_user", JSON.stringify(u));
    setNickname("");
    setPin("");
    
    // Redirect to dashboard after successful login
    router.push("/dashboard");
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
      {/* Navbar principal con colores personalizados - Fijo en la parte superior */}
      <nav className="bg-blueSky shadow-medium fixed top-0 left-0 right-0 z-40">
        <div className="container-center">
          <div className="flex items-center justify-between py-4">
            {/* Logo con animación */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="bg-white rounded-round p-2 shadow-soft">
                <BookOpen className="text-blueDeep w-7 h-7" />
              </div>
              <div className="text-white">
                <div className="font-black text-2xl tracking-tight drop-shadow-md">
                  Biblioteca Pandora
                </div>
                <div className="text-xs font-medium text-white/90">
                  ¡Aventuras de aprendizaje!
                </div>
              </div>
            </motion.div>

            {/* Sección central - Login o Usuario */}
            <div className="flex-1 flex justify-center">
              <AnimatePresence mode="wait">
                {!user ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="card flex flex-col gap-3"
                  >
                    <div className="flex gap-2 items-center">
                      <input
                        aria-label="Apodo"
                        placeholder="Tu apodo"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-40"
                      />
                      <input
                        aria-label="PIN de 4 dígitos"
                        placeholder="PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                        maxLength={4}
                        type="password"
                        className="w-24"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogin}
                        className="bg-greenSuccess flex items-center gap-2"
                      >
                        <LogIn className="w-5 h-5" />
                        ¡Entrar!
                      </motion.button>
                    </div>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-redDanger text-sm font-semibold bg-red-50 px-3 py-2 rounded-soft"
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
                    className="card flex gap-3 items-center"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-yellowWarm rounded-full p-2 border-2 border-orangeAccent">
                        <Star className="w-5 h-5 text-orangeAccent fill-orangeAccent" />
                      </div>
                      <div>
                        <div className="text-xs text-grayMuted font-medium">Hola,</div>
                        <div className="text-lg font-black text-gray-800">{user.nickname}</div>
                      </div>
                    </div>
                    
                    <div className="h-10 w-px bg-graySoft"></div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={assignChallenge}
                      className="bg-blueDeep flex items-center gap-2"
                    >
                      <Target className="w-5 h-5" />
                      ¡Nuevo Reto!
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="bg-grayMuted"
                    >
                      Salir
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botón de resultados */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/resultados')}
              className="bg-white text-gray-800 flex items-center gap-2"
            >
              <Trophy className="w-5 h-5 text-orangeAccent" />
              <span>Tabla de posiciones</span>
            </motion.button>
          </div>
        </div>
      </nav>
    </>
  );
}