"use client";

import { useWidgetProps } from "../hooks/use-widget-props";
import { SpendingOutliers } from "@/app/components/spending-outliers";
import { SpendingOutlier } from "@/services/categories";

interface SpendingOutliersProps {
  outliers: SpendingOutlier[];
}

export default function SpendingOutliersPage() {
  const props = useWidgetProps<SpendingOutliersProps>({
    outliers: [],
  });

  return <SpendingOutliers outliers={props.outliers} />;
}

