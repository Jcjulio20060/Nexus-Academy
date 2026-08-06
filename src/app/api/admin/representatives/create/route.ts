import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import * as bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    if (!(await isAdminRequest(req))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const contact = formData.get('contact') as string;
    const email = formData.get('email') as string;
    const photoUrl = formData.get('photoUrl') as string;
    const password = formData.get('password') as string;

    const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : null;

    await prisma.representative.create({
        data: { name, role, contact, email, photoUrl, password: hashedPassword }
    });

    return NextResponse.json({ success: true });
}
