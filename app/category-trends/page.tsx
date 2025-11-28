import { getCategoryTrends } from "@/services/categories";
import { CategoryTrends } from "@/app/components/category-trends";

export default async function CategoryTrendsPage() {
  // Get trends for all categories with monthly period (default)
  const trends = getCategoryTrends(undefined, "month");

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-primary">Category Trends</h1>
      <p className="mb-6 text-primary">
        Spending trends with comparisons to last period, same period last
        quarter, and same period last year.
      </p>
      <CategoryTrends trends={trends} />
    </div>
  );
}
