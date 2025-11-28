import { getMonthlyExpensesByCategory } from "@/services/finance-data";

export default async function MonthlyExpensesChartPage() {
  const monthlyData = getMonthlyExpensesByCategory();

  // Get all unique categories across all months
  const allCategories = new Set<string>();
  monthlyData.forEach((month) => {
    month.categories.forEach((cat) => {
      allCategories.add(cat.categoryId);
    });
  });
  const categoryList = Array.from(allCategories);

  // Create category name map
  const categoryNameMap = new Map<string, string>();
  monthlyData.forEach((month) => {
    month.categories.forEach((cat) => {
      categoryNameMap.set(cat.categoryId, cat.categoryName);
    });
  });

  // Find max value for scaling
  const maxValue = Math.max(
    ...monthlyData.flatMap((month) => month.categories.map((cat) => cat.total))
  );

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">
        Monthly Expenses by Category (Last 12 Months)
      </h1>

      <div className="space-y-12">
        {monthlyData.map((month) => (
          <section key={month.month} className="space-y-2">
            <h2 className="text-xl font-semibold">{month.monthLabel}</h2>
            <div className="space-y-2">
              {month.categories.map((category) => {
                const barWidth = (category.total / maxValue) * 100;
                return (
                  <div
                    key={category.categoryId}
                    className="flex items-center gap-4"
                  >
                    <div className="w-32 text-sm font-medium">
                      {category.categoryName}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded h-6 relative">
                      <div
                        className="bg-blue-500 h-6 rounded"
                        style={{ width: `${barWidth}%` }}
                      />
                      <span className="absolute left-2 top-0.5 text-xs text-gray-700">
                        €{category.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
