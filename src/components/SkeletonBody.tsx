export function getBackgroundGradient(condition?: string): string {
        switch (condition) {
            case "Clear":
                return "from-blue-500 via-sky-400 to-orange-300"
            case "Clouds":
                return "from-slate-700 via-slate-600 to-slate-500"
            case "Rain":
            case "Drizzle":
                return "from-slate-800 via-slate-700 to-blue-900"
            case "Thunderstorm":
                return "from-slate-900 via-purple-900 to-slate-800"
            case "Snow":
                return "from-slate-300 via-blue-100 to-white"
            case "Mist":
            case "Fog":
            case "Haze":
                return "from-slate-600 via-slate-500 to-slate-400"
            default:
                return "from-slate-900 via-slate-800 to-slate-900" // your current default
        }
    }