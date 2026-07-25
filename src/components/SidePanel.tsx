import { CitySuggestion } from "@/types/weather";
import { Trash, Pin, PinOff } from 'lucide-react';
import { SidePanelProps } from "@/types/weather";
export function SidePanel({ showPanel, setShowPanel, history, setHistory, pined, setPined, setCoords, weatherSearchCity }: SidePanelProps) {
    return (
        <>
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
                                            name: pin.name ?? weatherSearchCity,
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
                                        name: his.name ?? weatherSearchCity,
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
        </>
    )
}