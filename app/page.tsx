import { getTransactions } from "@/app/actions";
import { FinanceTrackerContent } from "@/components/finance-tracker-content";

export default async function Home() {
  const transactions = await getTransactions();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <FinanceTrackerContent transactions={transactions ?? []} />
      </div>
    </div>
  );
}
