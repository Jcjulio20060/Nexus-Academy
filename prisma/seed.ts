import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Matérias (Sequencial)
    const subMat = await prisma.subject.upsert({
        where: { name: 'Matemática Discreta' },
        update: {},
        create: { name: 'Matemática Discreta', code: 'MAT01' }
    });

    const subAlg = await prisma.subject.upsert({
        where: { name: 'Algoritmos e Programação' },
        update: {},
        create: { name: 'Algoritmos e Programação', code: 'CC01' }
    });

    const subBd = await prisma.subject.upsert({
        where: { name: 'Banco de Dados' },
        update: {},
        create: { name: 'Banco de Dados', code: 'BD01' }
    });

    // 2. Professores
    const profCarlos = await prisma.professor.create({
        data: { name: 'Carlos Silva', email: 'carlos@nexus.edu' }
    });

    const profAna = await prisma.professor.create({
        data: { name: 'Ana Souza', email: 'ana@nexus.edu' }
    });

    // 3. Aulas (Classes)
    await prisma.classSession.create({
        data: {
            day: 'Monday',
            start: '08:00',
            end: '10:00',
            room: 'Sala 101',
            subjectId: subMat.id,
            professorId: profCarlos.id
        }
    });

    await prisma.classSession.create({
        data: {
            day: 'Wednesday',
            start: '14:00',
            end: '16:00',
            room: 'Lab 03',
            subjectId: subAlg.id,
            professorId: profAna.id
        }
    });

    // 4. Recursos
    await prisma.resource.create({
        data: {
            title: 'Lista de Exercícios 1',
            url: 'https://google.com',
            subjectId: subMat.id
        }
    });

    // 5. Admin
    await prisma.adminUser.upsert({
        where: { username: 'admin' },
        update: { password: process.env.ADMIN_PASSWORD || 'admin123' },
        create: { username: 'admin', password: process.env.ADMIN_PASSWORD || 'admin123' }
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
