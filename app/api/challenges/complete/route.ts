import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, question, timeInSeconds, isCorrect, points } = body;

    // Validar datos requeridos
    if (!userId || !type || !question || timeInSeconds === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos', received: { userId, type, question, timeInSeconds, isCorrect } },
        { status: 400 }
      );
    }

    // Obtener la fecha del inicio de la semana (lunes)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);

    // Calcular puntos si no se enviaron
    let calculatedPoints = points;
    if (!calculatedPoints && isCorrect) {
      // Puntos base por tipo de reto
      const basePoints: { [key: string]: number } = {
        'lectura': 10,
        'lecturacritica': 10,
        'matematicas': 15,
        'memoria': 15,
        'palabra': 12,
        'adivinanza': 8,
      };

      calculatedPoints = basePoints[type.toLowerCase()] || 10;

      // Bonus por tiempo (si completó en menos de 30 segundos)
      if (timeInSeconds < 30) {
        calculatedPoints += 5;
      } else if (timeInSeconds < 60) {
        calculatedPoints += 2;
      }
    }

    // Guardar el reto completado
    const completedChallenge = await prisma.completedChallenge.create({
      data: {
        userId,
        type,
        question,
        timeInSeconds,
        isCorrect,
        points: calculatedPoints || 0,
        weekStart,
      },
    });

    return NextResponse.json({
      success: true,
      challenge: completedChallenge,
      message: 'Reto guardado exitosamente',
    });
  } catch (error) {
    console.error('Error guardando reto:', error);
    return NextResponse.json(
      { error: 'Error al guardar el reto', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Obtener historial de retos de un usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    const challenges = await prisma.completedChallenge.findMany({
      where,
      orderBy: { completedAt: 'desc' },
      take: 50, // Limitar a últimos 50 retos
    });

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error('Error obteniendo retos:', error);
    return NextResponse.json(
      { error: 'Error al obtener retos' },
      { status: 500 }
    );
  }
}
