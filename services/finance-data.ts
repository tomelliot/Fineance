import fs from "fs";
import path from "path";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  account: string;
  type: string;
  tags?: string[];
  merchant?: {
    name: string;
    location?: string;
  } | null;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  parent?: string | null;
  icon: string;
  color: string;
}

export interface FinanceData {
  transactions: Transaction[];
  accounts: unknown[];
  budgets: unknown[];
  categories: Category[];
  recurring_transactions: unknown[];
  financial_goals: unknown[];
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  total: number;
}

export interface MonthlyCategoryData {
  month: string; // YYYY-MM format
  monthLabel: string; // e.g., "Nov 2024"
  categories: {
    categoryId: string;
    categoryName: string;
    total: number; // Only expenses (negative amounts)
  }[];
}

export function loadFinanceData(): FinanceData {
  const filePath = path.join(
    process.cwd(),
    "finance-data",
    "generated_finance_data.json"
  );
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents) as FinanceData;
}

function getDateRange(
  monthsAgo: number,
  endDate: Date
): { start: Date; end: Date } {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // End of the day

  const start = new Date(endDate);
  start.setMonth(start.getMonth() - monthsAgo);
  start.setHours(0, 0, 0, 0);

  return { start, end };
}

function isDateInRange(dateStr: string, start: Date, end: Date): boolean {
  const date = new Date(dateStr);
  return date >= start && date <= end;
}

export function getCategorySummaries(months: number): CategorySummary[] {
  const data = loadFinanceData();
  const today = new Date("2025-10-31"); // Most recent transaction date
  const { start, end } = getDateRange(months, today);

  // Filter transactions in date range
  const transactionsInRange = data.transactions.filter((tx) =>
    isDateInRange(tx.date, start, end)
  );

  // Create category map for lookup
  const categoryMap = new Map<string, string>();
  data.categories.forEach((cat) => {
    categoryMap.set(cat.id, cat.name);
  });

  // Group by category and sum amounts
  const categoryTotals = new Map<string, number>();
  transactionsInRange.forEach((tx) => {
    const currentTotal = categoryTotals.get(tx.category) || 0;
    categoryTotals.set(tx.category, currentTotal + tx.amount);
  });

  // Convert to array and sort by total (descending)
  const summaries: CategorySummary[] = Array.from(categoryTotals.entries())
    .map(([categoryId, total]) => ({
      categoryId,
      categoryName: categoryMap.get(categoryId) || "Unknown",
      total,
    }))
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));

  return summaries;
}

export function getMonthlyExpensesByCategory(): MonthlyCategoryData[] {
  const data = loadFinanceData();
  const today = new Date("2025-10-31"); // Most recent transaction date
  const { start } = getDateRange(12, today);

  // Create category map for lookup
  const categoryMap = new Map<string, string>();
  data.categories.forEach((cat) => {
    categoryMap.set(cat.id, cat.name);
  });

  // Filter transactions in date range (last 12 months)
  const transactionsInRange = data.transactions.filter((tx) => {
    const date = new Date(tx.date);
    return date >= start && date <= today && tx.amount < 0; // Only expenses
  });

  // Group by month and category
  const monthlyData = new Map<string, Map<string, number>>();

  transactionsInRange.forEach((tx) => {
    const date = new Date(tx.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, new Map());
    }

    const categoryMapForMonth = monthlyData.get(monthKey)!;
    const currentTotal = categoryMapForMonth.get(tx.category) || 0;
    categoryMapForMonth.set(tx.category, currentTotal + tx.amount);
  });

  // Convert to array format and sort by month
  const result: MonthlyCategoryData[] = Array.from(monthlyData.entries())
    .map(([monthKey, categoryTotals]) => {
      const [year, month] = monthKey.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const monthLabel = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const categories = Array.from(categoryTotals.entries())
        .map(([categoryId, total]) => ({
          categoryId,
          categoryName: categoryMap.get(categoryId) || "Unknown",
          total: Math.abs(total), // Convert to positive for expenses
        }))
        .sort((a, b) => b.total - a.total); // Sort by total descending

      return {
        month: monthKey,
        monthLabel,
        categories,
      };
    })
    .sort((a, b) => a.month.localeCompare(b.month)); // Sort months chronologically

  return result;
}
