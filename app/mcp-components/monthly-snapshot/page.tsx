"use client";

import { useWidgetProps } from "../hooks/use-widget-props";
import { MonthlySnapshot as MonthlySnapshotComponent } from "@/app/components/monthly-snapshot";
import { MonthlySnapshotSkeleton } from "@/app/components/monthly-snapshot-skeleton";
import { MonthlySnapshot as MonthlySnapshotType } from "@/services/snapshots";

interface MonthlySnapshotProps extends Record<string, unknown> {
  snapshot: MonthlySnapshotType;
  snapshots?: MonthlySnapshotType[];
}

export default function MonthlySnapshotPage() {
  const { data: props, isLoading } = useWidgetProps<MonthlySnapshotProps>({
    snapshot: {
      month: "",
      income: 0,
      spending: 0,
      remaining: 0,
      largestCategory: {
        categoryId: "",
        categoryName: "",
        total: 0,
      },
      spendingTrend: {
        current: 0,
        lastPeriod: 0,
        samePeriodLastQuarter: 0,
        samePeriodLastYear: 0,
        changes: {
          vsLastPeriod: {
            amount: 0,
            percent: 0,
            direction: "decrease",
          },
          vsLastQuarter: {
            amount: 0,
            percent: 0,
            direction: "decrease",
          },
          vsLastYear: {
            amount: 0,
            percent: 0,
            direction: "decrease",
          },
        },
      },
    },
    snapshots: [],
  });

  if (isLoading) {
    return <MonthlySnapshotSkeleton />;
  }

  return (
    <MonthlySnapshotComponent
      snapshot={props.snapshot}
      snapshots={props.snapshots}
    />
  );
}
