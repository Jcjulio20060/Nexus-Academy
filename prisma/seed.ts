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

    // 5. Admin
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
