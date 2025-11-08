import { useRouter } from "next/navigation";

type Props = {
  onReset: () => void;
  onAddSample: () => void;
};

export default function ResultsControls({ onReset, onAddSample }: Props) {
  const router = useRouter();
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <button
        onClick={() => router.back()}
        className="w-full sm:w-auto px-5 py-3 rounded-lg bg-white border border-gray-200 text-gray-800 hover:shadow-md hover:bg-gray-50 text-lg font-medium"
      >
        Volver
      </button>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-3 rounded-lg bg-red-100 text-redDanger hover:bg-red-200 text-lg font-semibold"
        >
          Reiniciar ahora
        </button>
        <button
          onClick={onAddSample}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blueSky text-white hover:brightness-95 shadow-sm text-lg font-bold"
        >
          Agregar ejemplo
        </button>
      </div>
    </div>
  );
}
