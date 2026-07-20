import { useState, useEffect } from "react";

export function Body() {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    console.log("API: " + API_KEY);

    interface WheatherData {
        name?: string;
        weather?: [{main: string;}]
        main?: 
            {
                temp: number;
                feels_like: number;
                humidity: number;
            }
        ;
        wind?: object;
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
        <div className="flex flex-col justify-center items-center gap-2">
            <input type="search" placeholder="Search Places" value={city}
                onChange={(event) => { setCity(event.target.value) }}
                className="absolute top-0 right-0 w-1/5 px-4 py-2 border-2 border-gray-400 outline-none focus:shadow-md"
            />
            <label className="ml-4 mt-24 text-4xl my-4">
               {data.main?.temp ? Math.round(data.main.temp) : "--"}°
            </label>
            <label className="mt-8 text-2xl">
                {data.name}
            </label>
            <label>
                {data.weather?.[0]?.main}
            </label>
            <label>
                Feels like: {data.main?.feels_like}°C
            </label>
            <label>
                Humidity: {data.main?.humidity}%
            </label>
            
        </div>
    )
}