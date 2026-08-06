import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load .env
dotenv.config();

const prisma = new PrismaClient();

async function upsertProfessor(name: string, email: string) {
    const existing = await prisma.professor.findFirst({ where: { name } });
    if (existing) {
        return prisma.professor.update({ where: { id: existing.id }, data: { email } });
    }
    return prisma.professor.create({ data: { name, email } });
}

async function upsertClass(data: { day: string; start: string; end: string; room: string; subjectId: number; professorId: number }) {
    const existing = await prisma.classSession.findFirst({
        where: { day: data.day, start: data.start, end: data.end, room: data.room, subjectId: data.subjectId, professorId: data.professorId }
    });
    if (!existing) {
        await prisma.classSession.create({ data });
    }
}

async function upsertResource(title: string, url: string, subjectId: number) {
    const existing = await prisma.resource.findFirst({ where: { title, url, subjectId } });
    if (!existing) {
        await prisma.resource.create({ data: { title, url, subjectId } });
    }
}

function isoDate(daysFromNow: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().slice(0, 10);
}

async function upsertEvent(title: string, daysFromNow: number, type: string) {
    const date = isoDate(daysFromNow);
    const existing = await prisma.event.findFirst({ where: { title } });
    if (!existing) {
        await prisma.event.create({ data: { title, date, type } });
    }
}

async function upsertFaq(question: string, answer: string, order: number) {
    const existing = await prisma.faq.findFirst({ where: { question } });
    if (!existing) {
        await prisma.faq.create({ data: { question, answer, order } });
    }
}

async function upsertNotice(message: string) {
    const existing = await prisma.notice.findFirst({ where: { message } });
    if (!existing) {
        await prisma.notice.create({ data: { message, active: true } });
    }
}

async function upsertRepresentative(name: string, role: string, contact: string, email: string, passwordHash: string) {
    const existing = await prisma.representative.findFirst({ where: { name } });
    if (existing) {
        await prisma.representative.update({
            where: { id: existing.id },
            data: { role, contact, email, password: existing.password ?? passwordHash }
        });
    } else {
        await prisma.representative.create({ data: { name, role, contact, email, password: passwordHash } });
    }
}

async function main() {
    // 1. Matérias (Sequencial)
    const subMat = await prisma.subject.upsert({
        where: { name: 'Matemática Discreta' },
        update: { period: '2026/1' },
        create: { name: 'Matemática Discreta', code: 'MAT01', period: '2026/1' }
    });

    const subAlg = await prisma.subject.upsert({
        where: { name: 'Algoritmos e Programação' },
        update: { period: '2026/1' },
        create: { name: 'Algoritmos e Programação', code: 'CC01', period: '2026/1' }
    });

    await prisma.subject.upsert({
        where: { name: 'Banco de Dados' },
        update: { period: '2026/2' },
        create: { name: 'Banco de Dados', code: 'BD01', period: '2026/2' }
    });

    // 2. Professores (idempotente)
    const profCarlos = await upsertProfessor('Carlos Silva', 'carlos@nexus.edu');
    const profAna = await upsertProfessor('Ana Souza', 'ana@nexus.edu');

    // 3. Aulas (Classes) - idempotente
    await upsertClass({
        day: 'Monday',
        start: '08:00',
        end: '10:00',
        room: 'Sala 101',
        subjectId: subMat.id,
        professorId: profCarlos.id
    });

    await upsertClass({
        day: 'Wednesday',
        start: '14:00',
        end: '16:00',
        room: 'Lab 03',
        subjectId: subAlg.id,
        professorId: profAna.id
    });

    // 4. Recursos - idempotente
    await upsertResource('Lista de Exercícios 1', 'https://google.com', subMat.id);
    await upsertResource('Apresentação de Aulas', 'https://google.com', subAlg.id);
    await upsertResource('Modelo de Projeto', 'https://google.com', subAlg.id);

    // 5. Eventos (datas relativas a hoje) - idempotente
    await upsertEvent('Prova de Matemática Discreta', 7, 'exam');
    await upsertEvent('Entrega do Trabalho de Algoritmos', 3, 'assignment');
    await upsertEvent('Apresentação do Projeto Final', 14, 'project');
    await upsertEvent('Feriado — Aniversário da Cidade', 21, 'holiday');

    // 6. FAQ - idempotente
    await upsertFaq(
        'Como justifico uma falta?',
        'Vá em Faltas no menu, clique em "Nova justificativa", preencha a matéria, a data e o motivo. Se tiver atestado, anexe. A análise é feita pela coordenação e você recebe uma notificação com o resultado.',
        1
    );
    await upsertFaq(
        'Onde encontro os materiais das matérias?',
        'Os materiais ficam em Materiais de estudo, agrupados por matéria. Lá você encontra links e arquivos disponibilizados pelos professores.',
        2
    );
    await upsertFaq(
        'Como acompanho meus tickets de suporte?',
        'Em Tickets, abra o ticket e veja a conversa com os representantes. Você pode responder e acompanhar o status (aberto ou encerrado).',
        3
    );
    await upsertFaq(
        'Recebo notificações de avisos importantes?',
        'Sim. Clique no sino na barra superior para ativar as notificações push no seu navegador e receba avisos e atualizações de prazos.',
        4
    );

    // 7. Avisos - idempotente
    await upsertNotice('Bem-vindos de volta! O console do aluno está de cara nova.');
    await upsertNotice('As notas do 2º bimestre serão publicadas até o fim do mês.');

    // 8. Representantes - idempotente
    const repPasswordHash = await bcrypt.hash('rep@2026', 10);
    const vicePasswordHash = await bcrypt.hash('vice@2026', 10);

    await upsertRepresentative(
        'Maria Oliveira',
        'Representante',
        '(11) 99999-0001',
        'maria.representante@example.com',
        repPasswordHash
    );
    await upsertRepresentative(
        'João Pereira',
        'Vice-Representante',
        '(11) 99999-0002',
        'joao.vice@example.com',
        vicePasswordHash
    );

    // 9. Admin
    const rawPassword = process.env.ADMIN_PASSWORD;
    if (!rawPassword) {
        console.error('ADMIN_PASSWORD não definido no arquivo .env. Abortando seed.');
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await prisma.adminUser.upsert({
        where: { username: 'admin' },
        update: { password: hashedPassword },
        create: { username: 'admin', password: hashedPassword }
    });

    console.log('Seed completed successfully');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
