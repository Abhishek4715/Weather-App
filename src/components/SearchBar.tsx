import { SearchBarProps } from "@/types/weather";

export function SearchBar( {city, setCity, suggestion, showSuggestion, setShowSuggestion, setCoords}: SearchBarProps ) {

    return (
        <>
            {/* Search Bar */}
            < div className="w-full mb-8 relative" >
                <input
                    type="search"
                    placeholder="Search Places"
                    value={city}
                    onChange={
                        (event) => {
                            setCity(event.target.value);
                            setCoords(null);
                            setShowSuggestion(true);
                        }
                    }
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            setShowSuggestion(false)
                        }
                    }}
                    onBlur={() => {
                        setTimeout(() => setShowSuggestion(false), 150);
                    }}
                    className="w-full px-6 py-3 bg-slate-900/50 border border-slate-500/50 rounded-full outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-800 transition-all text-white placeholder-slate-400 shadow-inner"
                />
            </div >

            {/* Search Suggestion */}
            {
                showSuggestion && Array.isArray(suggestion) && suggestion.length > 0 && (
                    <div className="w-full relative">
                        <ul className="absolute top-1 w-full bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-xl overflow-hidden z-10">
                            {suggestion.map((suggest) => (
                                <li
                                    key={`${suggest.lat} - ${suggest.lon}`}
                                    onClick={() => {
                                        setCoords({ lat: suggest.lat, lon: suggest.lon })
                                        setShowSuggestion(false)
                                        setCity(suggest.name)
                                    }}
                                    className="px-4 py-3 text-slate-200 hover:bg-slate-700/50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-slate-700/50 last:border-b-0"
                                >
                                    {suggest.name}
                                    {suggest.state ? `, ${suggest.state}` : ""}, {suggest.country}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </>)
}