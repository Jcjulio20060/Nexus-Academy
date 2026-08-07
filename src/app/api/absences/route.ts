import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data';

export async function GET(req: NextRequest) {
    try {
        const studentId = parseInt(req.nextUrl.searchParams.get('studentId') || '');
        if (!studentId) {
            return NextResponse.json({ success: false, error: 'studentId é obrigatório' }, { status: 400 });
        }

        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (!student) {
            return NextResponse.json({ success: false, error: 'Aluno não encontrado' }, { status: 400 });
        }

        const absences = await prisma.absenceJustification.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
            include: { subject: true }
        });

        return NextResponse.json({ success: true, absences });
    } catch (error) {
        console.error('Absences fetch error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
