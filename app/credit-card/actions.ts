"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

const CAPITAL_ONE_NAME = "Capital One";

async function getBalanceRow() {
  const { data, error } = await supabase
    .from("credit_card_balances")
    .select("id, balance, name")
    .eq("name", CAPITAL_ONE_NAME)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Credit card balance not found");
  }
  return data as { id: string; balance: number; name: string };
}

export async function getCreditCardBalance() {
  const row = await getBalanceRow();
  return { id: row.id, balance: Number(row.balance), name: row.name };
}

export async function getCreditCardTransactions() {
  const { id } = await getBalanceRow();
  const { data, error } = await supabase
    .from("credit_card_transactions")
    .select("*")
    .eq("balance_id", id)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCreditCardPayments() {
  const { id } = await getBalanceRow();
  const { data, error } = await supabase
    .from("credit_card_payments")
    .select("*")
    .eq("balance_id", id)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addCreditCardTransaction(formData: FormData) {
  const { id } = await getBalanceRow();
  const amount = Number(formData.get("amount"));
  const description = (formData.get("description") as string) ?? null;
  const category = (formData.get("category") as string) ?? null;
  const date = (formData.get("date") as string);

  const { error: insertError } = await supabase
    .from("credit_card_transactions")
    .insert({ balance_id: id, amount, description, category, date });

  if (insertError) throw new Error(insertError.message);

  const { data: row } = await supabase
    .from("credit_card_balances")
    .select("balance")
    .eq("id", id)
    .single();

  const newBalance = (Number(row?.balance ?? 0) + amount).toFixed(2);
  const { error: updateError } = await supabase
    .from("credit_card_balances")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) throw new Error(updateError.message);
  revalidatePath("/credit-card");
}

export async function addCreditCardPayment(formData: FormData) {
  const { id } = await getBalanceRow();
  const amount = Number(formData.get("amount"));
  const date = (formData.get("date") as string);
  const note = (formData.get("note") as string) ?? null;

  const { error: insertError } = await supabase
    .from("credit_card_payments")
    .insert({ balance_id: id, amount, date, note });

  if (insertError) throw new Error(insertError.message);

  const { data: row } = await supabase
    .from("credit_card_balances")
    .select("balance")
    .eq("id", id)
    .single();

  const newBalance = Math.max(0, Number(row?.balance ?? 0) - amount).toFixed(2);
  const { error: updateError } = await supabase
    .from("credit_card_balances")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) throw new Error(updateError.message);
  revalidatePath("/credit-card");
}

export async function setCreditCardBalance(formData: FormData) {
  const { id } = await getBalanceRow();
  const balance = Number(formData.get("balance"));

  const { error } = await supabase
    .from("credit_card_balances")
    .update({ balance, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/credit-card");
}
