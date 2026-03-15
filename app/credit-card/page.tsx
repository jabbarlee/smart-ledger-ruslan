import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getCreditCardBalance,
  getCreditCardTransactions,
  getCreditCardPayments,
} from "@/app/credit-card/actions";
import { CreditCardBalanceCard } from "@/components/credit-card-balance-card";
import { CreditCardTransactionsTable } from "@/components/credit-card-transactions-table";
import { CreditCardPaymentsTable } from "@/components/credit-card-payments-table";
import { CreditCardActions } from "@/components/credit-card-actions";
import { Button } from "@/components/ui/button";

export default async function CreditCardPage() {
  const [balance, transactions, payments] = await Promise.all([
    getCreditCardBalance(),
    getCreditCardTransactions(),
    getCreditCardPayments(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
              <Link href="/" aria-label="Back to home">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Credit card
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Capital One balance, transactions & payments
              </p>
            </div>
          </div>
          <CreditCardActions />
        </header>

        <section className="mb-10">
          <CreditCardBalanceCard name={balance.name} balance={balance.balance} />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium text-zinc-500">Transactions (charges)</h2>
          <CreditCardTransactionsTable transactions={transactions} />
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium text-zinc-500">Payments</h2>
          <CreditCardPaymentsTable payments={payments} />
        </section>
      </div>
    </div>
  );
}
