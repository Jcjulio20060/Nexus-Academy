'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '../BrandLogo';
import Clock from './Clock';
import CommandPalette from './CommandPalette';
import WeatherWidget from '../WeatherWidget';
import ThemeToggle from '../ThemeToggle';
import StudentBadge from '../StudentBadge';
import PushNotificationManager from '../PushNotificationManager';
import Icon, { IconName } from '../ui/Icon';

const NAV: { href: string; label: string; icon: IconName }[] = [
    { href: '/', label: 'Início', icon: 'home' },
    { href: '/tickets', label: 'Tickets', icon: 'ticket' },
    { href: '/justificativas', label: 'Faltas', icon: 'clipboard' }
];

export default function ConsoleShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

    const navItems = NAV.map(item => (
        <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`console-rail-link ${isActive(item.href) ? 'console-rail-link-active' : ''}`}
        >
            <Icon name={item.icon} size={19} />
        </Link>
    ));

    const tabItems = NAV.map(item => (
        <Link
            key={item.href}
            href={item.href}
            className={`console-tab-link ${isActive(item.href) ? 'console-tab-link-active' : ''}`}
        >
            <Icon name={item.icon} size={20} />
            {item.label}
        </Link>
    ));

    return (
        <div className="console-shell">
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

            <nav className="console-rail">{navItems}</nav>

            <main className="console-main">{children}</main>

            <nav className="console-tabbar">{tabItems}</nav>
        </div>
    );
}
