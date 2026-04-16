"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@corpora/utils"

export interface BreadcrumbItem {
    label: string
    href?: string
    active?: boolean
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center space-x-2 text-sm", className)}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1
                const isCurrentPage = item.active ?? isLast

                return (
                    <React.Fragment key={index}>
                        {item.href && !isCurrentPage ? (
                            <Link
                                href={item.href}
                                className="text-primary hover:underline transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-slate-700">
                                {item.label}
                            </span>
                        )}
                        {!isLast && (
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                    </React.Fragment>
                )
            })}
        </nav>
    )
}
