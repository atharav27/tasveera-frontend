import type { ReactNode } from "react";
import { Car, Luggage, Plus, Users } from "lucide-react";

import { BadgeVariant } from "../badge/badge-variant";
import type { DetailSection } from "../detail-card/types";
import type { BookingDetail } from "@corpora/utils";

export interface BookingDetailSectionsProps {
  booking: BookingDetail;
  LinkComponent?: React.ComponentType<{ href: string; className?: string; children: ReactNode }>;
}

export function createDetailSections(
  booking: BookingDetail,
  LinkComponent?: React.ComponentType<{ href: string; className?: string; children: ReactNode }>
): DetailSection[] {
  const Link = LinkComponent || (({ href, className, children }: { href: string; className?: string; children: ReactNode }) => (
    <a href={href} className={className}>{children}</a>
  ));

  return [
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
                  <span className="text-base font-medium text-slate-900">{booking.vendor?.name || "—"}</span>
                  {booking.vendor?.status && (
                    <BadgeVariant
                      text={booking.vendor.status}
                      variant="green"
                      size="sm"
                      rounded="full"
                      className="font-normal"
                    />
                  )}
                </div>
              ),
              customRender: true,
            },
            {
              label: "Vehicle Details",
              value: booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model} (${booking.vehicle.registrationNumber})` : "—",
            },
          ],
        },
        {
          rows: [
            {
              label: "Driver Name",
              value: booking.driver ? `${booking.driver.firstName} ${booking.driver.lastName}` : "—",
            },
            {
              label: "Contact Number",
              value: booking.driver?.phone || "—",
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
              value: booking.pickupAddress,
            },
            {
              label: "Pickup Time",
              value: new Date(booking.scheduledPickupTime).toLocaleString(),
            },
            {
              label: "Vehicle Class",
              value: booking.vehicleClass,
            },
          ],
        },
        {
          rows: [
            {
              label: "Drop-off Location",
              value: booking.dropAddress || "—",
            },
            {
              label: "Ride Type",
              value: booking.rideType,
            },
            {
              label: "SLA Status",
              value: booking.slaBreached ? "Breached" : "Compliant",
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
              value: booking.passengers[0]?.name || "—",
            },
            {
              label: "",
              value: booking.passengers.length > 1 ? (
                <Link href="#" className="text-sm font-medium text-brand-blue-400 hover:underline mt-0.5 flex items-center gap-1">
                  <Plus className="size-5 text-brand-blue-400" strokeWidth={1.5} /> and {booking.passengers.length - 1} more
                </Link>
              ) : null,
              customRender: true
            },
          ],
        },
        {
          rows: [
            {
              label: "Passenger Type",
              value: booking.passengers[0]?.passengerType || "—",
            },
          ],
        },
      ],
    },
  ];
}
