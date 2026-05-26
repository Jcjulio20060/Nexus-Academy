import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const contact = formData.get('contact') as string;
    const email = formData.get('email') as string;
    const photoUrl = formData.get('photoUrl') as string;

    await prisma.representative.create({
        data: { name, role, contact, email, photoUrl }
    });

    return NextResponse.json({ success: true });
}
