import Link from 'next/link';
import { getDatabase } from '@/lib/data';
import JustificativasClient from './JustificativasClient';
import WeatherWidget from '@/components/WeatherWidget';
import ThemeToggle from '@/components/ThemeToggle';
import styles from '../page.module.css';

export const revalidate = 0;

export default async function JustificativasPage() {
    const db = await getDatabase();

    return (
        <main className={styles.main}>
            <div className="container">
                <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            ← Voltar ao Console
                        </Link>
                        <h1 className={styles.title}>Justificativa de Falta</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <ThemeToggle />
                        <WeatherWidget />
                    </div>
                </header>

                <JustificativasClient subjects={db.subjects} />
            </div>
        </main>
    );
}
