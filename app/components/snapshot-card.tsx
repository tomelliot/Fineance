import { MonthlySnapshot as MonthlySnapshotType } from "@/services/snapshots";
import {
  formatCurrency,
  formatPercent,
  formatMonthLabel,
} from "./monthly-snapshot-utils";

interface SnapshotCardProps {
  snapshot: MonthlySnapshotType;
}

export function SnapshotCard({ snapshot }: SnapshotCardProps) {
  const { spendingTrend } = snapshot;
  const barHeight = 40;

  // Find max value for scaling bars
  const maxValue = Math.max(
    spendingTrend.current,
    spendingTrend.lastPeriod,
    spendingTrend.samePeriodLastQuarter,
    spendingTrend.samePeriodLastYear
  );

  const currentWidth = (spendingTrend.current / maxValue) * 100;
  const lastPeriodWidth = (spendingTrend.lastPeriod / maxValue) * 100;
  const lastQuarterWidth =
    (spendingTrend.samePeriodLastQuarter / maxValue) * 100;
  const lastYearWidth = (spendingTrend.samePeriodLastYear / maxValue) * 100;

  return (
    <div
      className="relative flex flex-col gap-4 p-4 bg-card-bg text-card-text rounded-2xl overflow-hidden"
      style={{
        boxShadow:
          "20px 20px 60px rgba(65, 51, 88, 1), -20px -20px 60px rgba(101, 81, 138, 1)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-baseline">
        <h2 className="m-0 text-xl font-semibold">
          {formatMonthLabel(snapshot.month)}
        </h2>
      </div>

      {/* Income vs Spending */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-card-text/80">Income</span>
          <span className="text-lg font-semibold text-lime-green">
            {formatCurrency(snapshot.income)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-card-text/80">Spending</span>
          <span className="text-lg font-semibold text-rose">
            {formatCurrency(snapshot.spending)}
          </span>
        </div>
        <div className="border-t border-card-text/20 pt-3 mt-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-card-text/90">
              Money Left to Spend
            </span>
            <span
              className={`text-xl font-bold ${
                snapshot.remaining < 0 ? "text-rose" : "text-lime-green"
              }`}
            >
              {formatCurrency(snapshot.remaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Largest Spending Category */}
      {snapshot.largestCategory.total > 0 && (
        <div className="border-t border-card-text/20 pt-3 mt-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-card-text/80">Largest Category</span>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-card-text/90">
                {snapshot.largestCategory.categoryName}
              </span>
              <span className="text-base font-semibold text-rose">
                {formatCurrency(snapshot.largestCategory.total)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Spending Trend Bars */}
      <div className="border-t border-card-text/20 pt-4 mt-2">
        <h3 className="text-sm font-semibold mb-3">Spending Trend</h3>
        <div className="flex flex-col gap-2">
          {/* Current month */}
          <div className="flex items-center gap-3">
            <div className="text-xs w-24 text-card-text/80">Current</div>
            <div
              className="flex-1 relative overflow-hidden rounded-xl bg-white/20"
              style={{ height: `${barHeight}px` }}
            >
              <div
                className="flex items-center font-semibold bg-lime-green text-primary-inverted rounded-xl pl-2"
                style={{
                  width: `${currentWidth}%`,
                  height: "100%",
                }}
              >
                {currentWidth > 15 && formatCurrency(spendingTrend.current)}
              </div>
            </div>
            <div className="min-w-[50px]" />
          </div>

          {/* Last month */}
          <div className="flex items-center gap-3">
            <div className="text-xs w-24 text-card-text/80">Last month</div>
            <div
              className="flex-1 relative overflow-hidden rounded-xl bg-white/20"
              style={{ height: `${barHeight}px` }}
            >
              <div
                className="bg-salmon rounded-xl"
                style={{
                  width: `${lastPeriodWidth}%`,
                  height: "100%",
                }}
              />
            </div>
            {spendingTrend.changes.vsLastPeriod.percent !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs font-semibold min-w-[50px] ${
                  spendingTrend.changes.vsLastPeriod.direction === "increase"
                    ? "text-rose"
                    : "text-lime-green"
                }`}
              >
                <span>
                  {spendingTrend.changes.vsLastPeriod.direction === "increase"
                    ? "▲"
                    : "▼"}
                </span>
                <span>
                  {formatPercent(spendingTrend.changes.vsLastPeriod.percent)}
                </span>
              </div>
            )}
            {spendingTrend.changes.vsLastPeriod.percent === 0 && (
              <div className="min-w-[50px]" />
            )}
          </div>

          {/* Same month last quarter */}
          <div className="flex items-center gap-3">
            <div className="text-xs w-24 text-card-text/80">Last quarter</div>
            <div
              className="flex-1 relative overflow-hidden rounded-xl bg-white/20"
              style={{ height: `${barHeight}px` }}
            >
              <div
                className="bg-salmon rounded-xl"
                style={{
                  width: `${lastQuarterWidth}%`,
                  height: "100%",
                }}
              />
            </div>
            {spendingTrend.changes.vsLastQuarter.percent !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs font-semibold min-w-[50px] ${
                  spendingTrend.changes.vsLastQuarter.direction === "increase"
                    ? "text-rose"
                    : "text-lime-green"
                }`}
              >
                <span>
                  {spendingTrend.changes.vsLastQuarter.direction === "increase"
                    ? "▲"
                    : "▼"}
                </span>
                <span>
                  {formatPercent(spendingTrend.changes.vsLastQuarter.percent)}
                </span>
              </div>
            )}
            {spendingTrend.changes.vsLastQuarter.percent === 0 && (
              <div className="min-w-[50px]" />
            )}
          </div>

          {/* Same month last year */}
          <div className="flex items-center gap-3">
            <div className="text-xs w-24 text-card-text/80">Last year</div>
            <div
              className="flex-1 relative overflow-hidden rounded-xl bg-white/20"
              style={{ height: `${barHeight}px` }}
            >
              <div
                className="bg-salmon rounded-xl"
                style={{
                  width: `${lastYearWidth}%`,
                  height: "100%",
                }}
              />
            </div>
            {spendingTrend.changes.vsLastYear.percent !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs font-semibold min-w-[50px] ${
                  spendingTrend.changes.vsLastYear.direction === "increase"
                    ? "text-rose"
                    : "text-lime-green"
                }`}
              >
                <span>
                  {spendingTrend.changes.vsLastYear.direction === "increase"
                    ? "▲"
                    : "▼"}
                </span>
                <span>
                  {formatPercent(spendingTrend.changes.vsLastYear.percent)}
                </span>
              </div>
            )}
            {spendingTrend.changes.vsLastYear.percent === 0 && (
              <div className="min-w-[50px]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
