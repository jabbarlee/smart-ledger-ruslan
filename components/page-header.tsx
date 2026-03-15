"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  onAddClick?: () => void;
};

export function PageHeader({ onAddClick }: PageHeaderProps) {
  return (
    <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Finance Tracker
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track income and expenses in one place.
        </p>
      </div>
      <Button
        onClick={onAddClick}
        className="bg-zinc-900 hover:bg-zinc-800 shrink-0"
      >
        <Plus className="size-4" />
        Add Transaction
      </Button>
    </header>
  );
}
