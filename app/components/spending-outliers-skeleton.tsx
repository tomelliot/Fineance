export function SpendingOutliersSkeleton() {
  return (
    <div className="flex flex-col gap-25 p-4">
      {/* Increases section skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-6 w-48 bg-white/20 rounded pb-12" />
        <div className="flex flex-col gap-24">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="relative flex flex-col gap-3 p-4 bg-card-bg text-card-text rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  "20px 20px 60px rgba(15, 15, 15, 1), -20px -20px 60px rgba(45, 45, 45, 1)",
              }}
            >
              {/* Category header skeleton */}
              <div className="flex justify-between items-baseline">
                <div className="h-5 w-32 bg-white/20 rounded" />
                <div className="flex flex-col items-end gap-1">
                  <div className="h-8 w-28 bg-white/20 rounded-full animate-pulse" />
                  <div className="h-3 w-20 bg-white/20 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-white/20 rounded" />
                </div>
              </div>

              {/* Period label skeleton */}
              <div className="h-3 w-24 bg-white/20 rounded -mt-2" />

              {/* Trend bars skeleton */}
              <div className="flex flex-col gap-2 mt-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="h-3 w-24 bg-white/20 rounded" />
                    <div
                      className="flex-1 relative overflow-hidden rounded-xl bg-white/20"
                      style={{ height: "40px" }}
                    >
                      <div
                        className="bg-white/30 rounded-xl animate-pulse"
                        style={{
                          width: `${15 + j * 25}%`,
                          height: "100%",
                        }}
                      />
                    </div>
                    <div className="h-3 w-12 bg-white/20 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
