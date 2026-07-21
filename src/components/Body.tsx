import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useGeoLocation } from "../hooks/useGeoLocation";

export function Body() {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    interface WeatherData {
        name?: string;
        weather?: [{
            main: string;
            icon: string;
        }]
        main?:
        {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            humidity: number;
            pressure: number;
        }
        ;
        wind?: {
            speed: number;
            deg: number;
        }
        sys?: {
            sunrise: number;
            sunset: number;
        }
    }
    const [data, setData] = useState<WeatherData>({});
    const [city, setCity] = useState<string>("London");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { coords, getLocation, setCoords } = useGeoLocation();
    const debounceCity = useDebounce(city, 500);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = coords ? `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric` : `https://api.openweathermap.org/data/2.5/weather?q=${debounceCity}&appid=${API_KEY}&units=metric`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch weather");
                }
                setData(await response.json());
            } catch (error) {
                setError(error instanceof Error ? error.message : "City not found");
            }
            finally {
                setLoading(false);
            }
        }

        if (debounceCity) {
            fetchData();
        }
    }, [debounceCity, coords, API_KEY]);

    return (
        <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4 font-sans text-white">

            {/* Main Weather Card */}
            <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-600/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-2">

                {/* My Location */}
                <div className="w-full mb-2 flex justify-center">
                    <button onClick={getLocation} className="border border-slate-600/50 rounded-2xl shadow-2xl px-4 py-2 hover:scale-101 transition-all">
                        Use my location
                    </button>
                </div>

                {/* Search Bar */}
                <div className="w-full mb-8 relative">
                    <input
                        type="search"
                        placeholder="Search Places"
                        value={city}
                        onChange={
                            (event) => {
                                setCity(event.target.value);
                                setCoords(null);
                            }}

                        className="w-full px-6 py-3 bg-slate-900/50 border border-slate-500/50 rounded-full outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-800 transition-all text-white placeholder-slate-400 shadow-inner"
                    />
                </div>

                {/* Loading state */}
                {loading && (
                    <p className="text-slate-400 text-lg mb-4">Loading weather...</p>
                )}

                {/* Error state */}
                {error && (
                    <p className="text-red-400 text-lg mb-4">{error}</p>
                )}

                {/* City Name */}
                {!loading && !error && (
                    <>
                        <h2 className="text-3xl font-semibold tracking-wide mb-1 text-center">
                            {data.name || "Loading..."}
                        </h2>

                        <div className="flex items-center gap-2">
                            {/* Weather Condition */}
                            <p className="text-blue-300 text-lg font-medium tracking-widest uppercase">
                                {data.weather?.[0]?.main || "--"}
                            </p>

                            <img
                                className="w-10 h-10 object-contain shrink-0"
                                src={`https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@2x.png`}
                                alt="Weather icon"
                            />
                        </div>

                        {/* Wind Speed */}
                        <h2 className="text-slate-400 text-m font-medium mb-1 uppercase tracking-wider">
                            Wind: {data.wind?.speed} m/s
                        </h2>

                        {/* Massive Temperature */}
                        <h1 className="text-8xl font-light drop-shadow-lg mb-10 ml-4">
                            {data.main?.temp ? Math.round(data.main.temp) : "--"}°
                        </h1>

                        {/* Bottom Details Grid */}
                        <div className="w-full grid grid-cols-4 gap-4 px-6 py-4 bg-slate-900/30 rounded-2xl border border-slate-600/30 shadow-sm">
                            <div className="flex flex-col items-center">
                                <span className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Feels Like</span>
                                <span className="text-xl font-semibold">
                                    {data.main?.feels_like ? Math.round(data.main.feels_like) : "--"}°C
                                </span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Min/Max</span>
                                <span className="text-xl font-semibold">
                                    {data.main?.temp_min ? Math.round(data.main.temp_min) : "--"}°/{data.main?.temp_max ? Math.round(data.main.temp_max) : "--"}°
                                </span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Humidity</span>
                                <span className="text-xl font-semibold">
                                    {data.main?.humidity || "--"}%
                                </span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Pressure</span>
                                <span className="text-xl font-semibold">
                                    {data.main?.pressure || "--"} hPa
                                </span>
                            </div>
                        </div>
                    </>
                )}


            </div>
        </div>
    )
}