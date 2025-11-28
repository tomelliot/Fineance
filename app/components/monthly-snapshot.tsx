import { MonthlySnapshot as MonthlySnapshotType } from "@/services/snapshots";
import { SnapshotCard } from "./snapshot-card";
import { MonthlySnapshotCarousel } from "./monthly-snapshot-carousel";

interface MonthlySnapshotProps {
  snapshot: MonthlySnapshotType;
  snapshots?: MonthlySnapshotType[];
}

export function MonthlySnapshot({ snapshot, snapshots }: MonthlySnapshotProps) {
  // If multiple snapshots are provided, use the carousel
  if (snapshots && snapshots.length > 1) {
    return (
      <div className="flex flex-col gap-4 p-4 overflow-visible">
        <MonthlySnapshotCarousel snapshots={snapshots} />
      </div>
    );
  }

  // Otherwise, show a single snapshot (backward compatibility)
  return (
    <div className="flex flex-col gap-4 p-4">
      <SnapshotCard snapshot={snapshot} />
    </div>
  );
}
