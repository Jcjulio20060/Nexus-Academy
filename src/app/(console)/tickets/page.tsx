import TicketsClient from './TicketsClient';
import PageTitle from '@/components/ui/PageTitle';

export const revalidate = 0;

export default async function TicketsPage() {
    return (
        <div style={{ padding: '2rem 1.5rem 3rem', maxWidth: '760px', margin: '0 auto' }}>
            <PageTitle label="tickets">Meus tickets</PageTitle>
            <TicketsClient />
        </div>
    );
}
