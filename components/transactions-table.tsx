"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteTransaction, updateTransaction } from "@/app/actions";

export type Transaction = {
  id: string;
  created_at: string;
  amount: number;
  category: string | null;
  description: string | null;
  date: string;
  type: "income" | "expense";
};

type TransactionsTableProps = {
  transactions: Transaction[];
  onEditTransaction?: (transaction: Transaction) => void;
};

export function TransactionsTable({ transactions, onEditTransaction }: TransactionsTableProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-200 hover:bg-transparent">
            <TableHead className="text-zinc-500 font-medium">Date</TableHead>
            <TableHead className="text-zinc-500 font-medium">Description</TableHead>
            <TableHead className="text-zinc-500 font-medium">Category</TableHead>
            <TableHead className="text-zinc-500 font-medium text-right">Amount</TableHead>
            <TableHead className="w-[100px] text-zinc-500 font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow className="border-zinc-100 hover:bg-transparent">
              <TableCell colSpan={5} className="py-12 text-center text-zinc-400 text-sm">
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
                <TableCell
                  className={`text-right font-medium tabular-nums text-sm ${
                    tx.type === "income" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {tx.type === "income" ? "+" : "−"}
                  {Math.abs(Number(tx.amount)).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEditTransaction ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                        aria-label="Edit"
                        onClick={() => onEditTransaction(tx)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    ) : (
                      <EditTransactionDialog transaction={tx} />
                    )}
                    <form action={deleteTransaction.bind(null, tx.id)} className="inline">
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon-sm"
                        className="text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function EditTransactionDialog({ transaction }: { transaction: Transaction }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateTransaction(transaction.id, formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          aria-label="Edit"
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-200 bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">Edit transaction</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Amount</label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              required
              defaultValue={transaction.amount}
              className="border-zinc-200"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Type</label>
            <select
              name="type"
              required
              defaultValue={transaction.type}
              className="h-9 w-full rounded-md border border-zinc-200 bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Date</label>
            <Input
              name="date"
              type="date"
              required
              defaultValue={transaction.date}
              className="border-zinc-200"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Category</label>
            <Input
              name="category"
              defaultValue={transaction.category ?? ""}
              placeholder="e.g. Food, Salary"
              className="border-zinc-200"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Description</label>
            <Input
              name="description"
              defaultValue={transaction.description ?? ""}
              placeholder="Optional"
              className="border-zinc-200"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
