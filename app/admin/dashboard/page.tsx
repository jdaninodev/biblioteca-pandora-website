import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdmin } from "../../../lib/adminAuth";
import { prisma } from "../../../lib/prisma";

export default async function AdminDashboard() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const verified = token ? verifyAdmin(token) : null;
  if (!verified) {
    redirect('/admin/login');
  }

  // Gather stats
  const totalUsers = await prisma.user.count();
  const totalAssigned = await prisma.userChallenge.count();
  const completed = await prisma.userChallenge.count({ where: { completedAt: { not: null } } });
  const correct = await prisma.userChallenge.count({ where: { correct: true } });

  const avgTimeAgg = await prisma.userChallenge.aggregate({
    _avg: { timeSeconds: true },
    where: { timeSeconds: { not: null } },
  });

  const avgTime = Math.round((avgTimeAgg._avg.timeSeconds ?? 0) as number);

  return (
    <main className="flex min-h-[calc(100vh-72px)] w-full max-w-6xl mx-auto flex-col gap-8 py-12 px-6">
      <header>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Estadísticas del grupo</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Usuarios totales</div>
          <div className="text-2xl font-semibold">{totalUsers}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Retos asignados</div>
          <div className="text-2xl font-semibold">{totalAssigned}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Retos completados</div>
          <div className="text-2xl font-semibold">{completed}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Aciertos</div>
          <div className="text-2xl font-semibold">{correct}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Tiempo promedio (s)</div>
          <div className="text-2xl font-semibold">{avgTime}</div>
        </div>
      </section>

      <footer className="mt-6">
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="px-3 py-2 bg-red-600 text-white rounded">Cerrar sesión</button>
        </form>
      </footer>
    </main>
  );
}
