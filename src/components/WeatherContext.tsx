'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    city: string;
}

interface WeatherContextValue {
    weather: WeatherData | null;
    loading: boolean;
}

const WeatherContext = createContext<WeatherContextValue>({ weather: null, loading: true });

export function WeatherProvider({ children }: { children: ReactNode }) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchWeather = async () => {
            try {
                const res = await fetch('/api/weather');
                if (res.ok) {
                    const data = await res.json();
                    if (!cancelled) setWeather(data);
                }
            } catch (error) {
                console.error('Weather fetch error:', error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchWeather();
        return () => { cancelled = true; };
    }, []);

    return (
        <WeatherContext.Provider value={{ weather, loading }}>
            {children}
        </WeatherContext.Provider>
    );
}

export function useWeather() {
    return useContext(WeatherContext);
}
