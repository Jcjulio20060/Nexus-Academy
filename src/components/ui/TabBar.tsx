'use client';

import Icon, { IconName } from './Icon';

export interface TabItem {
    id: string;
    label: string;
    icon?: IconName;
}

interface TabBarProps {
    tabs: TabItem[];
    active: string;
    onChange: (id: string) => void;
}

export default function TabBar({ tabs, active, onChange }: TabBarProps) {
    return (
        <div
            style={{
                display: 'flex',
                gap: '0.25rem',
                padding: '0.25rem',
                background: 'var(--surface-card)',
                border: '1px solid var(--surface-border)',
                borderRadius: '12px',
                overflowX: 'auto',
                scrollbarWidth: 'none'
            }}
        >
            {tabs.map(tab => {
                const isActive = tab.id === active;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        style={{
                            flex: '1 0 auto',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            padding: '0.55rem 1rem',
                            borderRadius: 'var(--rounded-md, 10px)',
                            border: 'none',
                            background: isActive ? 'var(--primary-glow)' : 'transparent',
                            color: isActive ? 'var(--primary)' : 'var(--foreground-muted)',
                            fontWeight: 700,
                            fontSize: 'var(--text-base)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease',
                            boxShadow: isActive ? 'inset 0 0 0 1px color-mix(in srgb, var(--primary) 40%, transparent)' : 'none'
                        }}
                    >
                        {tab.icon && <Icon name={tab.icon} size={15} />}
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
