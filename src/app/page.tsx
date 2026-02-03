import styles from './page.module.css';
import Link from 'next/link';
import { getCurrentClass, getUpcomingClassesForDay, getDatabase } from '@/lib/data';
import CurrentClass from '@/components/CurrentClass';
import UpcomingList from '@/components/UpcomingList';
import ImportantDates from '@/components/ImportantDates';

// Revalidate every 60 seconds to update time-based data
export const revalidate = 60;

export default async function Home() {
  const currentClass = await getCurrentClass();
  const upcomingClasses = await getUpcomingClassesForDay();
  const db = await getDatabase(); // Get full DB for events/notices

  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.subtitle} style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}>{dateStr}</p>
          <h1 className={styles.title}>Nexus Academy</h1>
        </header>

        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <CurrentClass currentClass={currentClass} />

          <UpcomingList classes={upcomingClasses} />

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
              <Link
                href="/schedule"
                style={{
                  padding: '1rem 2rem',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Ver Grade Completa
              </Link>
              <Link
                href="/resources"
                style={{
                  padding: '1rem 2rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--surface-border)',
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Materiais de Aula
              </Link>
            </div>
          </div>

          <ImportantDates events={db.events} notices={db.notices} />
        </div>
      </div>
    </main>
  );
}
