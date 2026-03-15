import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type CreditCardTransaction = {
  id: string;
  amount: number;
  description: string | null;
  category: string | null;
  date: string;
  created_at: string;
};

export function CreditCardTransactionsTable({
  transactions,
}: {
  transactions: CreditCardTransaction[];
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-200 hover:bg-transparent">
            <TableHead className="text-zinc-500 font-medium">Date</TableHead>
            <TableHead className="text-zinc-500 font-medium">Description</TableHead>
            <TableHead className="text-zinc-500 font-medium">Category</TableHead>
            <TableHead className="text-zinc-500 font-medium text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow className="border-zinc-100 hover:bg-transparent">
              <TableCell colSpan={4} className="py-12 text-center text-zinc-400 text-sm">
                No transactions yet.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id} className="border-zinc-100 hover:bg-zinc-50/80">
                <TableCell className="text-zinc-700 text-sm">
                  {new Date(tx.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-zinc-700 text-sm">
                  {tx.description ?? "—"}
                </TableCell>
                <TableCell className="text-zinc-600 text-sm">
                  {tx.category ?? "—"}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums text-sm text-rose-600">
                  +
                  {Number(tx.amount).toLocaleString("en-US", {
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
