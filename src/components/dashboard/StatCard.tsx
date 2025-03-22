
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statCardVariants = cva(
  "relative overflow-hidden rounded-lg bg-white p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md",
  {
    variants: {
      variant: {
        default: "",
        success: "border-l-4 border-l-green-500",
        warning: "border-l-4 border-l-amber-500",
        danger: "border-l-4 border-l-red-500",
        info: "border-l-4 border-l-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  chart?: React.ReactNode;
}

export function StatCard({
  className,
  variant,
  title,
  value,
  change,
  trend,
  icon,
  chart,
  ...props
}: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ variant }), className)} {...props}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900">{value}</h3>
          {change && (
            <p className={cn("mt-1 text-xs", {
              "text-green-600": trend === "up",
              "text-red-600": trend === "down",
              "text-gray-500": trend === "neutral"
            })}>
              {trend === "up" && "↑ "}
              {trend === "down" && "↓ "}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
      </div>
      {chart && (
        <div className="mt-4 h-16">
          {chart}
        </div>
      )}
    </div>
  );
}
