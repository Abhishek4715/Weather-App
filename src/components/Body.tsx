import { useState, useEffect } from "react";
import { History, Trash, Pin, PinOff } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { ForecastChart } from "./ForeCastChart"

export function Body() {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    interface WeatherData {
        name?: string;
        weather?: {
            main: string;
            icon: string;
            description: string;
        }[];
        main?:
        {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            humidity: number;
            pressure: number;
        };
        wind?: {
            speed: number;
            deg: number;
        }
        sys?: {
            sunrise: number;
            sunset: number;
            country?: string;
        };
        coord?: { lat: number; lon: number };
    }

    interface ForecastEntry {
        dt: number;
        dt_txt: string;
        main: {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            humidity: number;
            pressure: number;
        };
        weather: {
            main: string;
            icon: string;
            description: string;
        }[];
        wind: {
            speed: number;
            deg: number;
        };
        pop: number;
    }

    interface ForecastData {
        list: ForecastEntry[];
        city: {
            name: string;
            country: string;
            sunrise: number;
            sunset: number;
        };
    }

    interface CitySuggestion {
        name: string;
        country: string;
        state?: string;
        lat: number;
        lon: number;
    }

    const [data, setData] = useState<WeatherData>({});
    const [city, setCity] = useState<string>(() => {
        return localStorage.getItem("lastCity") ?? "London"
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");
    const [forecast, setForecast] = useState<ForecastData | null>(null)
    const [showPanel, setShowPanel] = useState<boolean>(false);
    const { coords, getLocation, setCoords } = useGeoLocation();
    const debounceCity = useDebounce(city, 500);
    const [suggestion, setSuggestion] = useState<CitySuggestion[]>([]);
    const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
    const [history, setHistory] = useState<Array<CitySuggestion>>(() => {
        const his = localStorage.getItem("history");
        if (his) {
            try {
                const parsed = JSON.parse(his);
                return Array.isArray(parsed) ? parsed : [];
            }
            catch (error) {
                console.error("Error parsing history", error);
                return [];
            }
        }
        return [];
    });
    const [pined, setPined] = useState<Array<CitySuggestion>>(() => {
        const his = localStorage.getItem("pined");
        if (his) {
            try {
                const parsed = JSON.parse(his);
                return Array.isArray(parsed) ? parsed : [];
            }
            catch (error) {
                console.error("Error parsing pined", error);
                return [];
            }
        }
        return [];
    });

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
        const fetchDataFun = async () => {
            setLoading(true);
            setError(null);

            try {
                const url = coords ? `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=${unit}` : `https://api.openweathermap.org/data/2.5/weather?q=${debounceCity}&appid=${API_KEY}&units=${unit}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Failed to fetch weather");
                }
                const fetchData = await response.json();
                setData(fetchData);

                const newHistoryItem: CitySuggestion = {
                    name: fetchData.name ?? debounceCity,
                    country: fetchData.country ?? "",
                    state: "",
                    lat: fetchData.coord?.lat ?? 0,
                    lon: fetchData.coord?.lon ?? 0,
                };

                setHistory((prev) => {
                    const safePrev = Array.isArray(prev) ? prev : [];
                    const alreadyExists = safePrev.some(
                        (item) => item.name === newHistoryItem.name && item.country === newHistoryItem.country
                    );

                    return alreadyExists ? safePrev : [newHistoryItem, ...safePrev];
                });
            } catch (error) {
                setError(error instanceof Error ? error.message : "City not found");
            }
            finally {
                setLoading(false);
            }
        }

        if (debounceCity) {
            fetchDataFun();
        }
    }, [debounceCity, coords, unit, API_KEY]);


    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const url = coords
                    ? `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=${unit}`
                    : `https://api.openweathermap.org/data/2.5/forecast?q=${debounceCity}&appid=${API_KEY}&units=${unit}`

                const res = await fetch(url)
                if (!res.ok) throw new Error("Failed to fetch forecast")
                setForecast(await res.json())
            } catch (err) {
                console.error(err)
            }
        }

        if (coords || debounceCity) fetchForecast()
    }, [debounceCity, coords, unit, API_KEY])



    useEffect(() => {
        const fetchSuggestion = async () => {
            if (city.length < 2) {
                setSuggestion([])
                setShowSuggestion(false);
                return;
            }
            try {
                const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`);
                setSuggestion(await response.json());
            } catch (error) {
                console.error(error);
            }
        }
        fetchSuggestion();
    }, [city, API_KEY])


    return (
        <div className={`min-h-screen bg-linear-to-b ${getBackgroundGradient(data.weather?.[0]?.main)} flex justify-center items-center p-4 font-sans text-white transition-all duration-700`}>

            {/* Main Weather Card */}
            <div className="relative overflow-hidden w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-600/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-2">

                {/* Side Panel */}
                {showPanel && (
                    <div onClick={() => setShowPanel(false)} className="absolute inset-0 bg-black/50 z-20 rounded-3xl" />
                )}

                <div className={`absolute top-0 left-0 h-full w-2/3 bg-slate-800/95 backdrop-blur-xl border-r border-slate-600/50 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${showPanel ? "translate-x-0" : "-translate-x-full"
                    }`}>
                    <div className="p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white mb-4">History</h2>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("history");
                                    setHistory([]);
                                }}>
                                <Trash />
                            </button>
                        </div>
                        <ul>
                            {pined && (
                                pined.map((pin, index) => (
                                    <li key={pin.name + pin.country + index} className="px-4 py-3 text-slate-200 hover:bg-slate-700/50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-slate-700/50 last:border-b-0 flex justify-between"
                                        onClick={() => {
                                            setCoords({ lat: pin.lat, lon: pin.lon })
                                            setShowPanel(false);
                                        }}>
                                        {pin.name},
                                        {pin.state ? ` ${pin.state},` : ""} {pin.country}
                                        <button onClick={(event) => {
                                            event.stopPropagation();
                                            const newHistoryItem: CitySuggestion = {
                                                name: pin.name ?? debounceCity,
                                                country: pin.country ?? "",
                                                state: "",
                                                lat: pin.lat ?? 0,
                                                lon: pin.lon ?? 0,
                                            };
                                            setHistory((prev) => {
                                                return [...prev, newHistoryItem];
                                            })
                                            setPined((prev) =>
                                                prev.filter((eachPin) => eachPin.name !== pin.name || eachPin.country !== pin.country)
                                            )
                                        }}>
                                            <PinOff />
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>


                        <ul>{history && (
                            history.map((his, index) => (
                                <li key={his.name + his.country + index} className="px-4 py-3 text-slate-200 hover:bg-slate-700/50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-slate-700/50 last:border-b-0 flex justify-between"
                                    onClick={() => {
                                        setCoords({ lat: his.lat, lon: his.lon })
                                        setShowPanel(false);
                                    }}>
                                    {his.name},
                                    {his.state ? ` ${his.state},` : ""} {his.country}
                                    <button onClick={(event) => {
                                        event.stopPropagation();
                                        const newPinedItem: CitySuggestion = {
                                            name: his.name ?? debounceCity,
                                            country: his.country ?? "",
                                            state: "",
                                            lat: his.lat ?? 0,
                                            lon: his.lon ?? 0,
                                        };
                                        setPined((prev) => {
                                            return [newPinedItem, ...prev];
                                        })
                                        setHistory((prev) =>
                                            prev.filter((his) => his.name !== newPinedItem.name || his.country !== newPinedItem.country)
                                        )
                                    }}>
                                        <Pin />
                                    </button>
                                </li>
                            ))
                        )}</ul>
                    </div>
                </div>
                {/* My Location */}
                <div className="w-full mb-2 flex justify-center relative">
                    <button className="border border-slate-600/50 rounded-2xl shadow-2xl py-2 px-3 absolute top-0 left-1 hover:scale-103 transition-all"
                        onClick={() => setShowPanel(true)}>
                        <History size={20} />
                    </button>


                    <button onClick={getLocation} className="border border-slate-600/50 rounded-2xl shadow-2xl px-4 py-2 hover:scale-101 transition-all">
                        Use my location
                    </button>

                    <button className="border border-slate-600/50 rounded-2xl shadow-2xl p-2 absolute top-0 right-1 hover:scale-103 transition-all" onClick={
                        () => {
                            setUnit((e) => e === "metric" ? "imperial" : "metric")
                        }
                    }>
                        {unit === "metric" ? "°C" : "°F"}
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
                                setShowSuggestion(true);
                            }
                        }
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                setShowSuggestion(false)
                            }
                        }}
                        onBlur={() => {
                            setTimeout(() => setShowSuggestion(false), 150);
                        }}
                        className="w-full px-6 py-3 bg-slate-900/50 border border-slate-500/50 rounded-full outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-800 transition-all text-white placeholder-slate-400 shadow-inner"
                    />
                </div>

                {/* Search Suggestion */}
                {showSuggestion && (
                    <div className="w-full relative">
                        <ul className="absolute top-1 w-full bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-xl overflow-hidden z-10">
                            {suggestion.map((suggest) => (
                                <li
                                    key={`${suggest.lat} - ${suggest.lon}`}
                                    onClick={() => {
                                        setCoords({ lat: suggest.lat, lon: suggest.lon })
                                        setShowSuggestion(false)
                                        setCity(suggest.name)
                                    }}
                                    className="px-4 py-3 text-slate-200 hover:bg-slate-700/50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-slate-700/50 last:border-b-0"
                                >
                                    {suggest.name}
                                    {suggest.state ? `, ${suggest.state}` : ""}, {suggest.country}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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
                            {data.main?.temp ? Math.round(data.main.temp) : "--"}{unit === "metric" ? "°" : "°F"}
                        </h1>

                        {/* Bottom Details Grid */}
                        <div className="w-full grid grid-cols-4 gap-4 px-6 py-4 bg-slate-900/30 rounded-2xl border border-slate-600/30 shadow-sm">
                            <div className="flex flex-col items-center">
                                <span className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Feels Like</span>
                                <span className="text-xl font-semibold">
                                    {data.main?.feels_like ? Math.round(data.main.feels_like) : "--"}{unit === "metric" ? "°" : "°F"}
                                </span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Min/Max</span>
                                <span className="text-xl font-semibold">
                                    {data.main?.temp_min ? Math.round(data.main.temp_min) : "--"}{unit === "metric" ? "°" : "°F"}/{data.main?.temp_max ? Math.round(data.main.temp_max) : "--"}{unit === "metric" ? "°" : "°F"}
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

                        {/* Forecast */}
                        {forecast && <ForecastChart list={forecast.list} />}
                    </>
                )}
            </div>

        </div>
    )
}