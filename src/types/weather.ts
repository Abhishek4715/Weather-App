import { Dispatch, SetStateAction } from "react";

export interface WeatherData {
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

export interface ForecastEntry {
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

export interface ForecastData {
    list: ForecastEntry[];
    city: {
        name: string;
        country: string;
        sunrise: number;
        sunset: number;
    };
}

export interface CitySuggestion {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

export interface Coords {
    lat: number;
    lon: number;
}

export interface SearchBarProps {
    city: string;
    setCity: (city: string) => void;
    suggestion: CitySuggestion[];
    showSuggestion: boolean;
    setShowSuggestion: (show: boolean) => void;
    setCoords: (coords: { lat: number; lon: number } | null) => void;
}

export interface SidePanelProps {
    showPanel: boolean;
    setShowPanel: Dispatch<SetStateAction<boolean>>;
    history: CitySuggestion[];
    setHistory: Dispatch<SetStateAction<CitySuggestion[]>>;
    pined: CitySuggestion[];
    setPined: Dispatch<SetStateAction<CitySuggestion[]>>;
    setCoords: Dispatch<SetStateAction<{ lat: number; lon: number } | null>>;
    weatherSearchCity: string;
}

export interface WeatherCardProps {
    data: WeatherData;
    loading: boolean;
    error: string | null; 
    unit: "metric" | "imperial";
}

export interface MyLocationProps {
    unit: "metric" | "imperial";
    setUnit: Dispatch<SetStateAction<"metric" | "imperial">>;
    setShowPanel: Dispatch<SetStateAction<boolean>>;
    getLocation: () => void;
}

export type Unit = "metric" | "imperial";
