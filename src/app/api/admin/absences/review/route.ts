import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { isAdminRequest } from '@/lib/auth';
import { reviewAbsence } from '@/lib/services/absences';

export async function POST(request: Request) {
    if (!(await isAdminRequest(request))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);
        const status = formData.get('status') as string;
        const adminNote = (formData.get('adminNote') as string)?.trim() || null;

        if (!id || (status !== 'APPROVED' && status !== 'REJECTED')) {
            return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
        }

        const justification = await prisma.absenceJustification.findUnique({
            where: { id },
            include: { student: true, subject: true }
        });
        if (!justification) {
            return NextResponse.json({ success: false, error: 'Justificativa não encontrada' }, { status: 404 });
        }

        await reviewAbsence(id, status, adminNote);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Absence review error:', error);
        return NextResponse.json({ success: false, error: 'Failed to review' }, { status: 500 });
    }
}
