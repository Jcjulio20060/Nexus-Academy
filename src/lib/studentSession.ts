export interface StudentSession {
    id: number;
    name: string;
    registration: string;
}

const KEY = 'nexus_student';

export function getStudentSession(): StudentSession | null {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as StudentSession) : null;
    } catch {
        return null;
    }
}

export function setStudentSession(student: StudentSession): void {
    localStorage.setItem(KEY, JSON.stringify(student));
}

export function clearStudentSession(): void {
    localStorage.removeItem(KEY);
}
