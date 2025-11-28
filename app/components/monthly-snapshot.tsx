import { MonthlySnapshot as MonthlySnapshotType } from "@/services/snapshots";
import { SnapshotCard } from "./snapshot-card";

interface MonthlySnapshotProps {
  snapshot: MonthlySnapshotType;
}

export function MonthlySnapshot({ snapshot }: MonthlySnapshotProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <SnapshotCard snapshot={snapshot} />
    </div>
  );
}
