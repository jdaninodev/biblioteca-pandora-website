"use client";

import React, { useEffect, useRef, useState } from "react";

type User = {
	nickname: string;
	pin: string;
};

export default function Navbar() {
	const [nickname, setNickname] = useState("");
	const [pin, setPin] = useState("");
	const [user, setUser] = useState<User | null>(null);
	const [error, setError] = useState("");

	const [assignedChallenge, setAssignedChallenge] = useState<string | null>(null);
	const [running, setRunning] = useState(false);
	const [seconds, setSeconds] = useState(0);
	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		// load session from localStorage
		try {
			const raw = localStorage.getItem("bp_user");
			if (raw) {
				const parsed = JSON.parse(raw) as User;
				setUser(parsed);
			}
		} catch (e) {
			// ignore
		}
	}, []);

	useEffect(() => {
		if (running) {
			timerRef.current = window.setInterval(() => {
				setSeconds((s) => s + 1);
			}, 1000);
		} else {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [running]);

	const validatePin = (p: string) => /^\d{4}$/.test(p);

	const handleLogin = () => {
		setError("");
		if (!nickname.trim()) {
			setError("El apodo no puede estar vacío.");
			return;
		}
		if (!validatePin(pin)) {
			setError("La contraseña debe tener 4 dígitos.");
			return;
		}

		const u: User = { nickname: nickname.trim(), pin };
		setUser(u);
		try {
			localStorage.setItem("bp_user", JSON.stringify(u));
		} catch (e) {
			// ignore
		}
		setNickname("");
		setPin("");
	};

	const handleLogout = () => {
		setUser(null);
		setAssignedChallenge(null);
		setRunning(false);
		setSeconds(0);
		try {
			localStorage.removeItem("bp_user");
		} catch (e) {}
	};

	const assignChallenge = () => {
		const types = ["Matemáticas", "Lectura crítica"];
		const chosen = types[Math.floor(Math.random() * types.length)];
		setAssignedChallenge(chosen);
		setSeconds(0);
		setRunning(true);
	};

	const formatTime = (secs: number) => {
		const m = Math.floor(secs / 60)
			.toString()
			.padStart(2, "0");
		const s = (secs % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	return (
		<nav style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
			<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
				<div style={{ fontWeight: 700, fontSize: 18 }}>Biblioteca Pandora</div>
				<div style={{ color: "#6b7280", fontSize: 13 }}>Plataforma de retos</div>
			</div>

			<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
				{!user ? (
					<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
						<input
							aria-label="Apodo"
							placeholder="Apodo"
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #d1d5db" }}
						/>
						<input
							aria-label="PIN de 4 dígitos"
							placeholder="PIN (4 dígitos)"
							value={pin}
							onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
							maxLength={4}
							type="password"
							style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #d1d5db", width: 120 }}
						/>
						<button onClick={handleLogin} style={{ padding: "6px 10px", borderRadius: 6, background: "#111827", color: "#fff", border: "none" }}>
							Iniciar sesión
						</button>
						{error && <div style={{ color: "#dc2626", fontSize: 13 }}>{error}</div>}
					</div>
				) : (
					<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
						<div style={{ fontSize: 14 }}>
							Hola, <strong>{user.nickname}</strong>
						</div>
						<button onClick={assignChallenge} style={{ padding: "6px 10px", borderRadius: 6, background: "#0ea5e9", color: "#041014", border: "none" }}>
							Asignarme reto
						</button>
						<button onClick={handleLogout} style={{ padding: "6px 10px", borderRadius: 6, background: "#ef4444", color: "#fff", border: "none" }}>
							Salir
						</button>
					</div>
				)}
			</div>

			{/* Below nav area: show active challenge + timer (kept visually in the same component for simplicity) */}
			<div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 64 }}>
				{assignedChallenge && (
					<div style={{ background: "#fff", border: "1px solid #e5e7eb", padding: 10, borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
						<div style={{ fontWeight: 700 }}>{assignedChallenge}</div>
						<div style={{ color: "#6b7280", marginTop: 4 }}>Tiempo: {formatTime(seconds)}</div>
						<div style={{ marginTop: 8 }}>
							<button onClick={() => setRunning((r) => !r)} style={{ marginRight: 8, padding: "6px 10px", borderRadius: 6 }}>
								{running ? "Pausar" : "Reanudar"}
							</button>
							<button
								onClick={() => {
									setRunning(false);
									setSeconds(0);
									setAssignedChallenge(null);
								}}
								style={{ padding: "6px 10px", borderRadius: 6 }}
							>
								Finalizar
							</button>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}

