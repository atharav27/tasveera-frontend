"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@corpora/ui";
import { useDashboardApi } from "@/hooks/use-dashboard-api";

interface TopProduct {
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
}

interface TopProductsResponse {
    data: TopProduct[];
}

function formatRevenue(val: number) {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
}

function SkeletonRows() {
    return (
        <div className="animate-pulse space-y-3 px-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="h-4 bg-muted rounded flex-1" />
                    <div className="h-4 bg-muted rounded w-16" />
                    <div className="h-4 bg-muted rounded w-20" />
                </div>
            ))}
        </div>
    );
}

export function TopProductsTable() {
    const { data, isLoading, error } = useDashboardApi<TopProductsResponse>(
        "/api/v1/admin/dashboard/top-products"
    );

    const products = data?.data ?? [];

    return (
        <Card className="col-span-1 flex flex-col h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold tracking-tight">
                    🏆 Top Products
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Best performing products by revenue
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4 pt-0">
                {isLoading ? (
                    <SkeletonRows />
                ) : error ? (
                    <p className="text-sm text-destructive py-4">
                        Failed to load top products
                    </p>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                        <span className="text-3xl">📦</span>
                        <p className="text-sm">No products data available</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Units Sold</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.slice(0, 10).map((product, index) => (
                                <TableRow key={product.productId}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground text-xs w-5 shrink-0">
                                                {index + 1}.
                                            </span>
                                            {product.productName}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {product.unitsSold.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-primary">
                                        {formatRevenue(product.revenue)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
