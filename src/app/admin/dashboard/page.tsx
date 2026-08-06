import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDatabase, getAllTickets, getAllAbsences } from '@/lib/data';
import AdminDashboardClient from './AdminDashboardClient';

export default async function Dashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        redirect('/admin/login');
    }

    const [db, tickets, absences] = await Promise.all([getDatabase(), getAllTickets(), getAllAbsences()]);

    return <AdminDashboardClient initialData={db} initialTickets={tickets} initialAbsences={absences} />;
}
