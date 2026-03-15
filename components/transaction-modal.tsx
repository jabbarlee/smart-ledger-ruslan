"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addTransaction, updateTransaction } from "@/app/actions";

const CATEGORIES = [
  "Food",
  "Transport",
  "Salary",
  "Shopping",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Rent",
  "Other",
] as const;

export type TransactionForModal = {
  id: string;
  amount: number;
  category: string | null;
  description: string | null;
  date: string;
  type: "income" | "expense";
};

type TransactionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: TransactionForModal | null;
};

export function TransactionModal({
  open,
  onOpenChange,
  transaction = null,
}: TransactionModalProps) {
  const isEdit = Boolean(transaction?.id);
  const [category, setCategory] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCategory(transaction?.category ?? "");
    }
  }, [open, transaction?.category]);

  useEffect(() => {
    const el = categoryInputRef.current;
    if (el) el.value = category;
  }, [category]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    if (category) formData.set("category", category);
    try {
      if (isEdit && transaction) {
        await updateTransaction(transaction.id, formData);
      } else {
        await addTransaction(formData);
      }
      onOpenChange(false);
      form.reset();
      setCategory("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-200 bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">
            {isEdit ? "Edit transaction" : "Add transaction"}
          </DialogTitle>
        </DialogHeader>
        <form
          key={transaction?.id ?? "add"}
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            ref={categoryInputRef}
            type="hidden"
            name="category"
            readOnly
            aria-hidden
          />
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Amount</label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              required
              defaultValue={transaction?.amount ?? ""}
              placeholder="0.00"
              className="border-zinc-200"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Type</label>
            <select
              name="type"
              required
              defaultValue={transaction?.type ?? "expense"}
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
              defaultValue={
                transaction?.date ??
                new Date().toISOString().slice(0, 10)
              }
              className="border-zinc-200"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Category</label>
            <Select
              value={category || undefined}
              onValueChange={(v) => setCategory(v)}
            >
              <SelectTrigger className="w-full border-zinc-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Description</label>
            <Input
              name="description"
              defaultValue={transaction?.description ?? ""}
              placeholder="Optional"
              className="border-zinc-200"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-zinc-200"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800">
              {isEdit ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
