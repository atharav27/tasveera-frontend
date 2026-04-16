"use client";

import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Button,
  CommonAlertDialog,
  DialogFooter,
  DialogWrapper,
  FormFileUploadField,
  FormInputField,
  FormSelectField,
  FormTextareaField,
} from "@corpora/ui";
import Image from "next/image";

import { ticketPriorities, ticketTypes, vendorOptions, mockTickets, mockTicketDetails, mockBookingLookup } from "@/_data/mock-tickets";
import { raiseTicketSchema, type RaiseTicketFormData } from "../schemas/raise-ticket-schema";
import type { TicketsTableRow } from "@/lib/tickets-table-mappers";

const TICKET_TYPE_TO_FORM: Record<string, RaiseTicketFormData["ticketType"]> = {
  "Trip Issue": "ride_issue",
  "Billing Issue": "billing_issue",
  "Vendor Issue": "vendor_issue",
  "Compliance Issue": "compliance_issue",
  Custom: "other",
  "Driver Issue": "driver_issue",
  "Technical Support": "system_issue",
};

interface RaiseTicketDialogProps {
  booking?: { bookingNumber: string; vendor?: { name: string } } | null;
  bookingId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId?: string;
  /** When editing from the table, pass the current row so new (non-mock) tickets still prefill. */
  editRow?: TicketsTableRow | null;
  onSuccess?: () => void;
  onTicketCreated?: (row: TicketsTableRow) => void;
  onTicketUpdated?: (id: string, updates: Partial<TicketsTableRow>) => void;
}

export function RaiseTicketDialog({
  booking,
  bookingId,
  open,
  onOpenChange,
  ticketId,
  editRow,
  onSuccess,
  onTicketCreated,
  onTicketUpdated,
}: RaiseTicketDialogProps) {
  const isEdit = !!ticketId;

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [createdTicketNumber, setCreatedTicketNumber] = useState<string>("");

  const editContext = useMemo(() => {
    if (!ticketId) return null;
    const row = mockTickets.find((t) => t.id === ticketId);
    if (!row) return null;
    const detail = mockTicketDetails[row.ticketId];
    return { row, detail };
  }, [ticketId]);

  const bookingFromLookup = useMemo(() => {
    if (!bookingId || !open || booking) return null;
    const hit = mockBookingLookup[bookingId];
    if (!hit) return null;
    return { bookingNumber: hit.bookingNumber, vendor: { name: hit.vendorName } };
  }, [bookingId, booking, open]);

  const activeBooking = booking || bookingFromLookup;

  const form = useForm<RaiseTicketFormData>({
    resolver: zodResolver(raiseTicketSchema),
    defaultValues: {
      bookingId: "",
      vendor: "",
      subject: "",
      ticketType: undefined,
      description: "",
      attachments: [],
      priority: "medium",
    },
  });

  useEffect(() => {
    if (activeBooking && open && !isEdit) {
      form.reset({
        bookingId: activeBooking.bookingNumber,
        vendor: activeBooking.vendor?.name ?? "",
        subject: `Issue with Trip ${activeBooking.bookingNumber}`,
        ticketType: undefined,
        description: "",
        attachments: [],
        priority: "medium",
      });
    } else if (isEdit && open && (editRow || editContext)) {
      if (editRow) {
        form.reset({
          bookingId: editRow.linkedBooking.bookingNumber,
          vendor: editRow.vendorId,
          subject: editRow.subject,
          ticketType: editRow.category as RaiseTicketFormData["ticketType"],
          description: editRow.description,
          attachments: [],
          priority: editRow.priority as RaiseTicketFormData["priority"],
        });
        return;
      }
      if (editContext) {
        const { row, detail } = editContext;
        const ticketType =
          TICKET_TYPE_TO_FORM[row.ticketType] ??
          (detail?.ticketType ? TICKET_TYPE_TO_FORM[detail.ticketType] : undefined) ??
          "other";
        const vendorName = detail?.vendor?.name ?? row.vendor;
        form.reset({
          bookingId: row.bookingId,
          vendor: vendorName,
          subject: detail?.subject ?? row.subject,
          ticketType,
          description: detail?.description ?? row.description,
          attachments: [],
          priority: (row.priority === "urgent" ? "critical" : row.priority) as RaiseTicketFormData["priority"],
        });
      }
    }
  }, [activeBooking, open, form, isEdit, editContext, editRow]);

  const onSubmit = async (data: RaiseTicketFormData) => {
    await new Promise((r) => setTimeout(r, 400));
    try {
      if (isEdit && ticketId) {
        onTicketUpdated?.(ticketId, {
          category: data.ticketType,
          priority: data.priority ?? "medium",
          subject: data.subject,
          description: data.description,
          vendorId: data.vendor || editRow?.vendorId || "",
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        const stamp = Date.now();
        const ticketNumber = `TKT-${new Date().getFullYear()}-${String(stamp).slice(-6)}`;
        const newId = `new-${stamp}`;
        const newTicketId = `DIS-${String(stamp).slice(-4)}-${String(stamp).slice(-8, -4)}`;
        const vendorName =
          data.vendor ||
          activeBooking?.vendor?.name ||
          vendorOptions[0]?.label ||
          "—";

        const row: TicketsTableRow = {
          id: newId,
          ticketId: newTicketId,
          ticketNumber,
          category: data.ticketType,
          priority: data.priority ?? "medium",
          subject: data.subject,
          description: data.description,
          linkedBooking: {
            id: data.bookingId || "—",
            bookingNumber: data.bookingId || "—",
            status: "confirmed",
            scheduledPickupTime: new Date().toISOString(),
          },
          vendorId: vendorName,
          createdAt: new Date().toISOString(),
          status: "open",
        };

        onTicketCreated?.(row);
        setCreatedTicketNumber(ticketNumber);
        onOpenChange(false);
        setSuccessDialogOpen(true);
        onSuccess?.();
      }
      form.reset();
    } catch (error) {
      console.error("Ticket operation failed:", error);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const formContent = (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {activeBooking ? (
            <FormInputField
              control={form.control}
              name="bookingId"
              label="Booking ID"
              readOnly
            />
          ) : (
            <FormInputField
              control={form.control}
              name="bookingId"
              label="Booking ID"
              placeholder="Enter Booking ID"
            />
          )}

          {activeBooking ? (
            <FormInputField
              control={form.control}
              name="vendor"
              label="Vendor"
              readOnly
            />
          ) : (
            <FormSelectField
              control={form.control}
              name="vendor"
              label="Vendor"
              placeholder="Select Vendor"
              options={vendorOptions}
            />
          )}
        </div>
        <FormInputField
          control={form.control}
          name="subject"
          label="Subject"
          placeholder="Summary of the issue"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormSelectField
            control={form.control}
            name="ticketType"
            label="Ticket Type"
            placeholder="Select ticket type"
            options={ticketTypes}
            showDescription
          />
          <FormSelectField
            control={form.control}
            name="priority"
            label="Priority"
            placeholder="Select priority"
            options={ticketPriorities}
          />
        </div>
        <FormTextareaField
          control={form.control}
          name="description"
          label="Description"
          placeholder="Please explain the issue clearly, including relevant details like time, vendor, or incorrect charges."
        />
        <FormFileUploadField
          control={form.control}
          name="attachments"
          label="Attachments"
        />
      </div>
      <DialogFooter className="flex-row gap-3">
        <Button type="button" variant="outline" onClick={handleCancel} className="w-1/2">
          Cancel
        </Button>
        <Button type="submit" className="w-1/2">
          {isEdit ? "Update Ticket" : "Submit Ticket"}
        </Button>
      </DialogFooter>
    </form>
  );

  const editTitleTicketNo =
    editRow?.ticketNumber ?? editContext?.detail?.ticketNumber ?? editContext?.row.ticketNumber;

  return (
    <>
      <DialogWrapper
        open={open}
        onOpenChange={onOpenChange}
        title={isEdit ? "Edit Ticket" : "Raise a Ticket"}
        description={isEdit ? `Update details for ticket ${editTitleTicketNo}` : "Report an issue related to a Trip, invoice, vendor, or compliance record"}
        content={<div className="relative">{formContent}</div>}
        className=" md:max-w-xl"
        showCloseButton={true}
      />
      <CommonAlertDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        ImageComponent={Image}
        variant="success"
        title="Ticket Created!!"
        subtitle={`Ticket ${createdTicketNumber || "N/A"} has been raised. You'll be updated once the corpora team responds.`}
      />
    </>
  );
}
