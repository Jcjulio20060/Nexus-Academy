import { put, del } from '@vercel/blob';
import { mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const UPLOADS_DIR = path.join(process.cwd(), '.uploads');

export interface StoredFile {
    url: string;
    fileName: string;
}

export async function saveFile(file: File, folder: string = ''): Promise<StoredFile> {
    const safeName = file.name.replace(/[^\w.\-]/g, '_');
    const key = path.posix.join(folder, `${randomUUID()}-${safeName}`);

    // Produção (Vercel): usa Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const { url } = await put(key, file, { access: 'public' });
        return { url, fileName: file.name };
    }

    // Desenvolvimento/produção local: salva em .uploads (fora do public/)
    await mkdir(path.join(UPLOADS_DIR, folder), { recursive: true });
    await writeFile(path.join(UPLOADS_DIR, key), Buffer.from(await file.arrayBuffer()));
    return { url: `/uploads/${key}`, fileName: file.name };
}

export async function deleteFile(url: string): Promise<void> {
    try {
        if (url.startsWith('http')) {
            if (process.env.BLOB_READ_WRITE_TOKEN) await del(url);
            return;
        }
        const relative = url.replace(/^\/uploads\//, '');
        await unlink(path.join(UPLOADS_DIR, relative));
    } catch {
        // Arquivo não encontrado — ignora
    }
}

export function uploadsDir(): string {
    return UPLOADS_DIR;
}
