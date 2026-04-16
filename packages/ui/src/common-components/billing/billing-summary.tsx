import { Card, CardContent } from "../../components/card";
import type { Invoice } from "@corpora/utils";

interface BillingSummaryProps {
  invoices: Invoice[];
}

export function BillingSummary({ invoices }: BillingSummaryProps) {
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-sm font-medium">Total Amount</p>
          <p className="mt-2 text-3xl font-bold">${totalAmount.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-sm font-medium">Paid</p>
          <p className="mt-2 text-3xl font-bold">${paidAmount.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-sm font-medium">Pending</p>
          <p className="mt-2 text-3xl font-bold">${pendingAmount.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
