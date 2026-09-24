"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  StatCard,
  TableTopBar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  SearchFilter,
  CommonAlertDialog,
} from "@corpora/ui";
import { Download } from "lucide-react";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { OrdersTable } from "@/components/orders/orders-table";
import { MOCK_ORDERS, ORDER_STATS, Order } from "@/components/orders/mock-data";
import Image from "next/image";

export default function OrdersListPage() {
  const searchParams = useSearchParams();
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        activeStatus === "all" || order.status === activeStatus;
      return matchesStatus;
    });
  }, [orders, activeStatus]);

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setIsDeleting(null);
  };

  const handleExport = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeStatus !== "all") {
      params.set("status", activeStatus);
    }
    const exportUrl = `/api/v1/admin/orders/export?${params.toString()}`;
    console.log("Exporting CSV with filters:", Object.fromEntries(params.entries()));
    // In real app: router.push(exportUrl) or window.location.href = exportUrl;
  };

  const statCards = [
    { title: "Pending", value: ORDER_STATS.PENDING.toString(), trend: { value: "0%", label: "from yesterday", type: "neutral" as const } },
    { title: "Paid", value: ORDER_STATS.PAID.toString(), trend: { value: "0%", label: "from yesterday", type: "neutral" as const } },
    { title: "Processing", value: ORDER_STATS.PROCESSING.toString(), trend: { value: "0%", label: "from yesterday", type: "neutral" as const } },
    { title: "Shipped", value: ORDER_STATS.SHIPPED.toString(), trend: { value: "0%", label: "from yesterday", type: "neutral" as const } },
    { title: "Delivered", value: ORDER_STATS.DELIVERED.toString(), trend: { value: "0%", label: "from yesterday", type: "neutral" as const } },
    { title: "Cancelled", value: ORDER_STATS.CANCELLED.toString(), trend: { value: "0%", label: "from yesterday", type: "neutral" as const } },
  ];

  const statuses = [
    "all",
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <DashboardLayout
      title="Orders"
      subtitle="Manage and track customer orders"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
          />
        ))}
      </div>

      <div className="rounded-2xl bg-card shadow-sm p-8">
        <TableTopBar
          title="Orders List"
          subtitle="View and manage all customer orders"
          buttons={[
            {
              text: "Export CSV",
              icon: <Download className="size-4" />,
              variant: "outline",
              className: "rounded-full h-11 px-6 bg-white border-primary text-primary hover:bg-primary/5",
              onClick: handleExport,
            },
          ]}
          className="mb-8"
        />

        <div className="flex flex-col gap-8">
          <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
            <div className="border-b border-border pb-px overflow-x-auto">
              <TabsList className="bg-transparent w-full justify-start rounded-none h-auto p-0 gap-8">
                {statuses.map((status) => (
                  <TabsTrigger 
                    key={status} 
                    value={status} 
                    className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-sm font-medium h-auto"
                  >
                    {status.toLowerCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>

          <OrdersTable
            data={filteredOrders}
            pageCount={1}
            onDelete={(id) => setIsDeleting(id)}
          />
        </div>
      </div>

      <CommonAlertDialog
        open={!!isDeleting}
        onOpenChange={(open) => !open && setIsDeleting(null)}
        title="Delete Order"
        subtitle="Are you sure you want to delete this order? This action is reversible as it is a soft delete."
        variant="error"
        ImageComponent={Image}
        buttons={[
          {
            label: "Cancel",
            onClick: () => setIsDeleting(null),
            variant: "outline",
          },
          {
            label: "Delete",
            onClick: () => isDeleting && handleDelete(isDeleting),
            variant: "destructive",
          },
        ]}
      />
    </DashboardLayout>
  );
}
