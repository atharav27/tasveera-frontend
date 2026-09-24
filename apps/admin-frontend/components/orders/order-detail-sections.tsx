import { User, MapPin, Package, Image as ImageIcon, Sparkles, CreditCard, Truck } from "lucide-react";
import { Order, OrderItem } from "./mock-data";
import { DetailSection } from "@corpora/ui";
import Image from "next/image";

export function createOrderDetailSections(order: Order): DetailSection[] {
  return [
    {
      icon: User,
      heading: "Customer Details",
      columns: [
        {
          rows: [
            { label: "Name", value: order.customerName },
            { label: "Email", value: order.email },
            { label: "Phone", value: order.phone },
          ],
        },
        {
          rows: [
            {
              label: "Shipping Address",
              value: (
                <div className="flex flex-col text-sm">
                  <span>{order.address.street}</span>
                  <span>{`${order.address.city}, ${order.address.state} ${order.address.zipCode}`}</span>
                  <span>{order.address.country}</span>
                </div>
              ),
            },
          ],
        },
      ],
    },
    {
      icon: Truck,
      heading: "Shipping Information",
      columns: [
        {
          rows: [
            { label: "Courier", value: order.courier || "Not Assigned" },
            { label: "AWB Number", value: order.awbNumber || "Not Generated" },
          ],
        },
        {
          rows: [
            { label: "Shipped At", value: order.shippedAt ? new Date(order.shippedAt).toLocaleString() : "-" },
            { label: "Delivered At", value: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : "-" },
          ],
        },
      ],
    },
    {
      icon: Package,
      heading: "Order Items",
      columns: [
        {
          rows: order.items.map((item) => ({
            label: item.productName,
            value: (
              <div className="flex items-start gap-4 py-2 border-b last:border-0 w-full" key={item.id}>
                <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0 border">
                  <Image src={item.image} alt={item.productName} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.productName} x {item.quantity}</span>
                    <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                  {item.designInfo && (
                    <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> {item.designInfo}
                    </span>
                  )}
                  {item.customizationNotes && (
                    <span className="text-xs text-zinc-500 italic mt-1 bg-zinc-50 p-1.5 rounded">
                      Note: {item.customizationNotes}
                    </span>
                  )}
                </div>
              </div>
            ),
            customRender: true
          })),
        },
      ],
    },
  ];
}

export function createOrderSummarySections(order: Order): DetailSection[] {
    return [
        {
            icon: CreditCard,
            heading: "Financial Summary",
            columns: [
                {
                    rows: [
                        { label: "Subtotal", value: `₹${order.subtotal.toLocaleString()}` },
                        { label: "Shipping Fee", value: `₹${order.shippingFee.toLocaleString()}` },
                        { label: "Discount", value: `-₹${order.discount.toLocaleString()}` },
                        { 
                            label: "Total Amount", 
                            value: (
                                <span className="text-lg font-bold text-primary">
                                    ₹{order.totalAmount.toLocaleString()}
                                </span>
                            ) 
                        },
                    ]
                },
                {
                    rows: [
                        { label: "Payment Status", value: order.paymentStatus },
                        { label: "Ordered On", value: new Date(order.createdAt).toLocaleString() },
                    ]
                }
            ]
        }
    ]
}
