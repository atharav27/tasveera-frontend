"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Car, Download, Luggage, Plus, Users } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { BadgeVariant } from "@corpora/ui";
import { DetailCard, type DetailSection } from "@corpora/ui";
import type { TicketDetail } from "@/types/tickets";

import { IssueDetailsCard } from "@/components/support/components/detail/issue-details-card";
import { TicketProgressCard } from "@/components/support/components/detail/ticket-progress-card";
import { mockTicketDetails } from "@/_data/mock-tickets";

const statusClasses: Record<string, string> = {
  open: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

function getSafeTicketId(params: { ticketId?: string | string[] }): string | null {
  const ticketId = Array.isArray(params.ticketId) ? params.ticketId[0] : params.ticketId;
  return typeof ticketId === "string" ? ticketId : null;
}

function getTicketData(ticketId: string | null): TicketDetail | null {
  if (!ticketId) {
    return null;
  }


  return mockTicketDetails[ticketId] ?? null;
}

export default function TicketDetailPage() {
  const params = useParams<{ ticketId?: string | string[] }>();
  const safeTicketId = getSafeTicketId(params);
  const ticket = getTicketData(safeTicketId);

  if (!ticket) {
    const ticketId = Array.isArray(params.ticketId) ? params.ticketId[0] : params.ticketId;
    return (
      <DashboardLayout
        breadcrumbs={[
          { label: "All Tickets", href: "/support" },
          { label: ticketId ?? "Unknown", active: true },
        ]}
      >
        <div className="text-slate-600">Ticket not found.</div>
      </DashboardLayout>
    );
  }

  const statusClass = statusClasses[ticket.status] ?? "bg-slate-100 text-slate-700";
  const statusLabels: Record<string, string> = {
    open: "Open",
    "in-progress": "In-Progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log("Download ticket", ticket.ticketId);
  };

  const sections: DetailSection[] = [
    {
      icon: Car,
      heading: "Vendor Details",
      columns: [
        {
          rows: [
            {
              label: "Vendor Name",
              value: () => (
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-slate-900">{ticket.vendor.name}</span>
                  {ticket.vendor.sla ? (
                    <BadgeVariant
                      text={ticket.vendor.sla}
                      variant="green"
                      size="sm"
                      rounded="full"
                      className="font-normal"
                    />
                  ) : null}
                </div>
              ),
              customRender: true,
            },
            {
              label: "Vehicle Details",
              value: ticket.vendor.vehicleDetails,
            },
          ],
        },
        {
          rows: [
            {
              label: "Driver Name",
              value: ticket.vendor.driverName,
            },
            {
              label: "Contact Number",
              value: ticket.vendor.contactNumber,
            },
          ],
        },
      ],
    },
    {
      icon: Luggage,
      heading: "Trips Details",
      columns: [
        {
          rows: [
            {
              label: "Pickup Location",
              value: ticket.trip.pickupLocation,
            },
            {
              label: "Pickup Time",
              value: ticket.trip.pickupTime,
            },
            {
              label: "Vehicle Class",
              value: ticket.trip.vehicleClass,
            },
          ],
        },
        {
          rows: [
            {
              label: "Drop-off Location",
              value: ticket.trip.dropoffLocation,
            },
            {
              label: "Trip Duration",
              value: ticket.trip.tripDuration,
            },
            {
              label: "Package",
              value: ticket.trip.package,
            },
          ],
        },
      ],
    },
    {
      icon: Users,
      heading: "Passenger Details",
      columns: [
        {
          rows: [
            {
              label: "Passenger Name",
              value: ticket.passenger.name,
            },
            {
              label: "",
              value:
                ticket.passenger.additionalCount && ticket.passenger.additionalCount > 0 ? (
                  <Link
                    href="#"
                    className="text-sm font-medium text-brand-blue-400 hover:underline mt-0.5 flex items-center gap-1"
                  >
                    <Plus className="size-5 text-brand-blue-400" strokeWidth={1.5} /> and {ticket.passenger.additionalCount}{" "}
                    more
                  </Link>
                ) : null,
            },
          ],
        },
        {
          rows: [
            {
              label: "Passenger Type",
              value: ticket.passenger.type,
            },
          ],
        },
      ],
    },
  ];

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "All Tickets", href: "/support" },
        { label: ticket.ticketId, active: true },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <DetailCard
          header={{
            title: ticket.ticketId,
            badge: {
              label: statusLabels[ticket.status] ?? ticket.status,
              className: statusClass,
            },
            subtitle: `Ticket Type: ${ticket.ticketType}`,
            actionButton: {
              label: "Download",
              icon: <Download className="h-4 w-4" />,
              onClick: handleDownload,
            },
          }}
          sections={sections}
        />
        <div className="flex flex-col gap-6">
          <IssueDetailsCard description={ticket.issueDescription} attachments={ticket.attachments} />
          <TicketProgressCard progress={ticket.progress} />
        </div>
      </div>
    </DashboardLayout>
  );
}

