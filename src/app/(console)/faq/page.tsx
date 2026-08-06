import { getDatabase } from '@/lib/data';
import PageTitle from '@/components/ui/PageTitle';
import FaqClient from './FaqClient';

export const revalidate = 0;

export default async function FaqPage() {
    const db = await getDatabase();

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <PageTitle label="faq">Perguntas frequentes</PageTitle>
            <FaqClient faqs={db.faqs} />
        </div>
    );
}
