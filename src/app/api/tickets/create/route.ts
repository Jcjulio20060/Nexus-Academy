import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { saveFile } from '@/lib/storage';
import { notifyAdmin } from '@/lib/notify';

const CATEGORY_LABEL: Record<string, string> = {
    GERAL: 'Geral',
    ACADEMICO: 'Acadêmico',
    TECNICO: 'Técnico',
    OUTRO: 'Outro'
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const studentId = parseInt(formData.get('studentId') as string);
        const subject = (formData.get('subject') as string)?.trim();
        const category = (formData.get('category') as string) || 'GERAL';
        const message = (formData.get('message') as string)?.trim();
        const file = formData.get('file');

        if (!studentId || !subject || !message) {
            return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
        }

        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (!student) {
            return NextResponse.json({ success: false, error: 'Aluno não encontrado' }, { status: 400 });
        }

        let attachmentUrl: string | null = null;
        let fileName: string | null = null;
        if (file instanceof File && file.size > 0) {
            const stored = await saveFile(file, 'tickets');
            attachmentUrl = stored.url;
            fileName = stored.fileName;
        }

        const ticket = await prisma.ticket.create({
            data: {
                subject,
                category,
                message,
                studentId,
                attachmentUrl,
                fileName
            }
        });

        await notifyAdmin(
            `Novo ticket: ${subject}`,
            `
                <h2>Novo ticket de ${student.name} (${student.registration})</h2>
                <p><strong>Categoria:</strong> ${CATEGORY_LABEL[category] || category}</p>
                <p><strong>Assunto:</strong> ${subject}</p>
                <p><strong>Mensagem:</strong> ${message}</p>
                ${attachmentUrl ? `<p><a href="${attachmentUrl}">Ver anexo</a></p>` : ''}
                <hr />
                <p>Acesse o painel administrativo para responder.</p>
            `
        );

        return NextResponse.json({ success: true, id: ticket.id });
    } catch (error) {
        console.error('Ticket creation error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
