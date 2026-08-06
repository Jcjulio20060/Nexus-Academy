import styles from './page.module.css';
import Link from 'next/link';
import { getClassesForToday, getDatabase } from '@/lib/data';
import HomeClient from './HomeClient';
import WeatherWidget from '@/components/WeatherWidget';
import StudentBadge from '@/components/StudentBadge';
import ThemeToggle from '@/components/ThemeToggle';
import PushNotificationManager from '@/components/PushNotificationManager';
import BrandLogo from '@/components/BrandLogo';

export const revalidate = 0; // Disable cache for student console to ensure freshness during tab switches

export default async function Home() {
  const classesToday = await getClassesForToday();
  const db = await getDatabase();

  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header} style={{ marginBottom: '2.5rem' }}>
          <div className="header-top-row" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem',
            width: '100%'
          }}>
            <WeatherWidget />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <ThemeToggle />
              <PushNotificationManager />
              <StudentBadge />
              <Link href="/admin/login" style={{
                fontSize: '0.8rem',
                color: 'var(--foreground-muted)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid var(--surface-border)',
                borderRadius: '10px',
                background: 'var(--surface)',
                fontWeight: 600,
                backdropFilter: 'blur(8px)'
              }}>
                Admin
              </Link>
            </div>
          </div>
          
          <div className="header-content-row" style={{ textAlign: 'center' }}>
            <BrandLogo size={72} className="brand-logo-glow" />
            <p className={styles.subtitle} style={{ 
              textTransform: 'capitalize', 
              marginTop: '0.75rem',
              marginBottom: '0.6rem',
              fontSize: '1.1rem',
              color: 'var(--foreground-muted)',
              fontWeight: 500,
              letterSpacing: '0.05em'
            }}>
              {dateStr}
            </p>
            <h1 className={styles.title} style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Coffee &amp; Code
            </h1>
          </div>
        </header>

        <HomeClient
          classesToday={classesToday}
          db={db}
        />
      </div>
    </main>
  );
}
