import { Skeleton } from "./Skeleton"

export function WeatherSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* City name */}
      <Skeleton className="h-9 w-40 mb-1" />

      {/* Condition + icon */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Wind */}
      <Skeleton className="h-4 w-32 mb-1" />

      {/* Massive temp */}
      <Skeleton className="h-24 w-32 mb-10" />

      {/* Bottom grid */}
      <div className="w-full grid grid-cols-4 gap-4 px-6 py-4 bg-slate-900/30 rounded-2xl border border-slate-600/30">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <Skeleton className="h-44 w-full mt-4 rounded-2xl" />
    </div>
  )
}