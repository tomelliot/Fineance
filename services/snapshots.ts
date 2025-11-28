import { loadFinanceData, Transaction, FinanceData } from "./finance-data";
import {
  TrendComparison,
  getPeriodKey,
  getPeriodStartEnd,
  getPreviousPeriod,
  getSamePeriodLastQuarter,
  getSamePeriodLastYear,
} from "./categories";

export interface MonthlySnapshot {
  month: string; // YYYY-MM
  income: number;
  spending: number;
  remaining: number;
  largestCategory: {
    categoryId: string;
    categoryName: string;
    total: number;
  };
  spendingTrend: TrendComparison;
}

function calculateTotalPeriodSpending(
  periodKey: string,
  periodType: "month" | "quarter",
  transactions: Transaction[]
): number {
  const { start, end } = getPeriodStartEnd(periodKey, periodType);
  return transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= start && txDate <= end && tx.amount < 0; // Only expenses
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

function calculateTotalSpendingTrend(
  currentPeriod: string,
  periodType: "month" | "quarter",
  transactions: Transaction[]
): TrendComparison {
  const current = calculateTotalPeriodSpending(
    currentPeriod,
    periodType,
    transactions
  );
  const lastPeriodKey = getPreviousPeriod(currentPeriod, periodType);
  const lastPeriod = calculateTotalPeriodSpending(
    lastPeriodKey,
    periodType,
    transactions
  );
  const samePeriodLastQuarterKey = getSamePeriodLastQuarter(
    currentPeriod,
    periodType
  );
  const samePeriodLastQuarter = calculateTotalPeriodSpending(
    samePeriodLastQuarterKey,
    periodType,
    transactions
  );
  const samePeriodLastYearKey = getSamePeriodLastYear(
    currentPeriod,
    periodType
  );
  const samePeriodLastYear = calculateTotalPeriodSpending(
    samePeriodLastYearKey,
    periodType,
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

export function getMonthlySnapshot(month?: string): MonthlySnapshot {
  const data = loadFinanceData();
  const today = new Date("2025-10-31"); // Most recent transaction date

  // Determine the target month
  let targetMonth: string;
  if (month) {
    targetMonth = month;
  } else {
    targetMonth = getPeriodKey(today, "month");
  }

  // Get month start and end dates
  const { start, end } = getPeriodStartEnd(targetMonth, "month");

  // Create category map for lookup
  const categoryMap = new Map<string, string>();
  data.categories.forEach((cat) => {
    categoryMap.set(cat.id, cat.name);
  });

  // Filter transactions for the target month
  const monthTransactions = data.transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate >= start && txDate <= end;
  });

  // Calculate income (sum of transactions with type: "credit" and positive amounts)
  const income = monthTransactions
    .filter((tx) => tx.type === "credit" && tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate spending (sum of transactions with amount < 0, convert to positive)
  const spending = monthTransactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Calculate remaining
  const remaining = income - spending;

  // Find largest spending category
  const categoryTotals = new Map<string, number>();
  monthTransactions
    .filter((tx) => tx.amount < 0)
    .forEach((tx) => {
      const currentTotal = categoryTotals.get(tx.category) || 0;
      categoryTotals.set(tx.category, currentTotal + Math.abs(tx.amount));
    });

  let largestCategory = {
    categoryId: "",
    categoryName: "None",
    total: 0,
  };

  if (categoryTotals.size > 0) {
    const largest = Array.from(categoryTotals.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0];
    largestCategory = {
      categoryId: largest[0],
      categoryName: categoryMap.get(largest[0]) || "Unknown",
      total: largest[1],
    };
  }

  // Calculate spending trend comparison
  const spendingTrend = calculateTotalSpendingTrend(
    targetMonth,
    "month",
    data.transactions
  );

  return {
    month: targetMonth,
    income,
    spending,
    remaining,
    largestCategory,
    spendingTrend,
  };
}

export function getMonthlySnapshots(count: number = 12): MonthlySnapshot[] {
  const data = loadFinanceData();
  const today = new Date("2025-10-31"); // Most recent transaction date
  const currentMonth = getPeriodKey(today, "month");

  const snapshots: MonthlySnapshot[] = [];
  let monthKey = currentMonth;

  for (let i = 0; i < count; i++) {
    const snapshot = getMonthlySnapshot(monthKey);
    snapshots.push(snapshot);

    // Get previous month
    monthKey = getPreviousPeriod(monthKey, "month");
  }

  // Return in reverse order (oldest first, newest last)
  // This way the carousel can start at the end (most recent)
  return snapshots.reverse();
}
