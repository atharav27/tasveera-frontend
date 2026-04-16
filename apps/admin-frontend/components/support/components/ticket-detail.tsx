import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@corpora/ui";
import type { Ticket } from "@/types/tickets";

interface TicketDetailProps {
  ticket: Ticket;
}

export function TicketDetail({ ticket }: TicketDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticket.subject}</CardTitle>
        <CardDescription>Ticket #{ticket.ticketNumber}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm">Description</p>
            <p className="mt-1">{ticket.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Status</p>
              <p className="mt-1 font-medium">{ticket.status}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Priority</p>
              <p className="mt-1 font-medium">{ticket.priority}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

