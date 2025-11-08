"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CountdownBadge, LeaderboardList, ResultsControls } from "./components";

type LeaderboardEntry = {
  name: string;
  points: number;
};

function getNextSundayMidnight(now = new Date()) {
  const daysAhead = (7 - now.getDay()) % 7 || 7; // always next Sunday (not today)
  const next = new Date(now);
  next.setDate(now.getDate() + daysAhead);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getLastSundayMidnight(now = new Date()) {
  const daysBack = now.getDay(); // 0 = Sunday
  const last = new Date(now);
  last.setDate(now.getDate() - daysBack);
  last.setHours(0, 0, 0, 0);
  return last;
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now.getTime());
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  return { days, hours, minutes, seconds, remainingMs: diff };
}

export default function ResultadosPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const nextSunday = useMemo(() => getNextSundayMidnight(), []);
  const lastSunday = useMemo(() => getLastSundayMidnight(), []);
  const countdown = useCountdown(nextSunday);

  useEffect(() => {
    // Load leaderboard from localStorage (if any)
    try {
      const raw = localStorage.getItem("bp_leaderboard");
      const stored = raw ? JSON.parse(raw) : [];
      setLeaderboard(stored);

      // Check last reset marker, if older than lastSunday we clear
      const storedReset = localStorage.getItem("bp_leaderboard_last_reset");
      const storedResetDate = storedReset ? new Date(storedReset) : null;
      if (!storedResetDate || storedResetDate.getTime() < lastSunday.getTime()) {
        // Clear leaderboard and store new reset marker
        localStorage.removeItem("bp_leaderboard");
        localStorage.setItem("bp_leaderboard_last_reset", lastSunday.toISOString());
        setLeaderboard([]);
      }
    } catch (e) {
      console.error("Error reading leaderboard:", e);
    }
  }, [lastSunday]);

  const addSample = () => {
    // Helper to add random sample data (dev only)
    const next = [...leaderboard];
    next.push({ name: `Alumno ${next.length + 1}`, points: Math.floor(Math.random() * 100) });
    next.sort((a, b) => b.points - a.points);
    setLeaderboard(next);
    localStorage.setItem("bp_leaderboard", JSON.stringify(next));
  };

  return (
    <div className="min-h-screen pt-32 px-6 md:px-8 lg:px-12 bg-gradient-to-br from-white to-blue-50 flex flex-col items-center">
  <div className="w-full max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-blueDeep">Tabla de posiciones</h1>
            <p className="text-sm text-gray-600">Lista semanal de estudiantes — se reinicia cada domingo</p>
          </div>

          <div>
            {/* Countdown component */}
            <CountdownBadge days={countdown.days} hours={countdown.hours} minutes={countdown.minutes} seconds={countdown.seconds} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-medium p-6">
            <LeaderboardList entries={leaderboard} onAddSample={addSample} />
          </div>

          <aside className="bg-white rounded-2xl shadow-medium p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-2">Top de la semana</h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 3).map((e, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blueSky text-white flex items-center justify-center font-bold">{i + 1}</div>
                    <div>
                      <div className="font-bold text-sm">{e.name}</div>
                      <div className="text-xs text-gray-500">{e.points} pts</div>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && <div className="text-sm text-gray-500">No hay datos aún</div>}
              </div>
            </div>

            <div>
              <CountdownBadge days={countdown.days} hours={countdown.hours} minutes={countdown.minutes} seconds={countdown.seconds} />
            </div>

            <ResultsControls
              onReset={() => { localStorage.removeItem('bp_leaderboard'); setLeaderboard([]); }}
              onAddSample={addSample}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
