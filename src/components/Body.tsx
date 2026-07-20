import { useState, useEffect } from "react";

export function Body() {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    console.log("API: " + API_KEY);
    const [data, setData] = useState<object>({});
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
                className="absolute top-0 right-0 w-7/20 px-4 py-2 border-2 border-gray-400 outline-none focus:shadow-md"
            />
        </div>

    )
}