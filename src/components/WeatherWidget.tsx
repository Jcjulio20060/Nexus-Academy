'use client';

import Image from 'next/image';
import { useWeather } from './WeatherContext';

export default function WeatherWidget() {
    const { weather, loading } = useWeather();

    if (loading) return (
        <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '150px', height: '40px' }}>
            <div className="shimmer" style={{ width: '100%', height: '20px', borderRadius: '4px' }}></div>
        </div>
    );

    if (!weather) return null;

    return (
        <div className="glass-panel" style={{ 
            padding: '0.4rem 1rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            background: 'var(--surface-hover)',
            borderRadius: '12px'
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
                <p style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1 }}>{weather.temp}°C</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--foreground-muted)', textTransform: 'capitalize' }}>{weather.condition}</p>
            </div>
        </div>
    );
}
