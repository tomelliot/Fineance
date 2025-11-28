export function HealthSkeleton() {
  return (
    <div style={{ padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      <div className="h-6 w-32 bg-white/20 rounded mb-2" />
      <div className="h-4 w-48 bg-white/20 rounded mb-2 animate-pulse" />
      <div className="h-3 w-40 bg-white/20 rounded animate-pulse" />
    </div>
  );
}
