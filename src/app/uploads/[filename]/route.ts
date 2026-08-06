import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { uploadsDir } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const MIME: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    zip: 'application/zip',
    txt: 'text/plain',
    md: 'text/markdown',
    csv: 'text/csv'
};

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
    const { filename } = await params;
    const base = path.basename(filename);

    if (base !== filename || base.includes('..') || !/^[\w.\-]+$/.test(base)) {
        return new NextResponse('Not Found', { status: 404 });
    }

    try {
        const data = await readFile(path.join(uploadsDir(), base));
        const ext = base.split('.').pop()?.toLowerCase() || '';
        const type = MIME[ext] || 'application/octet-stream';
        return new NextResponse(data, {
            headers: {
                'Content-Type': type,
                'Content-Disposition': `inline; filename="${encodeURIComponent(base)}"`,
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });
    } catch {
        return new NextResponse('Not Found', { status: 404 });
    }
}
