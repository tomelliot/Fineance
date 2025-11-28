import { getMonthlySnapshot } from "@/services/snapshots";
import { MonthlySnapshot } from "@/app/components/monthly-snapshot";

export default async function MonthlySnapshotPage() {
  // Get current month snapshot (default)
  const snapshot = getMonthlySnapshot();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-primary">Monthly Snapshot</h1>
      <p className="mb-6 text-primary">
        Current month financial overview with income vs. spending, money left to
        spend, largest spending category, and standardized trend comparisons.
      </p>
      <MonthlySnapshot snapshot={snapshot} />
    </div>
  );
}
