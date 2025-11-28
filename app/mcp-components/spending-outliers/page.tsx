"use client";

import { useWidgetProps } from "../hooks/use-widget-props";
import { SpendingOutliers } from "@/app/components/spending-outliers";
import { SpendingOutliersSkeleton } from "@/app/components/spending-outliers-skeleton";
import { SpendingOutlier } from "@/services/categories";

interface SpendingOutliersProps extends Record<string, unknown> {
  outliers: SpendingOutlier[];
}

export default function SpendingOutliersPage() {
  const { data: props, isLoading } = useWidgetProps<SpendingOutliersProps>({
    outliers: [],
  });

  if (isLoading) {
    return <SpendingOutliersSkeleton />;
  }

  return <SpendingOutliers outliers={props.outliers} />;
}
