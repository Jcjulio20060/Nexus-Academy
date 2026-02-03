import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';

export async function POST(request: Request) {
    const formData = await request.formData();

    const subject = formData.get('subject') as string;
    const professor = formData.get('professor') as string;
    const room = formData.get('room') as string;
    const day = formData.get('day') as string;
    const start = formData.get('start') as string;
    const end = formData.get('end') as string;
    // Determine period based on existing logic or user input. For simplicity, we might let user input or auto-calc.
    // Let's assume period is optional or calculated.
    // For now, let's just default to 1 or parse if provided.
    const period = Number(formData.get('period') || 1);

    if (subject && day && start && end) {
        await prisma.classSession.create({
            data: {
                subject,
                professor: professor || '',
                room: room || '',
                day,
                start,
                end,
                period
            }
        });
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
