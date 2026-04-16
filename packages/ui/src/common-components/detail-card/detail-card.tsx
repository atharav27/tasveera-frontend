"use client";

import type { ReactNode } from "react";

import { SectionHeader } from "./section-header";
import { Badge } from "@corpora/ui";
import { Button } from "@corpora/ui";
import { Card, CardContent } from "@corpora/ui";
import { Separator } from "@corpora/ui";
import { cn } from "@corpora/ui";

import type { DetailCardProps, DetailRow } from "./types";

function renderDetailValue(row: DetailRow): ReactNode {
  if (row.customRender && typeof row.value === "function") {
    return row.value({ label: row.label });
  }

  if (typeof row.value === "string") {
    return row.value || "—";
  }

  if (typeof row.value === "function") {
    // If it's a function but customRender is false, return a fallback
    return "—";
  }

  return row.value;
}

function DetailRowComponent({ row }: { row: DetailRow }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-medium text-slate-500">{row.label}</p>
      <div className="mt-0.5 text-sm md:text-base font-medium text-slate-900">{renderDetailValue(row)}</div>
    </div>
  );
}

export function DetailCard({ header, sections, className }: DetailCardProps) {
  return (
    <Card className={cn("shadow-sm px-0!", className)}>
      <CardContent className="flex flex-col p-4 md:p-8">
        {header && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
              <div>
                <div className="flex items-center gap-2 md:gap-3">
                  <h1 className="text-xl md:text-2xl font-medium text-slate-900">{header.title}</h1>
                  {header.badge && (
                    <Badge className={cn("rounded-full px-3 py-1 text-xs font-medium", header.badge.className)}>
                      {header.badge.label}
                    </Badge>
                  )}
                </div>
                {header.subtitle && <p className="text-sm md:text-base text-slate-600">{header.subtitle}</p>}
              </div>
              {header.actionButton && (
                <Button
                  className="rounded-full bg-primary px-6! py-3 text-sm font-medium text-white cursor-pointer"
                  onClick={header.actionButton.onClick}
                >
                  {header.actionButton.icon}
                  {header.actionButton.label}
                </Button>
              )}
            </div>
            <Separator className="my-4 md:my-6" />
          </>
        )}

        {sections.map((section, sectionIndex) => {
          const IconComponent = section.icon;
          const isLastSection = sectionIndex === sections.length - 1;
          const hasSingleColumn = section.columns.length === 1;

          return (
            <div key={sectionIndex}>
              <div className="flex flex-col  ">
                <SectionHeader icon={IconComponent} variant="semibold" iconSize="sm" className="pb-4 md:pb-6">
                  {section.heading}
                </SectionHeader>
                <div
                  className={cn(
                    "grid gap-x-4 md:gap-x-38 gap-y-2 md:gap-y-3",
                    hasSingleColumn ? "grid-cols-1" : "grid-cols-2",
                  )}
                >
                  {section.columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="flex flex-col gap-2 md:gap-3 space-y-3 md:space-y-4">
                      {column.rows.map((row, rowIndex) => (
                        <DetailRowComponent key={rowIndex} row={row} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {!isLastSection && <Separator className="my-4 md:my-6" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

