import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
    if (!(await isAdminRequest(req))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const id = parseInt(formData.get('id') as string);

    await prisma.representative.delete({
        where: { id }
    });

    return NextResponse.json({ success: true });
}
