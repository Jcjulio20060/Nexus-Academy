import { getDatabase } from '@/lib/data';
import JustificativasClient from './JustificativasClient';
import PageTitle from '@/components/ui/PageTitle';

export const revalidate = 0;

export default async function JustificativasPage() {
    const db = await getDatabase();

    return (
        <div style={{ padding: '2rem 1.5rem 3rem', maxWidth: '760px', margin: '0 auto' }}>
            <PageTitle label="faltas">Justificativa de falta</PageTitle>
            <JustificativasClient subjects={db.subjects} />
        </div>
    );
}
