"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { 
    ChevronLeft, 
    Download, 
    RefreshCw, 
    Truck, 
    CheckCircle, 
    Trash2,
    ImageIcon,
    ExternalLink
} from "lucide-react";
import Image from "next/image";

import {
  DashboardLayout,
} from "@/components/dashboard-layout";
import {
  DetailCard,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  CommonAlertDialog,
} from "@corpora/ui";

import { MOCK_ORDERS, Order } from "@/components/orders/mock-data";
import { createOrderDetailSections, createOrderSummarySections } from "@/components/orders/order-detail-sections";
import { UpdateStatusDialog } from "@/components/orders/dialogs/update-status-dialog";
import { UpdateShippingDialog } from "@/components/orders/dialogs/update-shipping-dialog";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | undefined>(
    MOCK_ORDERS.find((o) => o.id === orderId)
  );

  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isUpdateShippingOpen, setIsUpdateShippingOpen] = useState(false);
  const [isDeliveredConfirmOpen, setIsDeliveredConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!order) {
    return (
      <DashboardLayout title="Order Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-muted-foreground mb-4">The order you are looking for does not exist.</p>
          <Button onClick={() => router.push("/orders")}>Back to Orders</Button>
        </div>
      </DashboardLayout>
    );
  }

  const sections = createOrderDetailSections(order);
  const summarySections = createOrderSummarySections(order);

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    PAID: "bg-green-100 text-green-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-slate-100 text-slate-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const handleUpdateStatus = (newStatus: string) => {
    setOrder(prev => prev ? { ...prev, status: newStatus as any } : prev);
    setIsUpdateStatusOpen(false);
  };

  const handleUpdateShipping = (data: { courier: string; awbNumber: string }) => {
    setOrder(prev => prev ? { 
        ...prev, 
        courier: data.courier, 
        awbNumber: data.awbNumber, 
        status: "SHIPPED",
        shippedAt: new Date().toISOString()
    } : prev);
    setIsUpdateShippingOpen(false);
  };

  const handleMarkDelivered = () => {
    setOrder(prev => prev ? { 
        ...prev, 
        status: "DELIVERED",
        deliveredAt: new Date().toISOString()
    } : prev);
    setIsDeliveredConfirmOpen(false);
  };

  return (
    <DashboardLayout
      title={`Order ${order.orderNumber}`}
      subtitle={`View and manage details for order ${order.orderNumber}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/orders")}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Orders
        </Button>

        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Download Invoice
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <DetailCard
            header={{
              title: order.orderNumber,
              subtitle: `Created on ${new Date(order.createdAt).toLocaleDateString()}`,
              badge: {
                label: order.status,
                className: statusColors[order.status] || "bg-slate-100",
              },
            }}
            sections={sections}
          />

          {/* Images Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" /> Product & Reference Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Item Images (by slot)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {order.images.map((img, i) => (
                        <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                          <Image src={img.url} alt={img.slot} fill className="object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2">
                            <p className="text-[10px] text-white font-medium text-center">{img.slot}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.referenceImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Reference Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {order.referenceImages.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                          <Image src={img} alt="Reference" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.hamperSelections.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Hamper Selections</h4>
                    <div className="flex flex-wrap gap-2">
                      {order.hamperSelections.map((item, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {!order.images.length && !order.referenceImages.length && !order.hamperSelections.length && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">No additional images or hamper selections for this order.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions & Summary */}
        <div className="space-y-6">
          <DetailCard sections={summarySections} />

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start gap-3 bg-white" 
                onClick={() => setIsUpdateStatusOpen(true)}
              >
                <RefreshCw className="h-4 w-4" /> Update Status
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start gap-3 bg-white"
                onClick={() => setIsUpdateShippingOpen(true)}
              >
                <Truck className="h-4 w-4" /> Add Shipping Info
              </Button>

              <Button 
                variant="default" 
                className="justify-start gap-3"
                disabled={order.status !== "SHIPPED"}
                onClick={() => setIsDeliveredConfirmOpen(true)}
              >
                <CheckCircle className="h-4 w-4" /> Mark as Delivered
              </Button>

              <div className="pt-2 border-t mt-2">
                <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                >
                    <Trash2 className="h-4 w-4" /> Delete Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <UpdateStatusDialog
        open={isUpdateStatusOpen}
        onOpenChange={setIsUpdateStatusOpen}
        currentStatus={order.status}
        onUpdate={handleUpdateStatus}
      />

      <UpdateShippingDialog
        open={isUpdateShippingOpen}
        onOpenChange={setIsUpdateShippingOpen}
        initialData={{ courier: order.courier, awbNumber: order.awbNumber }}
        onUpdate={handleUpdateShipping}
      />

      <CommonAlertDialog
        open={isDeliveredConfirmOpen}
        onOpenChange={setIsDeliveredConfirmOpen}
        title="Mark as Delivered?"
        subtitle="This will confirm that the customer has received the order. This action will update the delivery timestamp."
        variant="warning"
        ImageComponent={Image}
        buttons={[
          { label: "Cancel", onClick: () => setIsDeliveredConfirmOpen(false), variant: "outline" },
          { label: "Confirm Delivery", onClick: handleMarkDelivered, variant: "default" }
        ]}
      />

      <CommonAlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Order"
        subtitle="Are you sure you want to delete this order? This will be a soft delete."
        variant="error"
        ImageComponent={Image}
        buttons={[
          { label: "Cancel", onClick: () => setIsDeleteConfirmOpen(false), variant: "outline" },
          { label: "Delete Permanently", onClick: () => router.push("/orders"), variant: "destructive" }
        ]}
      />
    </DashboardLayout>
  );
}
