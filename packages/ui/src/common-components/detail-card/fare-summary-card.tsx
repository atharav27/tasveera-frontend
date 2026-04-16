"use client";

import { BadgeIndianRupee, CreditCard } from "lucide-react";
import { Card, CardContent } from "../../components/card";
import { Separator } from "../../components/separator";

export interface FareSummaryRow {
  label: string;
  value: string;
}

export interface FareSummaryCardProps {
  /** Card title (e.g., "Fare Summary" or "Estimated Fare Summary") */
  title: string;
  /** Base fare rows shown at the top */
  baseRows: FareSummaryRow[];
  /** Optional label for add-on section (e.g., "Add-on Expenses") */
  addOnLabel?: string;
  /** Optional add-on expense rows */
  addOnRows?: FareSummaryRow[];
  /** Label for the total row */
  totalLabel: string;
  /** Formatted total value (e.g., "₹2,500") */
  totalValue: string;
}

export function FareSummaryCard({
  title,
  baseRows,
  addOnLabel,
  addOnRows,
  totalLabel,
  totalValue,
}: FareSummaryCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4 text-brand-blue-400">
          <BadgeIndianRupee className="h-5 w-5 text-brand-blue-400" strokeWidth={1.5} />
          <h3 className="font-semibold text-base">{title}</h3>
        </div>
        <div className="space-y-3">
          {/* Base Fare Rows */}
          {baseRows.map((row, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-slate-600">{row.label}</span>
              <span className="font-medium text-slate-900">{row.value}</span>
            </div>
          ))}

          {/* Add-on Section (optional) */}
          {addOnLabel && addOnRows && addOnRows.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="text-sm font-medium text-slate-700">{addOnLabel}</div>
              {addOnRows.map((row, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-slate-600">{row.label}</span>
                  <span className="font-medium text-slate-900">{row.value}</span>
                </div>
              ))}
            </>
          )}

          {/* Total Row */}
          <Separator className="my-2" />
          <div className="flex justify-between text-base font-medium">
            <span className="text-slate-900">{totalLabel}</span>
            <span className="text-brand-blue-400">{totalValue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
