import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDatabase } from '@/lib/data';
import AdminDashboardClient from './AdminDashboardClient';

export default async function Dashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        redirect('/admin/login');
    }

    const db = await getDatabase();

    return <AdminDashboardClient initialData={db} />;
}
