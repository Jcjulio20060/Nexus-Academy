import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;

    await prisma.subject.create({
        data: {
            name,
            code
        }
    });

    return NextResponse.json({ success: true });
}
