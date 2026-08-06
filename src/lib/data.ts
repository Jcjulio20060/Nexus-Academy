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
import { Prisma, ClassSession, Notice, Resource, Subject, Professor, Event as PrismaEvent, Representative, Faq, Student, PushSubscription, Ticket, TicketReply, AbsenceJustification } from '@prisma/client';
export type { ClassSession, Notice, Resource, Subject, Professor, Representative, Faq, Student, PushSubscription, Ticket, TicketReply, AbsenceJustification };
export type AcademicEvent = PrismaEvent;

export type ClassSessionWithRelations = Prisma.ClassSessionGetPayload<{
    include: { subject: true; professor: true }
}>;

export type ResourceWithRelations = Prisma.ResourceGetPayload<{
    include: { subject: true }
}>;

export type TicketWithReplies = Prisma.TicketGetPayload<{
    include: { student: true; replies: { orderBy: { createdAt: 'asc' } } }
}>;

export type AbsenceWithRelations = Prisma.AbsenceJustificationGetPayload<{
    include: { student: true; subject: true }
}>;

export interface Database {
    classes: ClassSessionWithRelations[];
    events: AcademicEvent[];
    notices: Notice[];
    resources: ResourceWithRelations[];
    subjects: Subject[];
    professors: Professor[];
    representatives: Representative[];
    faqs: Faq[];
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
    const representatives = await prisma.representative.findMany({ orderBy: { role: 'asc' } });
    const faqs = await prisma.faq.findMany({ orderBy: { order: 'asc' } });

    return { classes, events, notices, resources, subjects, professors, representatives, faqs };
}

export async function getAllTickets(): Promise<TicketWithReplies[]> {
    return await prisma.ticket.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            student: true,
            replies: { orderBy: { createdAt: 'asc' } }
        }
    });
}

export async function getAllAbsences(): Promise<AbsenceWithRelations[]> {
    return await prisma.absenceJustification.findMany({
        orderBy: { createdAt: 'desc' },
        include: { student: true, subject: true }
    });
}

export async function getClassesForToday(): Promise<ClassSessionWithRelations[]> {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];

    return await prisma.classSession.findMany({
        where: { day: dayName },
        orderBy: { start: 'asc' },
        include: { subject: true, professor: true }
    });
}
