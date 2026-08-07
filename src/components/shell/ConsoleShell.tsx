'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '../BrandLogo';
import Clock from './Clock';
import CommandPalette from './CommandPalette';
import { WeatherProvider } from '../WeatherContext';
import WeatherAmbience from '../WeatherAmbience';
import WeatherWidget from '../WeatherWidget';
import ThemeToggle from '../ThemeToggle';
import StudentBadge from '../StudentBadge';
import PushNotificationManager from '../PushNotificationManager';
import Icon, { IconName } from '../ui/Icon';

const RAIL_NAV: { href: string; label: string; icon: IconName }[] = [
    { href: '/', label: 'Início', icon: 'home' },
    { href: '/grade', label: 'Grade', icon: 'calendar' },
    { href: '/tickets', label: 'Tickets', icon: 'ticket' },
    { href: '/justificativas', label: 'Faltas', icon: 'clipboard' },
    { href: '/materiais', label: 'Materiais', icon: 'book' },
    { href: '/prazos', label: 'Prazos', icon: 'flag' },
    { href: '/faq', label: 'FAQ', icon: 'help' }
];

const TAB_NAV: { href: string; label: string; icon: IconName }[] = [
    { href: '/', label: 'Início', icon: 'home' },
    { href: '/grade', label: 'Grade', icon: 'calendar' },
    { href: '/tickets', label: 'Tickets', icon: 'ticket' },
    { href: '/justificativas', label: 'Faltas', icon: 'clipboard' },
    { href: '/materiais', label: 'Materiais', icon: 'book' }
];

const ADMIN_LINK = { href: '/admin/login', label: 'Admin', icon: 'building' as IconName };

export default function ConsoleShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

    const renderLink = ({ href, label, icon }: { href: string; label: string; icon: IconName }, style?: React.CSSProperties) => (
        <Link
            key={href}
            href={href}
            title={label}
            style={style}
            className={`console-rail-link ${isActive(href) ? 'console-rail-link-active' : ''}`}
        >
            <Icon name={icon} size={19} />
        </Link>
    );

    return (
        <WeatherProvider>
            <div className="console-shell">
                <WeatherAmbience />
                <div className="console-grid" />

            <header className="console-statusbar">
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: 'var(--foreground)' }}>
                    <BrandLogo size={30} />
                    <span className="console-brand-name" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                        Coffee &amp; Code
                    </span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock />
                    <span className="hide-sm"><WeatherWidget /></span>
                    <PushNotificationManager />
                    <CommandPalette />
                    <ThemeToggle />
                    <span className="hide-sm"><StudentBadge /></span>
                </div>
            </header>

            <nav className="console-rail">
                {RAIL_NAV.map(item => renderLink(item))}
                <div style={{ flex: 1 }} />
                {renderLink(ADMIN_LINK)}
            </nav>

            <main className="console-main">{children}</main>

            <nav className="console-tabbar">
                {TAB_NAV.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`console-tab-link ${isActive(item.href) ? 'console-tab-link-active' : ''}`}
                    >
                        <Icon name={item.icon} size={20} />
                        {item.label}
                    </Link>
                ))}
            </nav>
            </div>
        </WeatherProvider>
    );
}
