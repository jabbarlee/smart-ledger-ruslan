"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const CATEGORY_COLORS = [
  "hsl(142 76% 36%)",   // emerald-600
  "hsl(346 77% 50%)",   // rose-500
  "hsl(217 91% 60%)",   // blue-500
  "hsl(38 92% 50%)",    // amber-500
  "hsl(262 83% 58%)",   // violet-500
  "hsl(199 89% 48%)",   // cyan-500
  "hsl(25 95% 53%)",    // orange-500
  "hsl(330 81% 60%)",   // pink-500
  "hsl(215 14% 34%)",   // zinc-500
];

export type TransactionForCharts = {
  amount: number;
  category: string | null;
  type: "income" | "expense";
  date?: string;
};

type FinanceChartsProps = {
  transactions: TransactionForCharts[];
};

export function FinanceCharts({ transactions }: FinanceChartsProps) {
  const spendingByCategory = useMemo(() => {
    const onlyExpenses = transactions.filter((t) => t.type === "expense");
    const byCategory = new Map<string, number>();
    for (const t of onlyExpenses) {
      const cat = t.category?.trim() || "Uncategorized";
      byCategory.set(cat, (byCategory.get(cat) ?? 0) + Number(t.amount));
    }
    return Array.from(byCategory.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const incomeVsExpense = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      const amt = Number(t.amount);
      if (t.type === "income") income += amt;
      else expense += amt;
    }
    return [
      { name: "Income", value: income, fill: "hsl(142 76% 36%)" },
      { name: "Expense", value: expense, fill: "hsl(346 77% 50%)" },
    ];
  }, [transactions]);

  const last7DaysSpending = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates: { dateStr: string; label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      dates.push({
        dateStr,
        label: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }),
        value: 0,
      });
    }
    const expensesByDate = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== "expense" || !t.date) continue;
      const key = t.date.slice(0, 10);
      expensesByDate.set(key, (expensesByDate.get(key) ?? 0) + Number(t.amount));
    }
    return dates.map((d) => ({
      ...d,
      value: expensesByDate.get(d.dateStr) ?? 0,
    }));
  }, [transactions]);

  const donutConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    spendingByCategory.forEach((item, i) => {
      config[item.name] = {
        label: item.name,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      };
    });
    return config;
  }, [spendingByCategory]);

  const barConfig = {
    value: { label: "Amount" },
    Income: { label: "Income", color: "hsl(142 76% 36%)" },
    Expense: { label: "Expense", color: "hsl(346 77% 50%)" },
  };

  const last7Config = {
    value: { label: "Spent" },
    label: { label: "Day" },
  };

  const hasSpending = spendingByCategory.length > 0;
  const hasAny = transactions.length > 0;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-4 text-sm font-medium text-zinc-500">
          Income vs expense
        </h3>
        {hasAny ? (
          <ChartContainer
            config={barConfig}
            className="h-[240px] w-full"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      Number(value).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }
                  />
                }
              />
              <Pie
                data={incomeVsExpense}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
              >
                {incomeVsExpense.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[240px] items-center justify-center text-sm text-zinc-400">
            No transactions yet
          </div>
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-4 text-sm font-medium text-zinc-500">
          Expenses by category
        </h3>
        {hasSpending ? (
          <ChartContainer
            config={donutConfig}
            className="h-[240px] w-full"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      Number(value).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }
                  />
                }
              />
              <Pie
                data={spendingByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
              >
                {spendingByCategory.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      donutConfig[entry.name]?.color ??
                      CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[240px] items-center justify-center text-sm text-zinc-400">
            No spending data yet
          </div>
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-4 text-sm font-medium text-zinc-500">
          Income vs expenses
        </h3>
        {hasAny ? (
          <ChartContainer
            config={barConfig}
            className="h-[240px] w-full"
          >
            <BarChart
              data={incomeVsExpense}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(0 0% 45%)", fontSize: 12 }}
                axisLine={{ stroke: "hsl(0 0% 90%)" }}
              />
              <YAxis
                tick={{ fill: "hsl(0 0% 45%)", fontSize: 12 }}
                axisLine={{ stroke: "hsl(0 0% 90%)" }}
                tickFormatter={(v) =>
                  v.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      Number(value).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }
                  />
                }
              />
              <Bar dataKey="value" nameKey="name" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[240px] items-center justify-center text-sm text-zinc-400">
            No transactions yet
          </div>
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:col-span-2 lg:col-span-3">
        <h3 className="mb-4 text-sm font-medium text-zinc-500">
          Last 7 days spending
        </h3>
        <ChartContainer
          config={last7Config}
          className="h-[200px] w-full"
        >
          <BarChart
            data={last7DaysSpending}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "hsl(0 0% 45%)", fontSize: 11 }}
              axisLine={{ stroke: "hsl(0 0% 90%)" }}
            />
            <YAxis
              tick={{ fill: "hsl(0 0% 45%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(0 0% 90%)" }}
              tickFormatter={(v) =>
                v.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    Number(value).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }
                />
              }
            />
            <Bar
              dataKey="value"
              nameKey="label"
              fill="hsl(346 77% 50%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
