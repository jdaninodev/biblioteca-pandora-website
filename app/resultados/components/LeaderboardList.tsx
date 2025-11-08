type LeaderboardEntry = {
  name: string;
  points: number;
};

import { Crown, Zap, Star } from "lucide-react";

type Props = {
  entries: LeaderboardEntry[];
  onAddSample?: () => void;
};

export default function LeaderboardList({ entries, onAddSample }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Aún no hay resultados esta semana.</p>
        <p className="text-sm text-grayMuted">La tabla se actualizará con los puntajes de los estudiantes y se reiniciará cada domingo.</p>
        {onAddSample && (
          <div className="mt-6 flex justify-center">
            <button onClick={onAddSample} className="px-6 py-3 bg-blueSky text-white rounded-lg text-lg font-bold shadow-sm">Agregar ejemplo</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {entries.map((e, i) => {
        // Determine badge for top positions
        let badge = (
          <div className="w-10 h-10 rounded-full bg-blueSky text-white flex items-center justify-center font-bold text-sm md:text-base">{i + 1}</div>
        );
        if (i === 0) {
          badge = (
            <div className="w-12 h-12 rounded-full bg-yellow-400 text-white flex items-center justify-center shadow-md">
              <Crown className="w-6 h-6 text-white" />
            </div>
          );
        } else if (i === 1) {
          badge = (
            <div className="w-11 h-11 rounded-full bg-orange-400 text-white flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5" />
            </div>
          );
        } else if (i === 2) {
          badge = (
            <div className="w-11 h-11 rounded-full bg-orange-200 text-white flex items-center justify-center shadow-md">
              <Star className="w-5 h-5 text-white" />
            </div>
          );
        }

        return (
          <li key={i} className="flex items-center justify-between p-4 md:p-5 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-center gap-4">
              {badge}
              <div>
                <div className="font-bold text-lg md:text-xl">{e.name}</div>
                <div className="text-sm text-gray-500">{e.points} puntos</div>
              </div>
            </div>
            <div className="font-extrabold text-xl md:text-2xl text-gray-800">{e.points}</div>
          </li>
        );
      })}
    </ol>
  );
}
