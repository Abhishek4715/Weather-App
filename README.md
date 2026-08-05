# Weather App

A weather app built with React, TypeScript, and Tailwind CSS. Search any city, use your current location, view a 24-hour forecast chart, and keep track of recently searched or pinned cities — all persisted locally so it remembers where you left off.

## Features

- 🔍 **City search** with debounced input and live autocomplete suggestions
- 📍 **Geolocation support** — one click to get weather for your current location
- 🌡️ **Current conditions** — temperature, feels-like, min/max, humidity, pressure, wind speed
- 📈 **24-hour forecast chart** with horizontal scroll
- 🕘 **Search history** — recently searched cities, saved automatically
- 📌 **Pinned cities** — save favorites for quick access
- 🌗 **Dynamic background** — gradient shifts based on current weather condition
- 🌡️ **Unit toggle** — switch between °C and °F
- 💾 **Persisted state** — last city, history, and pins are saved to local storage
- ⚡ Loading and error states throughout

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — styling
- **Recharts** — forecast chart
- **lucide-react** — icons
- **OpenWeatherMap API** — weather data, forecast, and geocoding

## Getting Started

### Prerequisites

- Node.js (v18+)
- An [OpenWeatherMap API key](https://home.openweathermap.org/users/sign_up) (free tier)

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/Abhishek4715/Weather-App.git
   cd Weather-App
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Add your API key

   Create a `.env.local` file in the project root:
   ```
   VITE_WEATHER_API_KEY=your_openweathermap_api_key
   ```

4. Run the dev server
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/
    Body.tsx          # Main app component
    ForeCastChart.tsx # 24-hour forecast line chart
  hooks/
    useDebounce.ts     # Debounces search input
    useGeoLocation.ts  # Browser geolocation wrapper
  App.tsx
  main.tsx
```

## API Reference

This project uses the following OpenWeatherMap endpoints:

- Current weather: `/data/2.5/weather`
- 5-day / 3-hour forecast: `/data/2.5/forecast`
- Geocoding (city search suggestions): `/geo/1.0/direct`

Free tier limits: 60 calls/minute, 1,000,000 calls/month — more than enough for personal use.

## Roadmap / Ideas

- [ ] Daily (not just hourly) forecast view
- [ ] Sunrise/sunset display
- [ ] Air quality index
- [ ] Mobile responsiveness polish

## License

MIT
