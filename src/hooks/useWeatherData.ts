import { useState, useEffect } from "react";
import { WeatherData, ForecastData, CitySuggestion, Coords, Unit } from "../types/weather";

export function useWeatherData(weatherSearchCity: string, coords: Coords | null, unit: Unit, API_KEY: string, addToHistory: (item: CitySuggestion) => void) {
    const [data, setData] = useState<WeatherData>({});
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const fetchDataFun = async () => {
            setLoading(true);
            setError(null);

            try {
                const weatherUrl = coords ? `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=${unit}`
                    : `https://api.openweathermap.org/data/2.5/weather?q=${weatherSearchCity}&appid=${API_KEY}&units=${unit}`;
                const forecastUrl = coords
                    ? `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=${unit}`
                    : `https://api.openweathermap.org/data/2.5/forecast?q=${weatherSearchCity}&appid=${API_KEY}&units=${unit}`
                const [weatherRes, forecastRes] = await Promise.all([
                    fetch(weatherUrl, { cache: "no-store" }),
                    fetch(forecastUrl, { cache: "no-store" })
                ])

                if (!weatherRes.ok || !forecastRes.ok) {
                    throw new Error("Failed to fetch weather");
                }

                const weatherJson = await weatherRes.json();
                const forecastJson = await forecastRes.json();
                setData(weatherJson);
                setForecast(forecastJson);

                const newHistoryItem: CitySuggestion = {
                    name: weatherJson.name ?? weatherSearchCity,
                    country: weatherJson.sys?.country ?? "",
                    state: "",
                    lat: weatherJson.coord?.lat ?? 0,
                    lon: weatherJson.coord?.lon ?? 0,
                };

                addToHistory(newHistoryItem);
            } catch (error) {
                setError(error instanceof Error ? error.message : "City not found");
            }
            finally {
                setLoading(false);
            }
        }

        if (weatherSearchCity || coords) fetchDataFun()
    }, [weatherSearchCity, coords, unit, API_KEY, addToHistory]);
    return { data, forecast, loading, error };
}