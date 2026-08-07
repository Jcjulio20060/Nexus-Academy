import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
    if (!(await isAdminRequest(req))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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
