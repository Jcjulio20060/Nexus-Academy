import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
    if (!(await isAdminRequest(req))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const period = formData.get('period') as string;

    await prisma.subject.create({
        data: {
            name,
            code,
            period: period || null
        }
    });

    return NextResponse.json({ success: true });
}
