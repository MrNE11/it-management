# Connecting the dashboard to Supabase

## 1. Create the tables
Open your Supabase project → **SQL Editor** → **New query** → paste the contents of
`schema.sql` → **Run**. This creates every table the dashboard needs (staff, tickets,
kb_articles, assets, websites, backup_jobs, security_events, credentials) with Row
Level Security turned on.

## 2. Turn on authentication
Every table's RLS policy requires `auth.role() = 'authenticated'` — an anonymous
visitor with just the public API key cannot read or write anything, including the
Credentials Vault. That's intentional for an internal tool with real server/FTP/admin
passwords in it.

Before the dashboard can load real data it needs a login step:
**Authentication → Providers** in Supabase, enable **Email** (password or magic link),
then create yourself a user under **Authentication → Users**. I can build the login
screen once you're ready — just say so.

## 3. Send me the connection details
From **Project Settings → API**, I need:
- **Project URL** (`https://xxxxxxxx.supabase.co`)
- **anon / public** key

Do **not** send the `service_role` key here — it bypasses RLS entirely and must never
be embedded in client-side JS. If server-side (PHP) writes are needed later, that key
stays in a PHP-only config file, never in `js/`.

## 4. Credentials Vault encryption
The `credentials.password_encrypted` column is `bytea`, meant to hold ciphertext from
`pgp_sym_encrypt()`, not plaintext. The encrypt/decrypt passphrase must live in a
Supabase Edge Function environment variable or Vault secret — never in the anon key
or client JS. I'll wire this up once auth is in place; until then, don't paste real
production passwords into the table (via SQL Editor, Table Editor, or to me in chat) —
use placeholder values until the encryption path is ready.
