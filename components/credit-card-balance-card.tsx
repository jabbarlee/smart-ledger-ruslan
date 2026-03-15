"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { setCreditCardBalance } from "@/app/credit-card/actions";

type CreditCardBalanceCardProps = {
  name: string;
  balance: number;
};

export function CreditCardBalanceCard({ name, balance }: CreditCardBalanceCardProps) {
  const [open, setOpen] = useState(false);

  async function submit(formData: FormData) {
    await setCreditCardBalance(formData);
    setOpen(false);
  }

  return (
    <Card className="border-zinc-200 bg-white shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500">
          {name} — Balance owed
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-700">
              Set balance
            </Button>
          </DialogTrigger>
          <DialogContent className="border-zinc-200 bg-white sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-zinc-900">Set current balance</DialogTitle>
            </DialogHeader>
            <form action={submit} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-700">Amount owed</label>
                <Input
                  name="balance"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={balance}
                  className="border-zinc-200"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800">
                  Update
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums text-rose-600">
          {balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </CardContent>
    </Card>
  );
}
