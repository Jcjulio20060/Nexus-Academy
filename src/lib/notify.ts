import { Resend } from 'resend';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'juliocesarqueiroz20060@gmail.com';

export async function notifyAdmin(subject: string, html: string): Promise<void> {
    if (!process.env.API_KEY_RESEND) return;

    try {
        const resend = new Resend(process.env.API_KEY_RESEND);
        await resend.emails.send({
            from: 'Coffee & Code <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject,
            html
        });
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}
