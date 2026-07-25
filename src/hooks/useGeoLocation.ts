import { useState } from "react";

export function useGeoLocation() {
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setGeoError("GeoLocation not found");
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            setGeoError(null);
            setCoords({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            })
        },
            () => setGeoError("Permission denied or location unavailable")
        )
    }

    return { coords, geoError, getLocation, setCoords }
}