'use client';

import Image from 'next/image';
import { useWeather } from './WeatherContext';

export default function WeatherWidget() {
    const { weather, loading } = useWeather();

    if (loading) return (
        <div className="glass-panel" style={{ padding: 'var(--space-2) var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: '150px', height: '40px' }}>
            <div className="shimmer" style={{ width: '100%', height: '20px', borderRadius: 'var(--rounded-sm, 8px)' }}></div>
        </div>
    );

    if (!weather) return null;

    return (
        <div className="glass-panel" style={{ 
            padding: 'var(--space-1) var(--space-4)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-3)',
            background: 'var(--surface-hover)',
            borderRadius: 'var(--rounded-lg, 12px)'
        }}>
            <Image 
                src={`https://openweathermap.org/img/wn/${weather.icon}.png`} 
                alt={weather.condition} 
                width={32}
                height={32}
                unoptimized
                style={{ width: '32px', height: '32px' }}
            />
            <div>
                <p style={{ fontSize: 'var(--text-md)', fontWeight: 700, lineHeight: 1 }}>{weather.temp}°C</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', textTransform: 'capitalize' }}>{weather.condition}</p>
            </div>
        </div>
    );
}
