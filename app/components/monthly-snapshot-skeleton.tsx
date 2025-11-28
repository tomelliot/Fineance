export function MonthlySnapshotSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div
        className="relative flex flex-col gap-4 p-4 bg-card-bg text-card-text rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "20px 20px 60px rgba(15, 15, 15, 1), -20px -20px 60px rgba(45, 45, 45, 1)",
        }}
      >
        {/* Header skeleton */}
        <div className="flex justify-between items-baseline">
          <div className="h-6 w-32 bg-white/20 rounded" />
        </div>

        {/* Income vs Spending skeleton */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-20 bg-white/20 rounded" />
            <div className="h-5 w-24 bg-white/20 rounded animate-pulse" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-20 bg-white/20 rounded" />
            <div className="h-5 w-24 bg-white/20 rounded animate-pulse" />
          </div>
          <div className="border-t border-card-text/20 pt-3 mt-1">
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-white/20 rounded" />
              <div className="h-6 w-28 bg-white/20 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Largest Category skeleton */}
        <div className="border-t border-card-text/20 pt-3 mt-1">
          <div className="flex justify-between items-center">
            <div className="h-4 w-28 bg-white/20 rounded" />
            <div className="flex flex-col items-end gap-1">
              <div className="h-4 w-24 bg-white/20 rounded" />
              <div className="h-5 w-20 bg-white/20 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Spending Trend Bars skeleton */}
        <div className="border-t border-card-text/20 pt-4 mt-2">
          <div className="h-4 w-32 bg-white/20 rounded mb-3" />
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3 w-24 bg-white/20 rounded" />
                <div
                  className="flex-1 relative overflow-hidden rounded-xl bg-white/20"
                  style={{ height: "40px" }}
                >
                  <div
                    className="bg-white/30 rounded-xl animate-pulse"
                    style={{
                      width: `${20 + i * 20}%`,
                      height: "100%",
                    }}
                  />
                </div>
                <div className="min-w-[50px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
