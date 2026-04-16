"use client";

import { Download } from "lucide-react";
import { Cell, Legend, Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";

import { Button } from "../../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/card";
import { cn } from "../../lib/utils";

import type { PieChartProps } from "./types";

export function PieChartComponent({
  data,
  dataKey,
  nameKey,
  title,
  description,
  showDownloadButton = false,
  showLegend = true,
  labelFormatter,
  outerRadius = 100,
  cx = "50%",
  cy = "50%",
  className,
}: PieChartProps) {
  return (
    <Card className={cn("w-full overflow-hidden flex flex-col", className)}>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 pb-3 md:pb-4 shrink-0">
        <div>
          <CardTitle className="text-base md:text-lg text-primary">{title}</CardTitle>
          {description && <CardDescription className="text-xs md:text-sm text-slate-600">{description}</CardDescription>}
        </div>
        {showDownloadButton && (
          <Button size="sm" className="bg-primary text-primary-foreground rounded-full shadow-sm text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">
            <Download className="size-3 md:size-4" />
            Download
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-3 md:p-6 w-full flex-1 min-h-0">
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx={cx}
                cy={cy}
                outerRadius={outerRadius}
                label={labelFormatter}
              >
                {data.map((entry: Record<string, unknown>, index: number) => {
                  const name = entry[nameKey] as string;
                  const entryColor = entry.color ? String(entry.color) : `var(--color-${name})`;
                  const uniqueKey = `${name}-${index}-${entry[dataKey]}`;
                  return <Cell key={uniqueKey} fill={entryColor} />;
                })}
              </Pie>
              {showLegend && <Legend verticalAlign="bottom" height={36} />}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
