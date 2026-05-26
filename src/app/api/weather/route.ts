import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.API_KEY_WHEATER;
    // We could use a default city or try to get it from request/env
    // For now, let's assume a default city or allow passing it
    const city = "Recife"; 

    if (!apiKey) {
        return NextResponse.json({ error: 'API key not found' }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`,
            { next: { revalidate: 1800 } } // Cache for 30 minutes
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather');
        }

        const data = await response.json();
        return NextResponse.json({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].description,
            icon: data.weather[0].icon,
            city: data.name
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
    }
}
