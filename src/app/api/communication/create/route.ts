import { prisma } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.API_KEY_RESEND);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const question = formData.get('question') as string;

        const post = await prisma.communicationPost.create({
            data: {
                firstName,
                lastName,
                question,
                status: 'OPEN'
            }
        });

        // Send email notification via Resend
        if (process.env.API_KEY_RESEND) {
            try {
                await resend.emails.send({
                    from: 'Nexus Academy <onboarding@resend.dev>',
                    to: ['juliocesarqueiroz20060@gmail.com'], // In a real app, this should be the representative's or admin's email
                    subject: 'Nova Solicitação no Portal - Nexus Academy',
                    html: `
                        <h2>Nova pergunta de ${firstName} ${lastName}</h2>
                        <p><strong>Dúvida:</strong> ${question}</p>
                        <hr />
                        <p>Acesse o painel administrativo para responder.</p>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // We don't fail the request if only email fails
            }
        }

        return NextResponse.json({ success: true, id: post.id });
    } catch (error) {
        console.error('Communication creation error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
