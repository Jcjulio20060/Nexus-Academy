import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { saveFile } from '@/lib/storage';

export async function POST(req: NextRequest) {
    if (!(await isAdminRequest(req))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const title = (formData.get('title') as string)?.trim();
        const subjectId = parseInt(formData.get('subjectId') as string);
        const linkUrl = (formData.get('url') as string)?.trim();
        const file = formData.get('file') as File | null;

        if (!title || !subjectId) {
            return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
        }

        let url = linkUrl || '';
        let type = 'LINK';
        let fileName: string | null = null;

        if (file && file.size > 0) {
            const stored = await saveFile(file);
            url = stored.url;
            fileName = stored.fileName;
            type = 'FILE';
        }

        if (!url) {
            return NextResponse.json({ success: false, error: 'Informe um link ou envie um arquivo' }, { status: 400 });
        }

        await prisma.resource.create({
            data: { title, url, type, fileName, subjectId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Resource creation error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
