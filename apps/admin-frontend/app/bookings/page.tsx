"use client";

import { StatCard, TableTopBar } from "@corpora/ui"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Loader2, Download, Plus } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { BookingsTable } from "@/components/bookings/bookings-table"
import { CreateBookingModal } from "@/components/bookings/create-booking-modal"
import { useBookings } from "@/hooks/use-bookings"
import { useBookingStats } from "@/hooks/use-booking-stats"
import type { BookingStatus } from "@corpora/utils"
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs"
import { useDateFilterStore } from "@corpora/utils"
import { formatTrend } from "@/lib/stat-helpers"

export default function BookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<{ id: string } | null>(
    null,
  );

  const { getDateRange } = useDateFilterStore();
  const dateRange = getDateRange();

  const { stats, isLoading: statsLoading } = useBookingStats({
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
  });

  const [query] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    status: parseAsString,
  });

  const queryParams = useMemo(
    () => ({
      page: query.page,
      pageSize: query.perPage,
      status: (query.status as BookingStatus) || undefined,
      includePassengers: true,
      includeVendor: true,
      includeFare: true,
    }),
    [query.page, query.perPage, query.status],
  );

  const { bookings, meta, isLoading, error } = useBookings(queryParams);

    const statCards = useMemo(() => {
        return [
            {
                title: "Total Trips",
                value: stats.totalTrips.toLocaleString(),
                trend: formatTrend(stats.comparison.totalTrips.change, stats.comparison.totalTrips.percentage, { label: "from previous period" }),
            },
            {
                title: "Completed Trips",
                value: stats.completedTrips.toLocaleString(),
                trend: formatTrend(stats.comparison.completedTrips.change, stats.comparison.completedTrips.percentage, { label: "from previous period" }),
            },
            {
                title: "Active Trips",
                value: stats.activeTrips.toLocaleString(),
                trend: formatTrend(stats.comparison.activeTrips.change, stats.comparison.activeTrips.percentage, { label: "from previous period" }),
            },
            {
                title: "Upcoming Trips",
                value: stats.upcomingTrips.toLocaleString(),
                trend: formatTrend(stats.comparison.upcomingTrips.change, stats.comparison.upcomingTrips.percentage, { label: "from previous period" }),
            },
        ];
    }, [stats]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  return (
    <DashboardLayout
      title="Bookings"
      subtitle="Overview of your corporate travel operations"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="rounded-2xl sm:rounded-3xl border-none bg-card shadow-sm dark:bg-zinc-900/50 p-4 sm:p-8 max-w-full overflow-hidden">
        <TableTopBar
          title="All Bookings"
          subtitle="View, add, and download booking reports in one place"
          buttons={[
            {
              text: "Download Report",
              icon: <Download className="size-4" />,
              variant: "outline",
              className: "bg-white border-primary text-primary",
              onClick: () => console.log("Download report"),
            },
            {
              text: "New Booking",
              icon: <Plus className="size-4" />,
              className: "bg-primary text-white hover:bg-primary/90",
              onClick: () => setIsCreateModalOpen(true),
            },
          ]}
          className="mb-8"
        />

                {error ? (

                    <div className="flex items-center justify-center h-64 text-red-500">
                        Error loading bookings: {error.message}
                    </div>
                ) : (
                    <BookingsTable
                        data={bookings}
                        pageCount={meta?.totalPages || 0}
                        onEdit={(booking) => {
                            setEditingBooking(booking);
                            setIsCreateModalOpen(true);
                        }}
                    />
                )}
            </div>

      <CreateBookingModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) setEditingBooking(null);
        }}
        bookingId={editingBooking?.id}
      />
    </DashboardLayout>
  );
}
