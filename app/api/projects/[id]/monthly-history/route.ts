import { NextRequest, NextResponse } from 'next/server';
import { MonthlyWorkRecord, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Buscar histórico mensal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

    const history = await prisma.monthlyHistory.findFirst({
      where: {
        projectId: id,
        year,
        month,
      },
      include: {
        records: {
          orderBy: {
            date: 'asc'
          }
        }
      }
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('Erro ao buscar histórico mensal:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar/Atualizar histórico mensal
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { year, month, records } = body;

    // Calcular totais
    const totalMinutes = records.reduce((sum: number, record: MonthlyWorkRecord) => {
      return sum + (record.enabled ? record.duration : 0);
    }, 0);
    
    const totalHours = totalMinutes / 60;
    const totalDays = records.filter((r: MonthlyWorkRecord) => r.enabled).length;

    // Verificar se já existe histórico para este mês
    const existingHistory = await prisma.monthlyHistory.findFirst({
      where: {
        projectId: id,
        year,
        month,
      }
    });

    let monthlyHistoryId: string;

    if (existingHistory) {
      // Atualizar histórico existente
      await prisma.monthlyHistory.update({
        where: { id: existingHistory.id },
        data: {
          totalHours,
          totalDays,
        }
      });
      monthlyHistoryId = existingHistory.id;
    } else {
      const newHistory = await prisma.monthlyHistory.create({
        data: {
          projectId: id,
          year,
          month,
          totalHours,
          totalDays,
        }
      });
      monthlyHistoryId = newHistory.id;
    }

    const processPromises = records.map(async (record: MonthlyWorkRecord) => {
      const existingRecord = await prisma.monthlyWorkRecord.findFirst({
        where: {
          projectId: id,
          date: record.date,
        }
      });

      if (existingRecord) {
        return prisma.monthlyWorkRecord.update({
          where: { id: existingRecord.id },
          data: {
            monthlyHistoryId,
            year,
            month,
            dayOfWeek: record.dayOfWeek,
            enabled: record.enabled,
            start: record.start,
            end: record.end,
            discountLunch: record.discountLunch,
            duration: record.duration,
          }
        });
      } else {
        return prisma.monthlyWorkRecord.create({
          data: {
            monthlyHistoryId,
            projectId: id,
            year,
            month,
            date: record.date,
            dayOfWeek: record.dayOfWeek,
            enabled: record.enabled,
            start: record.start,
            end: record.end,
            discountLunch: record.discountLunch,
            duration: record.duration,
          }
        });
      }
    });

    await Promise.all(processPromises);

    const updatedHistory = await prisma.monthlyHistory.findUnique({
      where: { id: monthlyHistoryId },
      include: {
        records: {
          orderBy: {
            date: 'asc'
          }
        }
      }
    });

    return NextResponse.json(updatedHistory);
  } catch (error) {
    console.error('Erro ao salvar histórico mensal:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar registro específico do mês
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { recordId, enabled, start, end, discountLunch } = body;

    let duration = 0;
    if (enabled && start && end) {
      const [startHour, startMin] = start.split(':').map(Number);
      const [endHour, endMin] = end.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      duration = endMinutes - startMinutes;
      
      if (discountLunch) {
        duration -= 60;
      }
    }

    const updatedRecord = await prisma.monthlyWorkRecord.update({
      where: { id: recordId },
      data: {
        enabled,
        start: enabled ? start : null,
        end: enabled ? end : null,
        discountLunch,
        duration,
      }
    });

    const allRecords = await prisma.monthlyWorkRecord.findMany({
      where: {
        projectId: id,
        year: updatedRecord.year,
        month: updatedRecord.month,
      }
    });

    const totalMinutes = allRecords.reduce((sum, record) => {
      return sum + (record.enabled ? record.duration : 0);
    }, 0);
    
    const totalHours = totalMinutes / 60;
    const totalDays = allRecords.filter(r => r.enabled).length;

    await prisma.monthlyHistory.updateMany({
      where: {
        projectId: id,
        year: updatedRecord.year,
        month: updatedRecord.month,
      },
      data: {
        totalHours,
        totalDays,
      }
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error('Erro ao atualizar registro mensal:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 