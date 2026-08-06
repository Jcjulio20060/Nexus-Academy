import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { saveFile } from '@/lib/storage';
import { notifyAdmin } from '@/lib/notify';

function todayStr(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const studentId = parseInt(formData.get('studentId') as string);
        const subjectId = parseInt(formData.get('subjectId') as string);
        const date = (formData.get('date') as string)?.trim();
        const reason = (formData.get('reason') as string)?.trim();
        const file = formData.get('file');

        if (!studentId || !subjectId || !date || !reason) {
            return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > todayStr()) {
            return NextResponse.json({ success: false, error: 'Data inválida' }, { status: 400 });
        }

        const [student, subject] = await Promise.all([
            prisma.student.findUnique({ where: { id: studentId } }),
            prisma.subject.findUnique({ where: { id: subjectId } })
        ]);

        if (!student || !subject) {
            return NextResponse.json({ success: false, error: 'Aluno ou matéria não encontrados' }, { status: 400 });
        }

        let attachmentUrl: string | null = null;
        let fileName: string | null = null;
        if (file instanceof File && file.size > 0) {
            const stored = await saveFile(file, 'absences');
            attachmentUrl = stored.url;
            fileName = stored.fileName;
        }

        const justification = await prisma.absenceJustification.create({
            data: {
                studentId,
                subjectId,
                date,
                reason,
                attachmentUrl,
                fileName
            }
        });

        const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

        await notifyAdmin(
            `Justificativa de falta de ${student.name}`,
            `
                <h2>Nova justificativa de ${student.name} (${student.registration})</h2>
                <p><strong>Matéria:</strong> ${subject.name}${subject.period ? ` (${subject.period})` : ''}</p>
                <p><strong>Data da falta:</strong> ${formattedDate}</p>
                <p><strong>Motivo:</strong> ${reason}</p>
                ${attachmentUrl ? `<p><a href="${attachmentUrl}">Ver anexo</a></p>` : ''}
                <hr />
                <p>Acesse o painel administrativo para aprovar ou reprovar.</p>
            `
        );

        return NextResponse.json({ success: true, id: justification.id });
    } catch (error) {
        console.error('Absence creation error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
