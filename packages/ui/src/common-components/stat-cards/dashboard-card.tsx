"use client"

import * as React from "react"
import Link from "next/link"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@corpora/ui"
import { BadgeVariant } from "@corpora/ui"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: string
        label: string
        type: "positive" | "negative" | "neutral"
    }
    href?: string
}

export function DashboardStatCard({
    title,
    value,
    icon: Icon,
    trend,
    href = "#",
}: StatCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="relative pt-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-3xl text-slate-900 font-medium">{value}</p>
                        <p className="text-base text-slate-600 font-normal">{title}</p>
                        {trend && (
                            <div className="mt-4 flex items-center gap-2">
                                <BadgeVariant
                                    variant={trend.type === "positive" ? "green" : trend.type === "negative" ? "red" : "neutral"}
                                    size="sm"
                                    rounded="default"
                                    icon={
                                        trend.type === "positive" ? (
                                            <TrendingUp className="size-3.5" />
                                        ) : trend.type === "negative" ? (
                                            <TrendingDown className="size-3.5" />
                                        ) : null
                                    }
                                    className="font-medium"
                                >
                                    {trend.value}
                                </BadgeVariant>
                            </div>
                        )}
                    </div>
                    <div className="bg-white absolute -top-3 right-3 flex size-14 items-center justify-center rounded-full border border-brand-blue-base">
                        <Icon className="text-primary size-6" strokeWidth={1.5} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {trend && (
                        <p className="text-sm text-slate-600 font-normal">{trend.label}</p>
                    )}
                    <Link
                        href={href}
                        className="text-slate-900 hover:text-primary/80 inline-flex text-xs font-medium underline ml-auto"
                    >
                        View More
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
