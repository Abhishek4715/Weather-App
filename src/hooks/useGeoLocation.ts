import { useState } from "react";

export function useGeoLocation() {
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError("GeoLocation not found");
        }

        navigator.geolocation.getCurrentPosition((position) => {
            setCoords({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            })
        },
            () => setError("Permission denied or location unavailable")
        )
    }

    return { coords, error, getLocation, setCoords }
}