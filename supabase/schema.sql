-- ============================================================
-- IT Support Dashboard — Supabase schema
-- Run this once in: Supabase Dashboard > SQL Editor > New query
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- staff (employees + IT technicians) ----------
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  initials text not null,
  department text not null,
  email text unique not null,
  role text not null default 'Employee',       -- e.g. IT Administrator, Support Technician, Network Engineer, Employee
  account_status text not null default 'Active' check (account_status in ('Active','Suspended')),
  devices text,                                 -- free-text summary, e.g. "Notebook, iPhone"
  created_at timestamptz not null default now()
);

-- ---------- tickets ----------
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text unique not null,           -- e.g. TK-2041
  subject text not null,
  category text not null check (category in ('Hardware','Software','Network','Account/Access')),
  reporter_id uuid references staff(id) on delete set null,
  assignee_id uuid references staff(id) on delete set null,
  priority text not null check (priority in ('critical','high','medium','low')),
  status text not null check (status in ('Open','In Progress','Escalated','Resolved','Pending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- knowledge base ----------
create table if not exists kb_articles (
  id uuid primary key default gen_random_uuid(),
  tag text not null,
  title text not null,
  description text,
  views int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- assets / inventory ----------
create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  asset_tag text unique not null,
  name text not null,
  type text not null,
  holder text,
  status text not null check (status in ('Active','Repair','Retired')),
  warranty_until date,
  created_at timestamptz not null default now()
);

-- ---------- websites ----------
create table if not exists websites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  tech_stack text,
  hosting text,
  status text not null check (status in ('Online','Maintenance','Degraded','Offline')),
  ssl_status text not null check (ssl_status in ('Valid','Expiring Soon','Expired','Internal Only')),
  uptime_pct numeric(5,2),
  owner_id uuid references staff(id) on delete set null,
  last_checked_at timestamptz not null default now()
);

-- ---------- backup jobs ----------
create table if not exists backup_jobs (
  id uuid primary key default gen_random_uuid(),
  job_name text not null,
  job_type text not null check (job_type in ('Full','Incremental')),
  size_label text,
  started_at timestamptz not null default now(),
  duration_label text,
  status text not null check (status in ('Success','Failed'))
);

-- ---------- security events ----------
create table if not exists security_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  detail text,
  severity text not null check (severity in ('critical','warning','info','success')),
  occurred_at timestamptz not null default now()
);

-- ---------- credentials vault (sensitive — see notes below) ----------
create table if not exists credentials (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  category text not null check (category in ('Server (SSH)','FTP','Web Admin','Database','Email','Domain & DNS')),
  host text,
  username text,
  password_encrypted bytea not null,            -- encrypted with pgcrypto, never stored as plaintext
  owner_id uuid references staff(id) on delete set null,
  is_stale boolean not null default false,
  updated_at timestamptz not null default now()
);

comment on column credentials.password_encrypted is
  'Encrypted with pgp_sym_encrypt() using a secret held only in a server-side Supabase Vault secret / Edge Function env var — never the anon key, never client-side JS.';

-- Helper functions to encrypt/decrypt. The passphrase must be passed in at
-- call time from a trusted server context (Edge Function or backend) that
-- reads it from an environment variable / Supabase Vault secret — never
-- hardcode it here and never call these from client-side JS with the key inline.
create or replace function encrypt_credential(plain text, passphrase text)
returns bytea language sql as $$
  select pgp_sym_encrypt(plain, passphrase);
$$;

create or replace function decrypt_credential(cipher bytea, passphrase text)
returns text language sql as $$
  select pgp_sym_decrypt(cipher, passphrase);
$$;

-- ============================================================
-- Row Level Security — internal tool, authenticated staff only.
-- Anonymous (anon key) access is denied on every table below.
-- Add Supabase Auth (email/password or magic link) before using
-- this schema for real data — the app must sign users in first.
-- ============================================================

alter table staff            enable row level security;
alter table tickets          enable row level security;
alter table kb_articles      enable row level security;
alter table assets           enable row level security;
alter table websites         enable row level security;
alter table backup_jobs      enable row level security;
alter table security_events  enable row level security;
alter table credentials      enable row level security;

create policy "authenticated read/write - staff"           on staff           for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write - tickets"         on tickets         for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write - kb_articles"     on kb_articles     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write - assets"          on assets          for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write - websites"        on websites        for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write - backup_jobs"     on backup_jobs     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write - security_events" on security_events for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated read/write - credentials"     on credentials     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- NOTE: sign-up is intentionally open to any email address (no
-- domain restriction). Anyone who signs up can see all IT data
-- once logged in, since every RLS policy above only checks
-- auth.role() = 'authenticated', not who the user is. An earlier
-- version of this schema had a trigger restricting sign-up to
-- @edupark.co.th — it was removed on request. If tighter access
-- control is needed later, reintroduce a similar trigger on
-- auth.users, or add per-row ownership checks to the policies.
-- ============================================================

-- ============================================================
-- Credentials Vault: real server-side encryption.
--
-- Passwords are encrypted with pgcrypto (pgp_sym_encrypt/decrypt) inside
-- SECURITY DEFINER functions. The passphrase is a literal baked into the
-- function body on the live database — it is intentionally NOT written
-- here (this repo is public) and NOT passed as a parameter from the
-- client, so it can never appear in client JS, network requests, or this
-- source file. Bulk SELECTs on `credentials` never return
-- password_encrypted; the only way to get a plaintext password is
-- reveal_credential(id), one row at a time, and only as an authenticated
-- user. If you need to reapply this schema from scratch, regenerate a new
-- passphrase (e.g. `openssl rand -base64 32`) and rerun these two CREATE
-- FUNCTION statements with it substituted in — note that does NOT
-- re-encrypt any existing rows, they'd need re-entry.
-- ============================================================

alter table credentials add column if not exists owner_name text;

create or replace function public.add_credential(
  p_service_name text,
  p_category text,
  p_host text,
  p_username text,
  p_password text,
  p_owner_name text default null,
  p_is_stale boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id uuid;
begin
  if auth.role() <> 'authenticated' then
    raise exception 'Not authorized';
  end if;

  insert into credentials (service_name, category, host, username, password_encrypted, owner_name, is_stale)
  values (
    p_service_name, p_category, p_host, p_username,
    pgp_sym_encrypt(p_password, '<REPLACE_WITH_A_REAL_SECRET_PASSPHRASE>'),
    p_owner_name, p_is_stale
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.reveal_credential(p_id uuid)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_plain text;
begin
  if auth.role() <> 'authenticated' then
    raise exception 'Not authorized';
  end if;

  select pgp_sym_decrypt(password_encrypted, '<REPLACE_WITH_A_REAL_SECRET_PASSPHRASE>')
  into v_plain
  from credentials where id = p_id;

  return v_plain;
end;
$$;

revoke all on function public.add_credential(text,text,text,text,text,text,boolean) from public;
revoke all on function public.reveal_credential(uuid) from public;
grant execute on function public.add_credential(text,text,text,text,text,text,boolean) to authenticated;
grant execute on function public.reveal_credential(uuid) to authenticated;
