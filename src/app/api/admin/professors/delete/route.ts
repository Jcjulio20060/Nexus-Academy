import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const id = formData.get('id') as string;

    await prisma.professor.delete({
        where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
}
