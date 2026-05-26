import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const id = parseInt(formData.get('id') as string);
        const answer = formData.get('answer') as string;

        await prisma.communicationPost.update({
            where: { id },
            data: {
                answer,
                status: 'CLOSED'
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to answer' }, { status: 500 });
    }
}
