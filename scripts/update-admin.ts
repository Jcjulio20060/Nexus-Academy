import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

// Load .env from root
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const rawPassword = process.env.ADMIN_PASSWORD;

    if (!rawPassword) {
        console.error('❌ ERRO: ADMIN_PASSWORD não definido no arquivo .env');
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = await prisma.adminUser.upsert({
        where: { username: 'admin' },
        update: { password: hashedPassword },
        create: { username: 'admin', password: hashedPassword }
    });

    console.log(`✅ Sucesso! Senha do usuário "${user.username}" atualizada e criptografada.`);
}

main()
    .catch((e) => {
        console.error('❌ Falha ao atualizar senha:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
