import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
    const [debounded, setDebounded] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounded(value), delay)
        return () => clearTimeout(timer);
    },[value, delay])

    return debounded;
}