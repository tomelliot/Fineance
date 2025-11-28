"use client";

import { useWidgetProps } from "../hooks/use-widget-props";
import { CategoryTrends } from "@/app/components/category-trends";
import { CategoryTrend } from "@/services/categories";

interface CategoryTrendsProps {
  trends: CategoryTrend[];
}

export default function CategoryTrendsPage() {
  const props = useWidgetProps<CategoryTrendsProps>({
    trends: [],
  });

  return <CategoryTrends trends={props.trends} />;
}
