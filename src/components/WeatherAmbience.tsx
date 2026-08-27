'use client';

import { useWeather } from './WeatherContext';

function ambienceFor(icon: string): string {
    const night = icon.endsWith('n');
    const code = icon.slice(0, 2);

    // A single, very soft weather wash over the paper. Opacities are kept
    // low so it reads as ambient tint, not decoration.
    const tint = {
        '01': night ? 'rgba(75, 90, 150, 0.16)' : 'rgba(240, 190, 110, 0.22)',
        '02': 'rgba(150, 165, 180, 0.14)',
        '03': 'rgba(160, 170, 180, 0.12)',
        '04': 'rgba(130, 140, 150, 0.14)',
        '09': 'rgba(80, 120, 160, 0.14)',
        '10': 'rgba(70, 110, 150, 0.14)',
        '11': 'rgba(110, 90, 150, 0.14)',
        '13': 'rgba(190, 210, 235, 0.2)',
        '50': 'rgba(160, 170, 175, 0.14)'
    }[code] ?? 'rgba(240, 180, 100, 0.12)';

    return `radial-gradient(42rem 26rem at 85% -4%, ${tint}, transparent 62%)`;
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
