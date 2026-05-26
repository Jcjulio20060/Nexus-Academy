import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const id = parseInt(formData.get('id') as string);

    await prisma.representative.delete({
        where: { id }
    });

    return NextResponse.json({ success: true });
}
