import fs from "fs";
import path from "path";
import { Transaction, FinanceData, loadFinanceData } from "./finance-data";

export interface TrendComparison {
  current: number;
  lastPeriod: number;
  samePeriodLastQuarter: number;
  samePeriodLastYear: number;
  changes: {
    vsLastPeriod: {
      amount: number;
      percent: number; // 0 decimal places (e.g., 15, -8)
      direction: "increase" | "decrease";
    };
    vsLastQuarter: {
      amount: number;
      percent: number; // 0 decimal places
      direction: "increase" | "decrease";
    };
    vsLastYear: {
      amount: number;
      percent: number; // 0 decimal places
      direction: "increase" | "decrease";
    };
  };
}

export interface CategoryTrend {
  categoryId: string;
  categoryName: string;
  period: string; // YYYY-MM or YYYY-Q format
  spendingTrend: TrendComparison;
  target?: number;
  status?: "over" | "under" | "on_target";
}

export interface SpendingOutlier {
  categoryId: string;
  categoryName: string;
  period: string; // YYYY-MM or YYYY-Q format
  currentPeriodSpending: number;
  trailingAverage: number; // Average of trailing 4 periods
  change: {
    amount: number;
    percent: number; // 0 decimal places
    direction: "increase" | "decrease";
  };
  spendingTrend: TrendComparison; // Required standardized comparison
}

interface Budget {
  id: string;
  category: string;
  monthly_limit: number;
  spent: number;
  remaining: number;
  period: string;
}

function loadFinanceDataWithBudgets(): FinanceData & { budgets: Budget[] } {
  const filePath = path.join(
    process.cwd(),
    "finance-data",
    "generated_finance_data.json"
  );
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents) as FinanceData & { budgets: Budget[] };
}

export function getPeriodKey(
  date: Date,
  periodType: "month" | "quarter"
): string {
  if (periodType === "month") {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  } else {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `${date.getFullYear()}-Q${quarter}`;
  }
}

export function getPeriodStartEnd(
  periodKey: string,
  periodType: "month" | "quarter"
): { start: Date; end: Date } {
  if (periodType === "month") {
    const [year, month] = periodKey.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    return { start, end };
  } else {
    const [year, quarter] = periodKey.split("-Q").map(Number);
    const startMonth = (quarter - 1) * 3;
    const start = new Date(year, startMonth, 1);
    const end = new Date(year, startMonth + 3, 0, 23, 59, 59, 999);
    return { start, end };
  }
}

export function getPreviousPeriod(
  periodKey: string,
  periodType: "month" | "quarter"
): string {
  if (periodType === "month") {
    const [year, month] = periodKey.split("-").map(Number);
    const date = new Date(year, month - 1);
    date.setMonth(date.getMonth() - 1);
    return getPeriodKey(date, "month");
  } else {
    const [year, quarter] = periodKey.split("-Q").map(Number);
    const date = new Date(year, (quarter - 1) * 3);
    date.setMonth(date.getMonth() - 3);
    return getPeriodKey(date, "quarter");
  }
}

export function getSamePeriodLastQuarter(
  periodKey: string,
  periodType: "month" | "quarter"
): string {
  if (periodType === "month") {
    // 3 months ago
    const [year, month] = periodKey.split("-").map(Number);
    const date = new Date(year, month - 1);
    date.setMonth(date.getMonth() - 3);
    return getPeriodKey(date, "month");
  } else {
    // 3 quarters ago
    const [year, quarter] = periodKey.split("-Q").map(Number);
    const date = new Date(year, (quarter - 1) * 3);
    date.setMonth(date.getMonth() - 9);
    return getPeriodKey(date, "quarter");
  }
}

export function getSamePeriodLastYear(
  periodKey: string,
  periodType: "month" | "quarter"
): string {
  if (periodType === "month") {
    const [year, month] = periodKey.split("-").map(Number);
    const date = new Date(year, month - 1);
    date.setFullYear(date.getFullYear() - 1);
    return getPeriodKey(date, "month");
  } else {
    const [year, quarter] = periodKey.split("-Q").map(Number);
    const date = new Date(year, (quarter - 1) * 3);
    date.setFullYear(date.getFullYear() - 1);
    return getPeriodKey(date, "quarter");
  }
}

function calculatePeriodSpending(
  periodKey: string,
  periodType: "month" | "quarter",
  categoryId: string,
  transactions: Transaction[]
): number {
  const { start, end } = getPeriodStartEnd(periodKey, periodType);
  return transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        tx.category === categoryId &&
        txDate >= start &&
        txDate <= end &&
        tx.amount < 0 // Only expenses
      );
    })
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
}

function calculatePercentageChange(
  current: number,
  previous: number
): { percent: number; direction: "increase" | "decrease" } {
  if (previous === 0) {
    return current > 0
      ? { percent: 100, direction: "increase" }
      : { percent: 0, direction: "decrease" };
  }
  const percent = Math.round(((current - previous) / previous) * 100);
  return {
    percent,
    direction: percent >= 0 ? "increase" : "decrease",
  };
}

export function calculateTrendComparison(
  currentPeriod: string,
  periodType: "month" | "quarter",
  categoryId: string,
  transactions: Transaction[]
): TrendComparison {
  const current = calculatePeriodSpending(
    currentPeriod,
    periodType,
    categoryId,
    transactions
  );
  const lastPeriodKey = getPreviousPeriod(currentPeriod, periodType);
  const lastPeriod = calculatePeriodSpending(
    lastPeriodKey,
    periodType,
    categoryId,
    transactions
  );
  const samePeriodLastQuarterKey = getSamePeriodLastQuarter(
    currentPeriod,
    periodType
  );
  const samePeriodLastQuarter = calculatePeriodSpending(
    samePeriodLastQuarterKey,
    periodType,
    categoryId,
    transactions
  );
  const samePeriodLastYearKey = getSamePeriodLastYear(
    currentPeriod,
    periodType
  );
  const samePeriodLastYear = calculatePeriodSpending(
    samePeriodLastYearKey,
    periodType,
    categoryId,
    transactions
  );

  const vsLastPeriod = calculatePercentageChange(current, lastPeriod);
  const vsLastQuarter = calculatePercentageChange(
    current,
    samePeriodLastQuarter
  );
  const vsLastYear = calculatePercentageChange(current, samePeriodLastYear);

  return {
    current,
    lastPeriod,
    samePeriodLastQuarter,
    samePeriodLastYear,
    changes: {
      vsLastPeriod: {
        amount: current - lastPeriod,
        percent: vsLastPeriod.percent,
        direction: vsLastPeriod.direction,
      },
      vsLastQuarter: {
        amount: current - samePeriodLastQuarter,
        percent: vsLastQuarter.percent,
        direction: vsLastQuarter.direction,
      },
      vsLastYear: {
        amount: current - samePeriodLastYear,
        percent: vsLastYear.percent,
        direction: vsLastYear.direction,
      },
    },
  };
}

export function getCategoryTrends(
  categoryId?: string,
  periodType: "month" | "quarter" = "month"
): CategoryTrend[] {
  const data = loadFinanceDataWithBudgets();
  const today = new Date("2025-10-31"); // Most recent transaction date
  const currentPeriod = getPeriodKey(today, periodType);

  // Create category map for lookup
  const categoryMap = new Map<string, string>();
  data.categories.forEach((cat) => {
    categoryMap.set(cat.id, cat.name);
  });

  // Get category IDs to process
  const categoryIds = categoryId
    ? [categoryId]
    : Array.from(categoryMap.keys());

  // Get budgets for current period to find targets
  const budgetMap = new Map<string, number>();
  data.budgets
    .filter((budget) => budget.period === currentPeriod)
    .forEach((budget) => {
      budgetMap.set(budget.category, budget.monthly_limit);
    });

  const trends: CategoryTrend[] = [];

  for (const catId of categoryIds) {
    const categoryName = categoryMap.get(catId) || "Unknown";
    const spendingTrend = calculateTrendComparison(
      currentPeriod,
      periodType,
      catId,
      data.transactions
    );

    // Get target if available
    const target = budgetMap.get(catId);
    let status: "over" | "under" | "on_target" | undefined;
    if (target !== undefined) {
      const tolerance = target * 0.05; // 5% tolerance
      if (spendingTrend.current > target + tolerance) {
        status = "over";
      } else if (spendingTrend.current < target - tolerance) {
        status = "under";
      } else {
        status = "on_target";
      }
    }

    trends.push({
      categoryId: catId,
      categoryName,
      period: currentPeriod,
      spendingTrend,
      target,
      status,
    });
  }

  // Sort by current spending (descending)
  return trends.sort(
    (a, b) => b.spendingTrend.current - a.spendingTrend.current
  );
}

function calculateTrailingAverage(
  categoryId: string,
  currentPeriod: string,
  periodType: "month" | "quarter",
  transactions: Transaction[]
): number {
  // Get spending for last 4 periods (previous period, 2 periods ago, 3 periods ago, 4 periods ago)
  const periods: string[] = [];
  let periodKey = currentPeriod;

  for (let i = 0; i < 4; i++) {
    periodKey = getPreviousPeriod(periodKey, periodType);
    periods.push(periodKey);
  }

  const spendingAmounts = periods.map((period) =>
    calculatePeriodSpending(period, periodType, categoryId, transactions)
  );

  // Calculate average of the 4 periods
  const sum = spendingAmounts.reduce((acc, val) => acc + val, 0);
  return sum / 4;
}

export function findSpendingOutliers(
  periodType: "month" | "quarter" = "month",
  direction: "increase" | "decrease" | "both" = "both",
  thresholdPercent: number = 20
): SpendingOutlier[] {
  const data = loadFinanceData();
  const today = new Date("2025-10-31"); // Most recent transaction date
  const currentPeriod = getPeriodKey(today, periodType);

  // Create category map for lookup
  const categoryMap = new Map<string, string>();
  data.categories.forEach((cat) => {
    categoryMap.set(cat.id, cat.name);
  });

  const outliers: SpendingOutlier[] = [];

  // Process each category
  for (const [categoryId, categoryName] of categoryMap.entries()) {
    // Calculate current period spending
    const currentPeriodSpending = calculatePeriodSpending(
      currentPeriod,
      periodType,
      categoryId,
      data.transactions
    );

    // Calculate trailing 4-period average
    const trailingAverage = calculateTrailingAverage(
      categoryId,
      currentPeriod,
      periodType,
      data.transactions
    );

    // Skip if no historical data (trailing average is 0 and current is 0)
    if (trailingAverage === 0 && currentPeriodSpending === 0) {
      continue;
    }

    // Calculate change
    const changeAmount = currentPeriodSpending - trailingAverage;

    // Calculate percentage change (0 decimal places)
    let percentChange: number;
    if (trailingAverage === 0) {
      // If no historical spending, treat as 100% increase if current > 0
      percentChange = currentPeriodSpending > 0 ? 100 : 0;
    } else {
      percentChange = Math.round((changeAmount / trailingAverage) * 100);
    }

    // Determine direction
    const changeDirection: "increase" | "decrease" =
      changeAmount >= 0 ? "increase" : "decrease";

    // Filter by direction parameter
    if (direction !== "both" && changeDirection !== direction) {
      continue;
    }

    // Filter by threshold (only include if absolute percentage change >= threshold)
    if (Math.abs(percentChange) < thresholdPercent) {
      continue;
    }

    // Calculate spending trend comparison for the current period
    const spendingTrend = calculateTrendComparison(
      currentPeriod,
      periodType,
      categoryId,
      data.transactions
    );

    outliers.push({
      categoryId,
      categoryName,
      period: currentPeriod,
      currentPeriodSpending,
      trailingAverage,
      change: {
        amount: changeAmount,
        percent: percentChange,
        direction: changeDirection,
      },
      spendingTrend,
    });
  }

  // Sort by absolute percentage change (descending) to show most significant outliers first
  return outliers.sort(
    (a, b) => Math.abs(b.change.percent) - Math.abs(a.change.percent)
  );
}
