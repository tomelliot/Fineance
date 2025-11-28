"use client";

import { SpendingOutlier } from "@/services/categories";

interface SpendingOutliersProps {
  outliers: SpendingOutlier[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(percent: number): string {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent}%`;
}

export function SpendingOutliers({ outliers }: SpendingOutliersProps) {
  if (outliers.length === 0) {
    return (
      <div className="p-4">
        <p className="text-muted">No spending outliers found.</p>
      </div>
    );
  }

  // Group outliers by direction
  const increases = outliers.filter(
    (outlier) => outlier.change.direction === "increase"
  );
  const decreases = outliers.filter(
    (outlier) => outlier.change.direction === "decrease"
  );

  // Find max value for scaling bars across all outliers
  const maxValue = Math.max(
    ...outliers.flatMap((outlier) => [
      outlier.spendingTrend.current,
      outlier.spendingTrend.lastPeriod,
      outlier.spendingTrend.samePeriodLastQuarter,
      outlier.spendingTrend.samePeriodLastYear,
    ])
  );

  const renderOutlier = (outlier: SpendingOutlier) => {
    const { spendingTrend } = outlier;
    const barHeight = 40;
    const currentWidth = (spendingTrend.current / maxValue) * 100;
    const lastPeriodWidth = (spendingTrend.lastPeriod / maxValue) * 100;
    const lastQuarterWidth =
      (spendingTrend.samePeriodLastQuarter / maxValue) * 100;
    const lastYearWidth = (spendingTrend.samePeriodLastYear / maxValue) * 100;

    // Color coding: Green for decreases, red for increases
    const isIncrease = outlier.change.direction === "increase";
    const changeColor = isIncrease ? "text-rose" : "text-lime-green";

    return (
      <div
        key={outlier.categoryId}
        className="relative flex flex-col gap-3 p-4 bg-card-bg text-card-text rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "20px 20px 60px rgba(15, 15, 15, 1), -20px -20px 60px rgba(45, 45, 45, 1)",
        }}
      >
        {/* Category header */}
        <div className="flex justify-between items-baseline">
          <h3 className="m-0 text-lg font-semibold">{outlier.categoryName}</h3>
          <div className="flex flex-col items-end gap-1">
            <div className="text-2xl font-bold px-3 py-1 bg-lime-green text-primary-inverted rounded-full">
              {formatCurrency(outlier.currentPeriodSpending)}
            </div>
            <div className={`text-xs font-semibold ${changeColor}`}>
              {formatCurrency(outlier.change.amount)} (
              {formatPercent(outlier.change.percent)})
            </div>
            <div className="text-xs text-card-text/40">
              vs. {formatCurrency(outlier.trailingAverage)} avg
            </div>
          </div>
        </div>

        {/* Period label */}
        <div className="text-xs text-card-text/40 -mt-2">{outlier.period}</div>

        {/* Trend bars */}
        <div className="flex flex-col gap-2 mt-2">
          {/* Current period */}
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

          {/* Last period */}
          <div className="flex items-center gap-3">
            <div className="text-xs w-24 text-card-text/80">Last period</div>
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

          {/* Same period last quarter */}
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

          {/* Same period last year */}
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
    );
  };

  return (
    <div className="flex flex-col gap-25 p-4">
      {increases.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-rose pb-12">
            Spending Increases ({increases.length})
          </h2>
          <div className="flex flex-col gap-24">
            {increases.map(renderOutlier)}
          </div>
        </div>
      )}
      {decreases.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-lime-green pb-12">
            Spending Decreases ({decreases.length})
          </h2>
          <div className="flex flex-col gap-24">
            {decreases.map(renderOutlier)}
          </div>
        </div>
      )}
    </div>
  );
}
