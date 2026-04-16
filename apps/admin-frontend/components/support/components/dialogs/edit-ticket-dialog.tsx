"use client";

import { useEffect, useState } from "react";

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
import type { Ticket, TicketDetail } from "@/types/tickets";

import { ticketTypes, vendorOptions, mockTicketDetails } from "@/_data/mock-tickets";
import { editTicketSchema, type EditTicketFormData } from "../schemas/edit-ticket-schema";
import Image from "next/image";

interface EditTicketDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTicketDialog({ ticket, open, onOpenChange }: EditTicketDialogProps) {
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const form = useForm<EditTicketFormData>({
    resolver: zodResolver(editTicketSchema),
    defaultValues: {
      bookingId: "",
      vendor: "",
      ticketType: "",
      description: "",
      attachments: [],
    },
  });

  // Pre-populate form when ticket changes
  useEffect(() => {
    if (!ticket || !open) {
      return;
    }

    // Fetch TicketDetail for full ticket data
    const ticketDetail: TicketDetail | undefined = mockTicketDetails[ticket.ticketId];

    if (ticketDetail) {
      form.reset({
        bookingId: ticketDetail.bookingId,
        vendor: ticketDetail.vendor.name,
        ticketType: ticketDetail.ticketType,
        description: ticketDetail.description,
        attachments: [],
      });
    } else {
      // Fallback to basic ticket data
      form.reset({
        bookingId: ticket.bookingId,
        vendor: ticket.vendor,
        ticketType: ticket.ticketType,
        description: ticket.description,
        attachments: [],
      });
    }
  }, [ticket, open, form]);

  const onSubmit = (data: EditTicketFormData) => {
    console.log("Edit Ticket Data:", data);
    // Close the edit dialog
    onOpenChange(false);
    // Open the success dialog
    setSuccessDialogOpen(true);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const formContent = (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-0">
          <FormInputField
            control={form.control}
            name="bookingId"
            label="Booking ID"
            placeholder="Enter booking ID"
          />
          <FormSelectField
            control={form.control}
            name="vendor"
            label="Vendor"
            placeholder="Select vendor"
            options={vendorOptions}
          />
        </div>
        <FormSelectField
          control={form.control}
          name="ticketType"
          label="Ticket Type"
          placeholder="Select ticket type"
          options={ticketTypes}
          showDescription
        />
        <FormTextareaField
          control={form.control}
          name="description"
          label="Description"
          placeholder="Please explain the issue clearly, including relevant details like time, vendor, or incorrect charges."
          className="[word-break:break-word] whitespace-normal"
        />
        <FormFileUploadField
          control={form.control}
          name="attachments"
          label="Attachments"
        />
      </div>
      <DialogFooter className="flex-row gap-3">
        <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Submit Ticket
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <>
      <DialogWrapper
        open={open}
        onOpenChange={onOpenChange}
        title="Edit Ticket"
        description="Report an issue related to a Trip, invoice, vendor, or compliance record."
        content={formContent}
        className=" md:max-w-xl"
        showCloseButton={true}
      />
      <CommonAlertDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        ImageComponent={Image}
        variant="success"
        title="Ticket Updated Successfully!!"
        subtitle={`Ticket ${ticket?.ticketId ?? "DISP-9987-7778"} has been updated with the latest details.`}
      />
    </>
  );
}

