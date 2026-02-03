import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    // Parse fields
    const day = formData.get('day') as string;
    const start = formData.get('start') as string; // HH:MM
    const end = formData.get('end') as string;     // HH:MM
    const room = formData.get('room') as string;

    // Relational IDs
    const subjectId = parseInt(formData.get('subjectId') as string);
    const professorId = parseInt(formData.get('professorId') as string);

    // Calculate period (optional logic, can just be 1, 2, 3...)
    // For MVP, we ignore period or auto-calc. Let's default to null as per schema change (Int?)

    await prisma.classSession.create({
        data: {
            day,
            start,
            end,
            room,
            subjectId,
            professorId
        }
    });

    return NextResponse.json({ success: true });
}
