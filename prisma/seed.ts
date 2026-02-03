import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

import 'dotenv/config'; // Load env vars
const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(__dirname, '../src/data/db.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Seed Classes
    for (const cls of data.classes) {
        await prisma.classSession.create({
            data: {
                day: cls.day,
                period: cls.period,
                start: cls.start,
                end: cls.end,
                subject: cls.subject,
                room: cls.room,
                professor: cls.professor
            }
        });
    }

    // Seed Events
    for (const evt of data.events) {
        await prisma.event.create({
            data: {
                title: evt.title,
                date: evt.date,
                type: evt.type
            }
        });
    }

    // Seed Notices
    for (const ntc of data.notices) {
        await prisma.notice.create({
            data: {
                message: ntc.message,
                active: ntc.active
            }
        });
    }

    // Seed Admin
    await prisma.adminUser.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: 'admin123' // Plaintext for now as per plan
        }
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
