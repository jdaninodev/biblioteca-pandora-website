import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdmin } from "../../../lib/adminAuth";
import { prisma } from "../../../lib/prisma";
import StudentManager from "./StudentManager";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const verified = token ? verifyAdmin(token) : null;
  if (!verified) {
    redirect('/admin/login');
  }

  // Gather stats - usando el nuevo schema
  const totalStudents = await prisma.user.count({ where: { role: 'student' } });
  const totalChallenges = await prisma.completedChallenge.count();
  const correctChallenges = await prisma.completedChallenge.count({ where: { isCorrect: true } });

  const avgTimeAgg = await prisma.completedChallenge.aggregate({
    _avg: { timeInSeconds: true },
  });

  const avgTime = Math.round((avgTimeAgg._avg.timeInSeconds ?? 0) as number);

  // Obtener lista de estudiantes
  const students = await prisma.user.findMany({
    where: { role: 'student' },
    select: {
      id: true,
      nickname: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">Gestiona estudiantes y visualiza estadísticas</p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button 
              type="submit" 
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        {/* Estadísticas */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blueSky">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Estudiantes totales
            </div>
            <div className="text-4xl font-black text-blueSky">{totalStudents}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Retos completados
            </div>
            <div className="text-4xl font-black text-green-600">{totalChallenges}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Tasa de acierto
            </div>
            <div className="text-4xl font-black text-orange-600">
              {totalChallenges > 0 ? ((correctChallenges / totalChallenges) * 100).toFixed(1) : 0}%
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Tiempo promedio
            </div>
            <div className="text-4xl font-black text-purple-600">{avgTime}s</div>
          </div>
        </section>

        {/* Gestión de estudiantes */}
        <StudentManager initialStudents={students.map((s: { id: string; nickname: string; createdAt: Date }) => ({
          id: s.id,
          nickname: s.nickname,
          createdAt: s.createdAt.toISOString(),
        }))} />

      </div>
    </main>
  );
}
