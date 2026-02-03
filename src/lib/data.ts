import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Re-export types for compatibility
export type ClassSession = {
    id: number;
    day: string; // 'Monday', 'Tuesday', ...
    period: number;
    start: string; // "HH:MM" 24h
    end: string;
    subject: string;
    room: string;
    professor: string;
}

export type Event = {
    id: number;
    title: string;
    date: string; // ISO YYYY-MM-DD
    type: string; // 'exam' | 'assignment' | 'holiday' | 'other'
}

export type Notice = {
    id: number;
    message: string;
    active: boolean;
}

export type Resource = {
    id: number;
    title: string;
    subject: string;
    url: string;
}

export interface Database {
    classes: ClassSession[];
    events: Event[];
    notices: Notice[];
    resources: Resource[];
}

export async function getDatabase() {
    const classes = await prisma.classSession.findMany({
        orderBy: { start: 'asc' }
    });
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' }
    });
    const notices = await prisma.notice.findMany({
        orderBy: { createdAt: 'desc' }
    });
    const resources = await prisma.resource.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return { classes, events, notices, resources };
}

export async function getCurrentClass(): Promise<ClassSession | null> {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];

    // Prisma doesn't support complex time comparisons easily with just string columns in SQLite
    // So we fetch classes for the day and filter in JS
    const classesToday = await prisma.classSession.findMany({
        where: { day: dayName }
    });

    return classesToday.find(c =>
        currentTime >= c.start &&
        currentTime <= c.end
    ) || null;
}

export async function getUpcomingClassesForDay(): Promise<ClassSession[]> {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];

    const classesToday = await prisma.classSession.findMany({
        where: { day: dayName },
        orderBy: { start: 'asc' }
    });

    return classesToday.filter(c => c.start > currentTime);
}
