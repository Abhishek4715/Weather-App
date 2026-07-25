import { useState, useEffect } from "react";
import { CloudOff } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { ForecastChart } from "./ForecastChart";
import { WeatherSkeleton } from "./WeatherSkeleton";
import { useWeatherData } from "../hooks/useWeatherData";
import { CitySuggestion } from "../types/weather";
import { useCityHistory } from "../hooks/useCityHistory";
import { SearchBar } from "./SearchBar";
import { SidePanel } from "./SidePanel";
import { WeatherCard } from "./WeatherCard";
import { MyLocation } from "./MyLocation";



export function Body() {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const [city, setCity] = useState<string>(() => {
        return localStorage.getItem("lastCity") ?? "London"
    });
    const weatherSearchCity = useDebounce(city, 500);
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");
    const [showPanel, setShowPanel] = useState<boolean>(false);
    const { coords, getLocation, setCoords, geoError } = useGeoLocation();
    const suggestionSearchCity = useDebounce(city, 300);
    const [suggestion, setSuggestion] = useState<CitySuggestion[]>([]);
    const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
    const { history, setHistory, pined, setPined, addToHistory } = useCityHistory()
    const { data, forecast, loading, error } = useWeatherData(weatherSearchCity, coords, unit, API_KEY, addToHistory)

    
    function getBackgroundGradient(condition?: string): string {
        switch (condition) {
            case "Clear":
                return "from-blue-500 via-sky-400 to-orange-300"
            case "Clouds":
                return "from-slate-700 via-slate-600 to-slate-500"
            case "Rain":
            case "Drizzle":
                return "from-slate-800 via-slate-700 to-blue-900"
            case "Thunderstorm":
                return "from-slate-900 via-purple-900 to-slate-800"
            case "Snow":
                return "from-slate-300 via-blue-100 to-white"
            case "Mist":
            case "Fog":
            case "Haze":
                return "from-slate-600 via-slate-500 to-slate-400"
            default:
                return "from-slate-900 via-slate-800 to-slate-900" // your current default
        }
    }



    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem("pined", JSON.stringify(pined));
    }, [pined]);

    useEffect(() => {
        localStorage.setItem("lastCity", city);
    }, [city])


    useEffect(() => {
        const fetchSuggestion = async () => {
            if (city.length < 2) {
                setSuggestion([])
                setShowSuggestion(false);
                return;
            }
            try {
                const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${suggestionSearchCity}&limit=5&appid=${API_KEY}`);
                setSuggestion(await response.json());
            } catch (error) {
                console.error(error);
            }
        }
        fetchSuggestion();
    }, [suggestionSearchCity, API_KEY, city])


    return (
        <div className={`min-h-screen bg-linear-to-b ${getBackgroundGradient(data.weather?.[0]?.main)} flex justify-center items-center p-4 font-sans text-white transition-all duration-700`}>

            {/* Main Weather Card */}
            <div className="relative overflow-hidden w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-600/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-2">

                {/* Side Panel */}
                <SidePanel showPanel={showPanel} setShowPanel={setShowPanel} history={history} setHistory={setHistory} pined={pined} setPined={setPined} setCoords={setCoords} weatherSearchCity={weatherSearchCity} />
                
                {/* My Location */}
                <MyLocation unit={unit} setUnit={setUnit} setShowPanel={setShowPanel} getLocation={getLocation} />
                
                {/* Location error */}
                {geoError && (
                    <p className="text-red-400 text-sm mb-2 text-center">{geoError}</p>
                )}

                {/* Search Bar */}
                <SearchBar city={city} setCity={setCity} suggestion={suggestion} showSuggestion={showSuggestion} setShowSuggestion={setShowSuggestion} setCoords={setCoords} />

                {/* Loading state */}
                {loading && (<WeatherSkeleton />)}

                {/* Error state */}
                {error && (
                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                        <CloudOff size={48} className="text-slate-500" />
                        <p className="text-slate-300 text-lg font-medium">{error}</p>
                        <p className="text-slate-500 text-sm">Try searching for a different city</p>
                    </div>
                )}

                {/* WeatherCard */}
                <WeatherCard data={data} loading={loading} error={error} unit={unit} />

                {/* Forecast */}
                {forecast && <ForecastChart list={forecast.list} />}
            </div>

        </div>
    )
}