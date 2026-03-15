"use client";

import { useState } from "react";
import { Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addCreditCardPayment, addCreditCardTransaction } from "@/app/credit-card/actions";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Rent",
  "Other",
] as const;

export function CreditCardActions() {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [chargeOpen, setChargeOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogTrigger asChild>
          <Button className="bg-zinc-900 hover:bg-zinc-800">
            <CreditCard className="size-4" />
            Make payment
          </Button>
        </DialogTrigger>
        <DialogContent className="border-zinc-200 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-900">Make payment</DialogTitle>
          </DialogHeader>
          <PaymentForm onSuccess={() => setPaymentOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={chargeOpen} onOpenChange={setChargeOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-zinc-200">
            <Plus className="size-4" />
            Add charge
          </Button>
        </DialogTrigger>
        <DialogContent className="border-zinc-200 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-900">Add charge</DialogTitle>
          </DialogHeader>
          <AddChargeForm onSuccess={() => setChargeOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  async function submit(formData: FormData) {
    await addCreditCardPayment(formData);
    onSuccess();
  }

  return (
    <form action={submit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-700">Amount</label>
        <Input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          placeholder="0.00"
          className="border-zinc-200"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-700">Date</label>
        <Input
          name="date"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="border-zinc-200"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-700">Note (optional)</label>
        <Input
          name="note"
          placeholder="e.g. Monthly payment"
          className="border-zinc-200"
        />
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800">
          Record payment
        </Button>
      </DialogFooter>
    </form>
  );
}

function AddChargeForm({ onSuccess }: { onSuccess: () => void }) {
  const [category, setCategory] = useState("");

  async function submit(formData: FormData) {
    if (category) formData.set("category", category);
    await addCreditCardTransaction(formData);
    onSuccess();
  }

  return (
    <form action={submit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-700">Amount</label>
        <Input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          placeholder="0.00"
          className="border-zinc-200"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-700">Date</label>
        <Input
          name="date"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="border-zinc-200"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-700">Category</label>
        <Select value={category} onValueChange={setCategory}>
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
        <label className="text-sm font-medium text-zinc-700">Description (optional)</label>
        <Input name="description" placeholder="e.g. Groceries" className="border-zinc-200" />
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800">
          Add charge
        </Button>
      </DialogFooter>
    </form>
  );
}
