import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CreditCardBalanceCardProps = {
  name: string;
  balance: number;
};

export function CreditCardBalanceCard({ name, balance }: CreditCardBalanceCardProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500">
          {name} — Balance owed
        </CardTitle>
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
