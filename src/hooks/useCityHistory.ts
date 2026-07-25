import { useState, useCallback } from "react";
import { CitySuggestion } from "@/types/weather";

export function useCityHistory() {
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

    const addToHistory = useCallback((item: CitySuggestion) => {
        setHistory((prev) => {
            const safePrev = Array.isArray(prev) ? prev : []
            const alreadyExists = safePrev.some(
                (h) => h.name === item.name && h.country === item.country
            )
            return alreadyExists ? safePrev : [item, ...safePrev]
        })
    },[]);

    

    return { history, setHistory, pined, setPined, addToHistory }
}