import { Resend } from 'resend';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'juliocesarqueiroz20060@gmail.com';
const FROM = process.env.EMAIL_FROM || 'Coffee & Code <onboarding@resend.dev>';

export function isEmailConfigured(): boolean {
    return Boolean(process.env.API_KEY_RESEND);
}

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function emailTemplate(title: string, body: string, footer?: string): string {
    return `
        <div style="background:#f6f1e8;padding:32px 16px;font-family:'JetBrains Mono',Consolas,monospace;color:#241c14">
            <div style="max-width:520px;margin:0 auto;background:#fffdf8;border:1px solid rgba(36,28,20,0.12);border-radius:14px;overflow:hidden">
                <div style="padding:14px 24px;border-bottom:1px solid rgba(36,28,20,0.12);font-size:13px;letter-spacing:1px;color:#ab4c05">// Coffee &amp; Code</div>
                <div style="padding:24px">
                    <h1 style="margin:0 0 14px;font-size:15px;color:#ab4c05">${title}</h1>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#6b5c4b">${body}</p>
                    ${footer ? `<p style="margin:18px 0 0;font-size:12px;color:#6b5c4b">${footer}</p>` : ''}
                </div>
                <div style="padding:12px 24px;border-top:1px solid rgba(36,28,20,0.12);font-size:11px;color:#6b5c4b">Coffee &amp; Code · console do aluno</div>
            </div>
        </div>`;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!process.env.API_KEY_RESEND || !to) return;

    try {
        const resend = new Resend(process.env.API_KEY_RESEND);
        await resend.emails.send({
            from: FROM,
            to: [to],
            subject,
            html
        });
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

export async function notifyAdmin(subject: string, html: string): Promise<void> {
    await sendEmail(ADMIN_EMAIL, subject, html);
}

export async function notifyStudent(email: string | null, subject: string, html: string): Promise<void> {
    if (!email) return;
    await sendEmail(email, subject, html);
}
