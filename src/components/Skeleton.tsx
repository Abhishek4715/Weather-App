export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-slate-700/50 rounded-lg animate-pulse ${className}`} />
  )
}