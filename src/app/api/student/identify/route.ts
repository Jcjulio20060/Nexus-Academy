import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const name = (body.name as string)?.trim();
        const registration = (body.registration as string)?.trim();
        const email = (body.email as string)?.trim() || null;

        if (!name || !registration) {
            return NextResponse.json({ success: false, error: 'Nome e matrícula são obrigatórios' }, { status: 400 });
        }

        const student = await prisma.student.upsert({
            where: { registration },
            update: { name, email },
            create: { name, registration, email }
        });

        return NextResponse.json({ success: true, student: { id: student.id, name: student.name, registration: student.registration } });
    } catch (error) {
        console.error('Student identify error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
