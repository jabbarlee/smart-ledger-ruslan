"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function getTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function addTransaction(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const category = (formData.get("category") as string) ?? null;
  const description = (formData.get("description") as string) ?? null;
  const date = formData.get("date") as string;
  const type = formData.get("type") as string;

  const { error } = await supabase.from("transactions").insert({
    amount,
    category,
    description,
    date,
    type,
  });

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/");
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/");
}

export async function updateTransaction(id: string, formData: FormData) {
  const amount = Number(formData.get("amount"));
  const category = (formData.get("category") as string) ?? null;
  const description = (formData.get("description") as string) ?? null;
  const date = formData.get("date") as string;
  const type = formData.get("type") as string;

  const { error } = await supabase
    .from("transactions")
    .update({ amount, category, description, date, type })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/");
}
