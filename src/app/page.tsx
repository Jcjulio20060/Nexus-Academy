import styles from './page.module.css';
import Link from 'next/link';
import { getClassesForToday, getDatabase } from '@/lib/data';
import HomeClient from './HomeClient';

export const revalidate = 0; // Disable cache for student console to ensure freshness during tab switches

export default async function Home() {
  const classesToday = await getClassesForToday();
  const db = await getDatabase();

  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <Link href="/admin/login" style={{
              fontSize: '0.8rem',
              color: 'var(--foreground-muted)',
              textDecoration: 'none',
              padding: '0.4rem 0.8rem',
              border: '1px solid var(--surface-border)',
              borderRadius: '8px',
              background: 'var(--surface)',
              fontWeight: 500
            }}>
              Admin
            </Link>
          </div>
          <p className={styles.subtitle} style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}>{dateStr}</p>
          <h1 className={styles.title}>Café e Código</h1>
        </header>

        <HomeClient
          classesToday={classesToday}
          db={db}
        />
      </div>
    </main>
  );
}
