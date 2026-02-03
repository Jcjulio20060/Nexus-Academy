import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from root
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const newPassword = process.env.ADMIN_PASSWORD;

    if (!newPassword) {
        console.error('❌ ERRO: ADMIN_PASSWORD não definido no arquivo .env');
        process.exit(1);
    }

    const user = await prisma.adminUser.upsert({
        where: { username: 'admin' },
        update: { password: newPassword },
        create: { username: 'admin', password: newPassword }
    });

    console.log(`✅ Sucesso! Senha do usuário "${user.username}" atualizada para o valor definido no .env.`);
}

main()
    .catch((e) => {
        console.error('❌ Falha ao atualizar senha:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
