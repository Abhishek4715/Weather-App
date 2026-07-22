import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface ForecastEntry {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
  };
  weather: {
    main: string;
    icon: string;
  }[];
}

interface ForecastChartProps {
  list: ForecastEntry[];
}

export function ForecastChart({ list }: ForecastChartProps) {
  const chartData = list.map((entry) => ({
    time: new Date(entry.dt * 1000).toLocaleTimeString([], { hour: "numeric" }),
    temp: Math.round(entry.main.temp),
  }))

  const chartWidth = Math.max(chartData.length * 60, 300)

  return (
 <div className="w-full bg-slate-900/30 rounded-2xl border border-slate-600/30 shadow-sm p-4 mt-4">
      <h3 className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-wider">
        5 Days Forecast
      </h3>

      {/* Scroll container */}
      <div className="w-full overflow-x-auto">
        <div style={{ width: chartWidth, height: 180 }}>
          <LineChart
            width={chartWidth}
            height={180}
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}°`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={{ fill: "#60a5fa", r: 3 }}
            />
          </LineChart>
        </div>
      </div>
    </div>
  )
}

