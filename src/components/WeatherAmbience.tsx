'use client';

import { useWeather } from './WeatherContext';

function ambienceFor(icon: string): string {
    const night = icon.endsWith('n');
    const code = icon.slice(0, 2);

    switch (code) {
        case '01':
            return night
                ? 'radial-gradient(ellipse at 25% 0%, rgba(63, 76, 172, 0.25), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(30, 58, 138, 0.18), transparent 55%)'
                : 'radial-gradient(ellipse at 25% 0%, rgba(242, 166, 59, 0.20), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(45, 212, 191, 0.14), transparent 55%)';
        case '02':
        case '03':
        case '04':
            return night
                ? 'radial-gradient(ellipse at 25% 0%, rgba(71, 85, 105, 0.22), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(51, 65, 85, 0.18), transparent 55%)'
                : 'radial-gradient(ellipse at 25% 0%, rgba(148, 163, 184, 0.14), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(100, 116, 139, 0.10), transparent 55%)';
        case '09':
        case '10':
            return night
                ? 'radial-gradient(ellipse at 25% 0%, rgba(15, 118, 110, 0.24), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(12, 74, 110, 0.22), transparent 55%)'
                : 'radial-gradient(ellipse at 25% 0%, rgba(13, 148, 136, 0.16), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(37, 99, 235, 0.12), transparent 55%)';
        case '11':
            return night
                ? 'radial-gradient(ellipse at 25% 0%, rgba(91, 33, 182, 0.26), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(30, 58, 138, 0.22), transparent 55%)'
                : 'radial-gradient(ellipse at 25% 0%, rgba(139, 92, 246, 0.18), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(59, 130, 246, 0.14), transparent 55%)';
        case '13':
            return night
                ? 'radial-gradient(ellipse at 25% 0%, rgba(100, 116, 139, 0.20), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(71, 85, 105, 0.16), transparent 55%)'
                : 'radial-gradient(ellipse at 25% 0%, rgba(165, 213, 255, 0.16), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(203, 213, 225, 0.12), transparent 55%)';
        case '50':
            return night
                ? 'radial-gradient(ellipse at 25% 0%, rgba(100, 116, 139, 0.20), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(51, 65, 85, 0.16), transparent 55%)'
                : 'radial-gradient(ellipse at 25% 0%, rgba(148, 163, 184, 0.14), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(120, 113, 108, 0.10), transparent 55%)';
        default:
            return 'radial-gradient(ellipse at 25% 0%, var(--primary-glow), transparent 55%), radial-gradient(ellipse at 80% 100%, var(--secondary-glow), transparent 55%)';
    }
}

export default function WeatherAmbience() {
    const { weather } = useWeather();
    const background = weather ? ambienceFor(weather.icon) : undefined;

    return (
        <div
            aria-hidden
            className="console-weather-ambience"
            style={{ background, opacity: background ? 1 : 0 }}
        />
    );
}
