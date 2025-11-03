export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] w-full max-w-4xl mx-auto flex-col items-center gap-8 py-20 px-6">
      <section className="w-full rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-900">Bienvenidos a Biblioteca Pandora</h1>
        <p className="mt-2 text-zinc-600">
          Plataforma de retos pensada para niños. Aquí podrás iniciar sesión con tu apodo y un PIN de 4 dígitos. Luego podrás
          asignarte un reto de <strong>Matemáticas</strong> o <strong>Lectura crítica</strong> y se medirá el tiempo que tardes.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="font-semibold">¿Cómo empezar?</div>
            <ol className="mt-2 list-decimal list-inside text-zinc-700">
              <li>Ingresa un apodo y PIN en la barra superior.</li>
              <li>Pulsa "Asignarme reto" cuando estés listo.</li>
              <li>Resuelve el reto y pulsa "Finalizar" cuando termines.</li>
            </ol>
          </div>

          <div className="rounded-md border p-4">
            <div className="font-semibold">Para profes y papás</div>
            <p className="mt-1 text-sm text-zinc-600">Los retos y el progreso por ahora se guardan localmente. Más adelante agregaremos gestión de cuentas y seguimiento.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
