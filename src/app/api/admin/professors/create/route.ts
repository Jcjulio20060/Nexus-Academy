import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    await prisma.professor.create({
        data: {
            name,
            email
        }
    });

    return NextResponse.json({ success: true });
}
