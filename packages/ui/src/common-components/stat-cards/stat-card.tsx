"use client"

import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@corpora/ui"
import { BadgeVariant } from "@corpora/ui"

interface StatCardProps {
    title: string
    value: string | number
    trend: {
        value: string
        label: string
        type: "positive" | "negative" | "neutral"
    }
}

export function StatCard({ title, value, trend }: StatCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="py-1">
                <h3 className="text-slate-600 text-base font-normal h-3">{title}</h3>
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-3xl text-slate-900 font-medium">{value}</p>
                    </div>
                    <div className="mt-4 gap-0 flex flex-col items-end">
                        <BadgeVariant
                            variant={
                                trend.type === "positive" 
                                    ? "green" 
                                    : trend.type === "negative" 
                                    ? "red" 
                                    : "neutral"
                            }
                            size="md"
                            rounded="default"
                            icon={
                                trend.type === "positive" ? (
                                    <TrendingUp className="size-3" />
                                ) : trend.type === "negative" ? (
                                    <TrendingDown className="size-3" />
                                ) : null
                            }
                            className="font-medium"
                        >
                            {trend.value}
                        </BadgeVariant>
                        <p className="text-slate-600 text-sm font-normal">{trend.label}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
