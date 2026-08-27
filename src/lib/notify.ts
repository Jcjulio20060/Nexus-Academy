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
        <div style="background:#171109;padding:32px 16px;font-family:ui-monospace,'JetBrains Mono',Consolas,monospace;color:#f5efdf">
            <div style="max-width:520px;margin:0 auto;background:#1d1710;border:1px solid #3a3120;border-radius:12px;overflow:hidden">
                <div style="padding:14px 24px;border-bottom:1px solid #3a3120;font-size:13px;letter-spacing:1px;color:#f2a63b">// Coffee &amp; Code</div>
                <div style="padding:24px">
                    <h1 style="margin:0 0 14px;font-size:15px;color:#f2a63b">${title}</h1>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#e8e0cd">${body}</p>
                    ${footer ? `<p style="margin:18px 0 0;font-size:12px;color:#8a7f68">${footer}</p>` : ''}
                </div>
                <div style="padding:12px 24px;border-top:1px solid #3a3120;font-size:11px;color:#8a7f68">Coffee &amp; Code · console do aluno</div>
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
