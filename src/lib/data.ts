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
// Re-export Prisma types for frontend use
import { Prisma } from '@prisma/client';
export type { ClassSession, Event, Notice, Resource, Subject, Professor } from '@prisma/client';

export type ClassSessionWithRelations = Prisma.ClassSessionGetPayload<{
    include: { subject: true; professor: true }
}>;

export type ResourceWithRelations = Prisma.ResourceGetPayload<{
    include: { subject: true }
}>;

export interface Database {
    classes: ClassSessionWithRelations[];
    events: Event[];
    notices: Notice[];
    resources: ResourceWithRelations[];
    subjects: Subject[];
    professors: Professor[];
}

export async function getDatabase() {
    const classes = await prisma.classSession.findMany({
        orderBy: { start: 'asc' },
        include: { subject: true, professor: true }
    });
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' }
    });
    const notices = await prisma.notice.findMany({
        orderBy: { createdAt: 'desc' }
    });
    const resources = await prisma.resource.findMany({
        orderBy: { createdAt: 'desc' },
        include: { subject: true }
    });
    const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } });
    const professors = await prisma.professor.findMany({ orderBy: { name: 'asc' } });

    return { classes, events, notices, resources, subjects, professors };
}

export async function getCurrentClass(): Promise<ClassSessionWithRelations | null> {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];

    // Prisma doesn't support complex time comparisons easily with just string columns in SQLite
    // So we fetch classes for the day and filter in JS
    const classesToday = await prisma.classSession.findMany({
        where: { day: dayName },
        include: { subject: true, professor: true }
    });

    return classesToday.find(c =>
        currentTime >= c.start &&
        currentTime <= c.end
    ) || null;
}

export async function getUpcomingClassesForDay(): Promise<ClassSessionWithRelations[]> {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];

    const classesToday = await prisma.classSession.findMany({
        where: { day: dayName },
        orderBy: { start: 'asc' },
        include: { subject: true, professor: true }
    });

    return classesToday.filter(c => c.start > currentTime);
}
