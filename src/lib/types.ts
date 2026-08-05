export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'STAFF';
export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';
export type EnrollmentStatus = 'ENROLLED' | 'WAITLISTED' | 'DROPPED' | 'COMPLETED';
export type FileCategory = 'MATERIAL' | 'DOCUMENT' | 'ANNOUNCEMENT' | 'OTHER';
export type TicketStatus = 'OPEN' | 'PENDING' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ImportantDateCategory =
  | 'EXAM'
  | 'PROJECT'
  | 'ACTIVITY'
  | 'DEADLINE'
  | 'EVENT'
  | 'OTHER';
export type NoticeCategory = 'GENERAL' | 'ALERT' | 'MAINTENANCE' | 'REMINDER';
export type NoticeAudience = 'ALL' | 'STUDENTS' | 'TEACHERS' | 'STAFF';
export type AbsenceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: number;
  email: string;
  username: string | null;
  name: string | null;
  role: UserRole;
  phone: string | null;
  createdAt?: string;
}

export interface Aluno {
  id: number;
  userId: number;
  registrationNumber: string;
  course: string;
  year: number;
  active: boolean;
}

export interface Professor {
  id: number;
  userId: number;
  employeeNumber: string;
  department: string;
  bio: string | null;
  active: boolean;
}

export interface PublicProfessor {
  id: number;
  userId: number;
  name: string | null;
  department: string;
  bio: string | null;
  active: boolean;
}

export interface Cadeira {
  id: number;
  code: string;
  title: string;
  description: string | null;
  credits: number | null;
  semester: number | null;
  teacherId: number | null;
  createdAt: string;
}

export interface Horario {
  id: number;
  cadeiraId: number;
  professorId: number | null;
  day: Weekday;
  startTime: string;
  endTime: string;
  location: string | null;
}

export interface Matricula {
  id: number;
  alunoId: number;
  cadeiraId: number;
  status: EnrollmentStatus;
  enrolledAt: string;
  grade: number | null;
}

export interface Arquivo {
  id: number;
  title: string;
  description: string | null;
  url: string;
  category: FileCategory;
  visible: boolean;
  uploadedAt: string;
  uploadedById: number | null;
  alunoId: number | null;
  professorId: number | null;
  cadeiraId: number | null;
}

export interface Ticket {
  id: number;
  subject: string;
  description: string | null;
  requesterId: number;
  assignedToId: number | null;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}

export interface TicketWithNames extends Ticket {
  requesterName: string | null;
  assignedName: string | null;
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  senderId: number;
  senderName: string;
  body: string;
  internal: boolean;
  createdAt: string;
}

export interface ImportantDate {
  id: number;
  title: string;
  description: string | null;
  category: ImportantDateCategory;
  date: string;
  endDate: string | null;
  allDay: boolean;
  location: string | null;
  relatedCadeiraId: number | null;
  createdAt: string;
  visible: boolean;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: NoticeCategory;
  audience: NoticeAudience;
  isPinned: boolean;
  visible: boolean;
  publishedAt: string;
  expiresAt: string | null;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  isActive: boolean;
}

export interface AbsenceJustification {
  id: number;
  alunoId: number;
  cadeiraId: number | null;
  submittedAt: string;
  startDate: string;
  endDate: string;
  reason: string;
  proofUrl: string | null;
  status: AbsenceStatus;
  reviewedById: number | null;
  reviewedAt: string | null;
  response: string | null;
}
