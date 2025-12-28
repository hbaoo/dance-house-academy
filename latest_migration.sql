-- Copy ALL content below and paste into Supabase SQL Editor to run.

-- 1. Create function to get monthly revenue report
create or replace function public.get_monthly_revenue()
returns table (
  month int,
  year int,
  total_revenue bigint,
  transaction_count bigint
) as $$
begin
  return query
  select 
    extract(month from created_at)::int as month,
    extract(year from created_at)::int as year,
    sum(amount)::bigint as total_revenue,
    count(*)::bigint as transaction_count
  from public.transactions
  where status = 'completed'
  group by year, month
  order by year desc, month desc;
end;
$$ language plpgsql security definer;

-- 2. Create function to find expiring memberships (FIXED: Removing invalid join)
create or replace function public.get_expiring_memberships()
returns table (
  student_name text,
  phone text,
  package_name text,
  end_date date,
  days_left int
) as $$
begin
  return query
  select 
    s.full_name as student_name,
    s.phone,
    m.package_name,
    m.end_date,
    (m.end_date - current_date)::int as days_left
  from public.memberships m
  join public.students s on m.student_id = s.id
  where m.status = 'Active'
  and m.end_date between current_date and (current_date + interval '7 days')
  order by m.end_date asc;
end;
$$ language plpgsql security definer;

-- 3. Create table for Trial Class Bookings
create table if not exists public.trial_bookings (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  phone text not null,
  email text,
  class_interest text,
  note text,
  status text default 'Pending', -- Pending, Contacted, Converted, Cancelled
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trial_bookings enable row level security;

-- Policies for trial_bookings
-- Drop check to avoid error if policy exists
drop policy if exists "Allow public insert trial_bookings" on public.trial_bookings;
drop policy if exists "Allow authenticated all on trial_bookings" on public.trial_bookings;

create policy "Allow public insert trial_bookings" on public.trial_bookings for insert with check (true);
create policy "Allow authenticated all on trial_bookings" on public.trial_bookings for all using (auth.role() = 'authenticated');
