import { findSpendingOutliers } from "@/services/categories";
import { SpendingOutliers } from "@/app/components/spending-outliers";

export default async function SpendingOutliersPage() {
  // Get spending outliers for all categories with monthly period (default)
  const outliers = findSpendingOutliers("month", "both", 20);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-primary">Spending Outliers</h1>
      <p className="mb-6 text-primary">
        Categories with unusual spending patterns (increases or decreases) compared
        to their trailing 4-period average.
      </p>
      <SpendingOutliers outliers={outliers} />
    </div>
  );
}

