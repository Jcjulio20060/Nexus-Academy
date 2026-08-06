'use client';

import { useState } from 'react';
import { Faq } from '@/lib/data';
import Icon from '@/components/ui/Icon';

export default function FaqClient({ faqs }: { faqs: Faq[] }) {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                    <div
                        key={faq.id}
                        className="glass-panel"
                        style={{
                            padding: 0,
                            overflow: 'hidden',
                            border: isOpen ? '1px solid color-mix(in srgb, var(--primary) 40%, transparent)' : '1px solid var(--surface-border)'
                        }}
                    >
                        <button
                            onClick={() => setOpen(isOpen ? null : i)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.85rem',
                                padding: '1.1rem 1.5rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--foreground)',
                                textAlign: 'left',
                                fontFamily: 'var(--font-sans)'
                            }}
                        >
                            <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', minWidth: '1.6rem' }}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span style={{ flex: 1, fontWeight: 600, fontSize: '0.95rem' }}>{faq.question}</span>
                            <span style={{ color: 'var(--foreground-muted)', display: 'inline-flex' }}>
                                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={17} />
                            </span>
                        </button>
                        {isOpen && (
                            <div style={{ padding: '0 1.5rem 1.25rem 3.85rem', color: 'var(--foreground-muted)', fontSize: '0.9rem', lineHeight: '1.65' }}>
                                {faq.answer}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
