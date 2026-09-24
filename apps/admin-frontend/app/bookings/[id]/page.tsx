"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Download, Ticket, AlertCircle, Loader2 } from "lucide-react";

import {
  DetailCard,
  Card,
  CardContent,
  Button,
  Separator,
  FareSummaryCard,
} from "@corpora/ui";

import { DashboardLayout } from "@/components/dashboard-layout";
import { ActionCard } from "@/components/bookings/action-card";
import { CommonAlertDialog } from "@corpora/ui";
import { useBookingDetails } from "@/hooks/use-bookings";
import { createDetailSections } from "@/components/bookings/booking-detail-sections";
import { CreateBookingModal } from "@/components/bookings/create-booking-modal";
import type { BookingDetail } from "@corpora/utils";
import Image from "next/image";

// Fallback Map component since BookingMap might be missing or replaced
const BookingMapPlaceholder = () => (
  <Card className="shadow-sm overflow-hidden h-64 bg-slate-50 border-dashed border-2 flex flex-col items-center justify-center text-slate-400 gap-2">
    <AlertCircle className="h-8 w-8 text-slate-300" />
    <span className="text-sm font-medium">Route Map View Not Available</span>
  </Card>
);

const BOOKING_STATUS_CLASSES: Record<string, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700" },
  requested: { label: "Requested", className: "bg-yellow-100 text-yellow-700" },
  ongoing: { label: "Ongoing", className: "bg-green-100 text-green-700" },
  completed: { label: "Completed", className: "bg-slate-100 text-slate-700" },
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
  vendor_assigned: { label: "Vendor Assigned", className: "bg-purple-100 text-purple-700" },
};

export default function BookingDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Normalized ID from [id] path
  const bookingId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Fetch booking details from API
  const { data: booking, isLoading } = useBookingDetails(bookingId);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Check if coming from create booking flow
  const isNewBooking = searchParams.get("new") === "true";

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout
        breadcrumbs={[
          { label: "Bookings", href: "/bookings" },
          { label: bookingId ?? "Loading...", active: true },
        ]}
      >
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Not found state
  if (!booking) {
    return (
      <DashboardLayout
        breadcrumbs={[
          { label: "Bookings", href: "/bookings" },
          { label: bookingId ?? "Unknown", active: true },
        ]}
      >
        <Card className="w-full">
          <CardContent className="py-20 flex flex-col items-center justify-center text-slate-500 gap-4">
            <AlertCircle className="h-12 w-12 text-slate-300" />
            <p className="text-lg font-medium">Booking not found</p>
            <Button variant="outline" onClick={() => router.push("/bookings")}>
              Back to Bookings
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const statusConfig = BOOKING_STATUS_CLASSES[booking.status] ?? {
    label: booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace(/_/g, " "),
    className: "bg-slate-100 text-slate-700"
  };

  const sections = createDetailSections(booking);
  const canModify = booking.status === "confirmed" || booking.status === "requested" || booking.status === "vendor_assigned";

  const handleDownload = () => {
    console.log("Download booking", booking.id);
  };

  const handleCancelBooking = () => {
    // TODO: Implement cancel booking functionality via API
    console.log("Cancel booking", booking.id);
    setCancelDialogOpen(false);
  };

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Bookings", href: "/bookings" },
        { label: booking.bookingNumber, active: true },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-2 mt-4">
        {/* Left Column: Core Details */}
        <div className="flex flex-col gap-6">
          <DetailCard
            header={{
              title: booking.bookingNumber,
              badge: {
                label: statusConfig.label,
                className: statusConfig.className,
              },
              subtitle: `Ride Type: ${booking.rideType} • ${booking.vehicleClass.replace(/_/g, " ")}`,
              actionButton: {
                label: "Download Receipt",
                icon: <Download className="h-4 w-4" />,
                onClick: handleDownload,
              },
            }}
            sections={sections}
          />
        </div>

        {/* Right Column: Actions and Map */}
        <div className="flex flex-col gap-6">
          <BookingMapPlaceholder />

          {booking.fare && (
            <FareSummaryCard
              title="Fare Summary"
              baseRows={[
                {
                  label: "Base Fare",
                  value: `₹${booking.fare.baseFare.toLocaleString("en-IN")}`,
                },
                {
                  label: "Extra Km Charges",
                  value: `₹${booking.fare.extraKmFare.toLocaleString("en-IN")}`,
                },
                {
                  label: "Tolls & Parking",
                  value: `₹${(booking.fare.tollCharges + booking.fare.parkingCharges).toLocaleString("en-IN")}`,
                },
              ]}
              totalLabel="Total Amount"
              totalValue={`₹${booking.fare.totalAmount.toLocaleString("en-IN")}`}
            />
          )}

          {canModify && (
            <div className="grid grid-cols-1 gap-4">
              <ActionCard
                title="Edit Trip Details"
                description="Minor changes can be made before the trip starts."
                buttonLabel="Edit Trip"
                buttonVariant="outline"
                buttonClassName="text-primary border-primary rounded-full hover:bg-primary/5"
                onClick={() => setEditDialogOpen(true)}
              />
              <ActionCard
                title="Cancel Trip"
                description="Cancellation fees may apply for scheduled bookings."
                buttonLabel="Cancel Trip"
                buttonVariant="outline"
                buttonClassName="bg-red-50 text-red-500 border-red-100 hover:bg-red-100 rounded-full"
                onClick={() => setCancelDialogOpen(true)}
              />
            </div>
          )}

          <ActionCard
            text="Need help with this trip?"
            buttonLabel="Raise Support Ticket"
            buttonVariant="destructive"
            buttonClassName="rounded-full text-sm"
            icon={<Ticket className="mr-2 h-4 w-4" />}
            onClick={() => router.push(`/tickets?bookingId=${booking.id}`)}
          />
        </div>
      </div>

      <CreateBookingModal
        bookingId={booking.id}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <CommonAlertDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        ImageComponent={Image}
        variant="warning"
        title="Confirm Cancellation?"
        subtitle="Cancelling this booking will incur a cancellation fee as it's already scheduled."
        buttons={[
          {
            label: "Yes, Cancel Booking",
            onClick: handleCancelBooking,
            variant: "outline",
            className: "border-red-500 text-red-500 hover:bg-red-50",
          },
          {
            label: "Keep Booking",
            onClick: () => setCancelDialogOpen(false),
            variant: "default",
          },
        ]}
      />
    </DashboardLayout>
  );
}
