-- Create transactions table for finance tracker
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  amount numeric not null,
  category text,
  description text,
  date date not null,
  type text not null check (type in ('income', 'expense'))
);

-- Optional: enable Row Level Security (RLS) if you use Supabase auth
-- alter table public.transactions enable row level security;

-- Optional: policy example (uncomment and adjust when using auth)
-- create policy "Users can manage own transactions"
--   on public.transactions
--   for all
--   using (auth.uid() = user_id)
--   with check (auth.uid() = user_id);

-- Optional: index for common filters
create index if not exists idx_transactions_date on public.transactions (date);
create index if not exists idx_transactions_type on public.transactions (type);
create index if not exists idx_transactions_category on public.transactions (category);
