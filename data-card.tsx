
import { cn } from "@/lib/utils";
import React from "react";

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function DataCard({ title, value, icon, trend, className }: DataCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-lg shadow-sm border", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {trend && (
            <p
              className={cn(
                "text-xs mt-1 flex items-center",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              <span className="mr-1">
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </p>
          )}
        </div>
        {icon && <div className="text-invoice-purple text-xl">{icon}</div>}
      </div>
    </div>
  );
}
