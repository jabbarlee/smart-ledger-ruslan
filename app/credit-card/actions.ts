"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase";

const CAPITAL_ONE_NAME = "Capital One";

type BalanceRow = { id: string; balance: number; name: string };

async function getBalanceRow(): Promise<BalanceRow | null> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("credit_card_balances")
      .select("id, balance, name")
      .eq("name", CAPITAL_ONE_NAME)
      .single();

    if (error || !data) {
      return null;
    }

    return data as BalanceRow;
  } catch {
    return null;
  }
}

export async function getCreditCardBalance() {
  const row = await getBalanceRow();
  return row
    ? { id: row.id, balance: Number(row.balance), name: row.name }
    : { id: "", balance: 0, name: CAPITAL_ONE_NAME };
}

export async function getCreditCardTransactions() {
  try {
    const supabase = createSupabaseClient();
    const row = await getBalanceRow();
    if (!row) return [];

    const { data, error } = await supabase
      .from("credit_card_transactions")
      .select("*")
      .eq("balance_id", row.id)
      .order("date", { ascending: false });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getCreditCardPayments() {
  try {
    const supabase = createSupabaseClient();
    const row = await getBalanceRow();
    if (!row) return [];

    const { data, error } = await supabase
      .from("credit_card_payments")
      .select("*")
      .eq("balance_id", row.id)
      .order("date", { ascending: false });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function addCreditCardTransaction(formData: FormData) {
  const supabase = createSupabaseClient();
  const row = await getBalanceRow();
  if (!row) throw new Error("Credit card balance is unavailable");

  const amount = Number(formData.get("amount"));
  const description = (formData.get("description") as string) ?? null;
  const category = (formData.get("category") as string) ?? null;
  const date = formData.get("date") as string;

  const { error: insertError } = await supabase
    .from("credit_card_transactions")
    .insert({ balance_id: row.id, amount, description, category, date });

  if (insertError) throw new Error(insertError.message);

  const { data: balanceRow } = await supabase
    .from("credit_card_balances")
    .select("balance")
    .eq("id", row.id)
    .single();

  const newBalance = (Number(balanceRow?.balance ?? 0) + amount).toFixed(2);
  const { error: updateError } = await supabase
    .from("credit_card_balances")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("id", row.id);

  if (updateError) throw new Error(updateError.message);
  revalidatePath("/credit-card");
}

export async function addCreditCardPayment(formData: FormData) {
  const supabase = createSupabaseClient();
  const row = await getBalanceRow();
  if (!row) throw new Error("Credit card balance is unavailable");

  const amount = Number(formData.get("amount"));
  const date = formData.get("date") as string;
  const note = (formData.get("note") as string) ?? null;

  const { error: insertError } = await supabase
    .from("credit_card_payments")
    .insert({ balance_id: row.id, amount, date, note });

  if (insertError) throw new Error(insertError.message);

  const { data: balanceRow } = await supabase
    .from("credit_card_balances")
    .select("balance")
    .eq("id", row.id)
    .single();

  const newBalance = Math.max(
    0,
    Number(balanceRow?.balance ?? 0) - amount,
  ).toFixed(2);
  const { error: updateError } = await supabase
    .from("credit_card_balances")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("id", row.id);

  if (updateError) throw new Error(updateError.message);
  revalidatePath("/credit-card");
}

export async function setCreditCardBalance(formData: FormData) {
  const supabase = createSupabaseClient();
  const row = await getBalanceRow();
  if (!row) throw new Error("Credit card balance is unavailable");

  const balance = Number(formData.get("balance"));

  const { error } = await supabase
    .from("credit_card_balances")
    .update({ balance, updated_at: new Date().toISOString() })
    .eq("id", row.id);

  if (error) throw new Error(error.message);
  revalidatePath("/credit-card");
}
