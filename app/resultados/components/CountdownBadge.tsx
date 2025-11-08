type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function CountdownBadge({ days, hours, minutes, seconds }: Countdown) {
  return (
    <div className="text-right">
      <div className="text-sm text-gray-500">Próximo reinicio:</div>
      <div className="text-lg font-bold text-gray-800">
        {days}d {String(hours).padStart(2, "0")}h {String(minutes).padStart(2, "0")}m {String(seconds).padStart(2, "0")}s
      </div>
    </div>
  );
}
