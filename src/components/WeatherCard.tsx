import { WeatherCardProps } from "@/types/weather";

export function WeatherCard({ data, loading, error, unit }: WeatherCardProps) {

    return (
        <>
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
                        {data.main?.temp !== undefined ? Math.round(data.main.temp) : "--"}{unit === "metric" ? "°" : "°F"}
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
                </>
            )}
        </>
    )
}