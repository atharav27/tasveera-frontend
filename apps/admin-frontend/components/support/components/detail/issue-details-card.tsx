import { AlertTriangle, Check, Dot, FileText } from "lucide-react";

import { SectionHeader } from "@corpora/ui";
import { Card, CardContent, CardHeader } from "@corpora/ui";
import type { TicketAttachment } from "@/types/tickets";

interface IssueDetailsCardProps {
  description: string;
  attachments: TicketAttachment[];
}

function AttachmentItem({ attachment }: { attachment: TicketAttachment }) {
  return (
    <div className="space-y-2 rounded-lg border bg-white p-5">
      <div className="flex items-center gap-2">
        <FileText className="size-5 text-slate-900" strokeWidth={1.5} />
        <p className="text-sm font-medium text-slate-900">{attachment.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center"><p className="text-xs text-slate-400">{attachment.size}</p>
          <Dot className="text-slate-400" />
        </div>
        {attachment.status === "Uploaded" && (
          <div className="text-xs border-0  bg-transparent flex items-center">
            <Check className="size-4 bg-green-100 rounded-full p-1 font-normal " />
            <p className="ml-1 text-green-600">Uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function IssueDetailsCard({ description, attachments }: IssueDetailsCardProps) {
  return (
    <Card className="shadow-sm p-4 md:p-8">
      <CardHeader className="px-0">
        <SectionHeader icon={AlertTriangle} iconSize="md">Issue Details</SectionHeader>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-0">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500">Description:</p>
          <p className="text-base text-slate-900">{description}</p>
        </div>

        {attachments.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-slate-500">Attachments:</p>
            <div className="grid gap-3 md:grid-cols-2">
              {attachments.map((attachment) => (
                <AttachmentItem key={attachment.id} attachment={attachment} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

