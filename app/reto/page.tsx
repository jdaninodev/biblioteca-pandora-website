"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TimerBadge,
  ChallengeTypeBadge,
  QuestionArea,
  ResultModal,
  ActionButton,
  LoadingState,
} from "./components";
import { ArrowLeft } from "lucide-react";

type User = {
  id: string;
  nickname: string;
  role?: string;
};

type Challenge = {
  type: "Matemáticas" | "Lectura crítica";
  question: string;
  options: string[];
  correctAnswer: number;
};

// Banco de preguntas de ejemplo (puedes expandir esto más adelante)
const challengeBank: Challenge[] = [
  {
    type: "Matemáticas",
    question: "¿Cuánto es 12 + 8?",
    options: ["18", "20", "22", "24"],
    correctAnswer: 1,
  },
  {
    type: "Matemáticas",
    question: "Si tienes 5 manzanas y compras 3 más, ¿cuántas tienes en total?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 2,
  },
  {
    type: "Lectura crítica",
    question: "María leyó un cuento sobre un gato que ayudaba a otros animales. ¿Qué palabra describe mejor al gato?",
    options: ["Egoísta", "Amable", "Travieso", "Dormilón"],
    correctAnswer: 1,
  },
  {
    type: "Matemáticas",
    question: "¿Cuánto es 7 × 3?",
    options: ["18", "21", "24", "28"],
    correctAnswer: 1,
  },
  {
    type: "Lectura crítica",
    question: "Pedro llegó tarde a la escuela porque se quedó dormido. ¿Cuál es la causa de que llegara tarde?",
    options: ["La escuela está lejos", "Se quedó dormido", "Perdió el bus", "No tenía reloj"],
    correctAnswer: 1,
  },
];


export default function RetoPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    try {
      const raw = localStorage.getItem("bp_user");
      if (!raw) {
        router.push("/");
        return;
      }
      setUser(JSON.parse(raw));

      // Get challenge type from localStorage or randomize
      const storedType = localStorage.getItem("bp_current_challenge_type");
      const challengeType = storedType || (Math.random() > 0.5 ? "Matemáticas" : "Lectura crítica");
      
      // Filter and select random challenge
      const filtered = challengeBank.filter((c) => c.type === challengeType);
      const randomChallenge = filtered[Math.floor(Math.random() * filtered.length)];
      setChallenge(randomChallenge);
      
      // Start timer
      setTimerRunning(true);
    } catch (e) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || !challenge || !user) return;
    
    setTimerRunning(false);
    const correct = selectedAnswer === challenge.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // Save challenge to database via API
    try {
      // Mapear el tipo de challenge a los tipos de la base de datos
      const typeMapping: { [key: string]: string } = {
        'Matemáticas': 'matematicas',
        'Lectura crítica': 'lectura',
      };
      
      const mappedType = typeMapping[challenge.type] || challenge.type.toLowerCase();

      const response = await fetch('/api/challenges/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type: mappedType,
          timeInSeconds: seconds,
          isCorrect: correct,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error saving challenge to database:', data.error || 'Unknown error');
      } else {
        console.log('Challenge saved successfully:', data);
      }
    } catch (e) {
      console.error("Error saving challenge:", e);
    }
  };

  const handleContinue = () => {
    router.push("/dashboard");
  };

  if (!user || !challenge) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 px-3 md:px-6 lg:px-8 pt-12 pb-4 overflow-hidden">
      <button
        onClick={() => router.push("/dashboard")}
        className="fixed left-4 top-20 md:top-32 z-50 inline-flex items-center gap-2 bg-white/95 text-gray-800 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <TimerBadge seconds={seconds} />
      
      <ChallengeTypeBadge type={challenge.type} />

      <QuestionArea
        challenge={challenge}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        isCorrect={isCorrect}
        onAnswerSelect={handleAnswerSelect}
      />

      {showResult ? (
        <ResultModal
          isCorrect={isCorrect}
          seconds={seconds}
          onContinue={handleContinue}
        />
      ) : (
        <ActionButton
          showResult={showResult}
          selectedAnswer={selectedAnswer}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
