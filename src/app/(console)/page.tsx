import { getClassesForToday, getDatabase } from '@/lib/data';
import HomeClient from './HomeClient';

export const revalidate = 0; // Disable cache for student console to ensure freshness during tab switches

export default async function Home() {
  const classesToday = await getClassesForToday();
  const db = await getDatabase();

  return (
    <div style={{ padding: '2rem 1.5rem 3rem' }}>
      <HomeClient
        classesToday={classesToday}
        db={db}
      />
    </div>
  );
}
