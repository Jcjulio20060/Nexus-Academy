'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    city: string;
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch('/api/weather');
                if (res.ok) {
                    const data = await res.json();
                    setWeather(data);
                }
            } catch (error) {
                console.error('Weather fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

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
            <img 
                src={`https://openweathermap.org/img/wn/${weather.icon}.png`} 
                alt={weather.condition} 
                style={{ width: '32px', height: '32px' }}
            />
            <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1 }}>{weather.temp}°C</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--foreground-muted)', textTransform: 'capitalize' }}>{weather.condition}</p>
            </div>
        </div>
    );
}
