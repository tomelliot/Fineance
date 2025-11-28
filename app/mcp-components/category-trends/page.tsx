"use client";

import { useWidgetProps } from "../hooks/use-widget-props";
import { CategoryTrends } from "@/app/components/category-trends";
import { CategoryTrendsSkeleton } from "@/app/components/category-trends-skeleton";
import { CategoryTrend } from "@/services/categories";

interface CategoryTrendsProps extends Record<string, unknown> {
  trends: CategoryTrend[];
}

export default function CategoryTrendsPage() {
  const { data: props, isLoading } = useWidgetProps<CategoryTrendsProps>({
    trends: [],
  });

  if (isLoading) {
    return <CategoryTrendsSkeleton />;
  }

  return <CategoryTrends trends={props.trends} />;
}
