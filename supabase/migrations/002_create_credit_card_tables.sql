-- Credit card balance (one row per card; balance = amount owed)
create table if not exists public.credit_card_balances (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  balance numeric not null default 0,
  updated_at timestamptz not null default now()
);

-- Credit card transactions (charges from card)
create table if not exists public.credit_card_transactions (
  id uuid primary key default gen_random_uuid(),
  balance_id uuid not null references public.credit_card_balances(id) on delete cascade,
  amount numeric not null,
  description text,
  category text,
  date date not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_credit_card_transactions_balance_id on public.credit_card_transactions(balance_id);
create index if not exists idx_credit_card_transactions_date on public.credit_card_transactions(date);

-- Credit card payments (payments made to reduce balance)
create table if not exists public.credit_card_payments (
  id uuid primary key default gen_random_uuid(),
  balance_id uuid not null references public.credit_card_balances(id) on delete cascade,
  amount numeric not null,
  date date not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_credit_card_payments_balance_id on public.credit_card_payments(balance_id);
create index if not exists idx_credit_card_payments_date on public.credit_card_payments(date);

-- Seed default Capital One card (ignore if already exists)
insert into public.credit_card_balances (name, balance, updated_at)
values ('Capital One', 0, now())
on conflict (name) do nothing;
