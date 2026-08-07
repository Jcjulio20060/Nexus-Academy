import { prisma } from '@/lib/data';
import { sendNotificationToStudent } from '@/lib/push';
import { notifyAdmin, notifyStudent, emailTemplate, escapeHtml } from '@/lib/notify';
import { notifyAdminTelegram, notifyStudentTelegram, inlineButtons, escapeTg } from '@/lib/telegram';

export async function notifyAdminNewAbsence(id: number): Promise<void> {
    const justification = await prisma.absenceJustification.findUnique({
        where: { id },
        include: { student: true, subject: true }
    });
    if (!justification) return;

    const formattedDate = new Date(justification.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const subjectName = justification.subject?.name || 'Matéria';

    const body = `Nova justificativa de <strong>${escapeHtml(justification.student.name)}</strong> (${escapeHtml(justification.student.registration)}).<br/>Matéria: ${escapeHtml(subjectName)}<br/>Data: ${formattedDate}<br/><br/>${escapeHtml(justification.reason)}`;

    await notifyAdmin(
        `Justificativa de falta de ${justification.student.name}`,
        emailTemplate('Nova justificativa recebida', body, 'Acesse o painel administrativo para aprovar ou reprovar.')
    );

    await notifyAdminTelegram(
        `// nova justificativa #${justification.id} — ${escapeTg(justification.student.name)}\n<strong>${escapeTg(subjectName)}</strong> · ${formattedDate}\n${escapeTg(justification.reason.slice(0, 400))}`,
        inlineButtons([
            [
                { text: 'Aprovar', callbackData: `absence_approve:${justification.id}` },
                { text: 'Reprovar', callbackData: `absence_reject:${justification.id}` }
            ]
        ])
    );
}

export async function reviewAbsence(id: number, status: 'APPROVED' | 'REJECTED', adminNote?: string | null): Promise<void> {
    const justification = await prisma.absenceJustification.findUnique({
        where: { id },
        include: { student: true, subject: true }
    });
    if (!justification) throw new Error('Justificativa não encontrada');

    await prisma.absenceJustification.update({
        where: { id },
        data: { status, adminNote: adminNote || null }
    });

    const formattedDate = new Date(justification.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    const subjectName = justification.subject?.name || 'Matéria';
    const approved = status === 'APPROVED';

    const body = approved
        ? `Sua justificativa para <strong>${escapeHtml(subjectName)}</strong> (${formattedDate}) foi aprovada.${adminNote ? `<br/>Observação: ${escapeHtml(adminNote)}` : ''}`
        : `Sua justificativa para <strong>${escapeHtml(subjectName)}</strong> (${formattedDate}) foi reprovada.${adminNote ? `<br/>Observação: ${escapeHtml(adminNote)}` : ''}`;

    await sendNotificationToStudent(
        justification.studentId,
        approved ? 'Falta justificada' : 'Justificativa reprovada',
        `${subjectName} — ${formattedDate}`,
        '/justificativas'
    );
    await notifyStudent(
        justification.student.email,
        approved ? 'Falta justificada' : 'Justificativa reprovada',
        emailTemplate(approved ? 'Falta justificada' : 'Justificativa reprovada', body)
    );
    await notifyStudentTelegram(
        justification.studentId,
        `${approved ? '// sua justificativa foi aprovada' : '// sua justificativa foi reprovada'} — ${escapeTg(subjectName)} · ${formattedDate}`
    );
}
