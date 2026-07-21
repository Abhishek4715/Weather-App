import { useState, useEffect } from "react";

export function Body() {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    console.log("API: " + API_KEY);

    interface WheatherData {
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
    const [data, setData] = useState<WheatherData>({});
    const [city, setCity] = useState<string>("London");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
                if (!response.ok) {
                    throw new Error("Failed to fetch weather");
                }
                setData(await response.json());
            } catch (error) {
                console.error(error);
            }
        }

        if (city) {
            fetchData();
        }
    }, [city, API_KEY])
    return (
        <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4 font-sans text-white">

            {/* Main Weather Card */}
            <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-600/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-2">

                {/* Search Bar */}
                <div className="w-full mb-8 relative">
                    <input
                        type="search"
                        placeholder="Search Places"
                        value={city}
                        onChange={(event) => { setCity(event.target.value) }}
                        className="w-full px-6 py-3 bg-slate-900/50 border border-slate-500/50 rounded-full outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-800 transition-all text-white placeholder-slate-400 shadow-inner"
                    />
                </div>

                {/* City Name */}
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

            </div>
        </div>
    )
}