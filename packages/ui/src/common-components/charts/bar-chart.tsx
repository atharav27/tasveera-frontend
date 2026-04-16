"use client";

import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { Button } from "../../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/card";
import { cn } from "../../lib/utils";

import type { BarChartProps } from "./types";

function renderVerticalAxes(xAxisConfig: BarChartProps["xAxisConfig"], yAxisConfig: BarChartProps["yAxisConfig"]) {
  return (
    <>
      <XAxis
        type="number"
        stroke="#9ca3af"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        domain={xAxisConfig?.domain}
        ticks={xAxisConfig?.ticks}
        tickFormatter={xAxisConfig?.tickFormatter}
      />
      <YAxis
        type="category"
        dataKey={yAxisConfig?.dataKey ?? "name"}
        stroke="#9ca3af"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        width={yAxisConfig?.width ?? 120}
      />
    </>
  );
}

function renderHorizontalAxes(xAxisConfig: BarChartProps["xAxisConfig"], yAxisConfig: BarChartProps["yAxisConfig"]) {
  return (
    <>
      <XAxis
        dataKey={xAxisConfig?.dataKey}
        stroke="#9ca3af"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tick={{ fill: "#1e293b" }}
      />
      <YAxis
        stroke="#9ca3af"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        domain={yAxisConfig?.domain}
        ticks={yAxisConfig?.ticks}
        tick={{ fill: "#1e293b" }}
      />
    </>
  );
}

export function BarChartComponent({
  data,
  dataKeys,
  title,
  description,
  showDownloadButton = false,
  xAxisConfig,
  yAxisConfig,
  layout = "horizontal",
  margin,
  useCellColors = false,
  className,
}: BarChartProps) {
  const isVertical = layout === "vertical";
  const defaultMargin = margin ?? { top: 20, right: 30, left: 20, bottom: 5 };

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 pb-3 md:pb-4">
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
            <BarChart data={data} layout={layout} margin={defaultMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              {isVertical ? renderVerticalAxes(xAxisConfig, yAxisConfig) : renderHorizontalAxes(xAxisConfig, yAxisConfig)}
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              {dataKeys.map((key) => {
                if (useCellColors && dataKeys.indexOf(key) === 0) {
                  return (
                    <Bar key={key} dataKey={key} radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]} barSize={32}>
                      {data.map((entry: Record<string, unknown>, cellIndex: number) => {
                        const entryKey = `${key}-${cellIndex}`;
                        const entryColor = entry.color ? String(entry.color) : `var(--color-${key})`;
                        return (
                          <Cell
                            key={entryKey}
                            fill={entryColor}
                          />
                        );
                      })}
                    </Bar>
                  );
                }
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={`var(--color-${key})`}
                    name={key}
                    radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                    barSize={32}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
