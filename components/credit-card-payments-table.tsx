import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type CreditCardPayment = {
  id: string;
  amount: number;
  date: string;
  note: string | null;
  created_at: string;
};

export function CreditCardPaymentsTable({ payments }: { payments: CreditCardPayment[] }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-200 hover:bg-transparent">
            <TableHead className="text-zinc-500 font-medium">Date</TableHead>
            <TableHead className="text-zinc-500 font-medium">Note</TableHead>
            <TableHead className="text-zinc-500 font-medium text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow className="border-zinc-100 hover:bg-transparent">
              <TableCell colSpan={3} className="py-12 text-center text-zinc-400 text-sm">
                No payments yet.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((p) => (
              <TableRow key={p.id} className="border-zinc-100 hover:bg-zinc-50/80">
                <TableCell className="text-zinc-700 text-sm">
                  {new Date(p.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-zinc-700 text-sm">
                  {p.note ?? "—"}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums text-sm text-emerald-600">
                  −
                  {Number(p.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
