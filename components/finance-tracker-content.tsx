"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TransactionModal } from "@/components/transaction-modal";
import { FinanceCharts } from "@/components/finance-charts";
import {
  TransactionsTable,
  type Transaction,
} from "@/components/transactions-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FinanceTrackerContentProps = {
  transactions: Transaction[];
};

export function FinanceTrackerContent({
  transactions,
}: FinanceTrackerContentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const totalBalance = transactions.reduce(
    (sum, tx) =>
      sum + (tx.type === "income" ? Number(tx.amount) : -Number(tx.amount)),
    0,
  );

  const openAddModal = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const openEditModal = (tx: Transaction) => {
    setEditingTransaction(tx);
    setModalOpen(true);
  };

  return (
    <>
      <PageHeader onAddClick={openAddModal} />
      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        transaction={editingTransaction}
      />

      <section className="mb-10">
        <Card className="border-zinc-200 bg-white shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-semibold tabular-nums ${
                totalBalance >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {totalBalance >= 0 ? "+" : ""}
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <FinanceCharts transactions={transactions} />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium text-zinc-500">Transactions</h2>
        <TransactionsTable
          transactions={transactions}
          onEditTransaction={openEditModal}
        />
      </section>
    </>
  );
}
