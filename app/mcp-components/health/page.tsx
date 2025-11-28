"use client";

import { useWidgetProps } from "../hooks/use-widget-props";
import { HealthSkeleton } from "@/app/components/health-skeleton";

interface HealthProps extends Record<string, unknown> {
  status: string;
  timestamp: string;
}

export default function HealthPage() {
  const { data: props, isLoading } = useWidgetProps<HealthProps>({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });

  if (isLoading) {
    return <HealthSkeleton />;
  }

  return (
    <div style={{ padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>
        Health Status
      </h2>
      <p style={{ margin: "0 0 8px 0", color: "#666" }}>
        Status: <strong>{props.status}</strong>
      </p>
      <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>
        {new Date(props.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
