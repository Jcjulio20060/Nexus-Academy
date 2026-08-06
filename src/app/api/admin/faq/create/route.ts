import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
    if (!(await isAdminRequest(req))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const question = formData.get('question') as string;
    const answer = formData.get('answer') as string;
    const order = parseInt(formData.get('order') as string || '0');

    await prisma.faq.create({
        data: { question, answer, order }
    });

    return NextResponse.json({ success: true });
}
