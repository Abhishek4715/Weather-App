import { History } from "lucide-react";
import { MyLocationProps } from "@/types/weather"

export function MyLocation({unit, setUnit, setShowPanel, getLocation}: MyLocationProps) {
    return (
        <>
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
        </>
    )
}