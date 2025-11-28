import { getMonthlySnapshot, getMonthlySnapshots } from "@/services/snapshots";
import { MonthlySnapshot } from "@/app/components/monthly-snapshot";

export default async function MonthlySnapshotPage() {
  // Get current month snapshot (default)
  const snapshot = getMonthlySnapshot();
  // Get last 12 months of snapshots for the carousel
  const snapshots = getMonthlySnapshots(12);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-primary">Monthly Snapshot</h1>
      <p className="mb-6 text-primary">
        Current month financial overview with income vs. spending, money left to
        spend, largest spending category, and standardized trend comparisons.
        Scroll through previous months using the carousel.
      </p>
      <MonthlySnapshot snapshot={snapshot} snapshots={snapshots} />
    </div>
  );
}
