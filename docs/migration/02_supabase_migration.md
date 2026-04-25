# Supabase / Backend Migration Checklist (Lovable Cloud → Your Own Supabase)

Lovable Cloud is just a managed Supabase project. To self-host the backend, create your own Supabase project and copy schema + data into it.

> Time: ~1 hour · Downtime: ~5 min during DNS / env switch

---

## 0. What lives in the backend today

- **Tables**: `leads`, `profiles`, `user_roles`
- **Enums**: `app_role`, `lead_status`
- **Functions**: `has_role`, `update_updated_at_column`, `handle_new_user`
- **Trigger**: `on_auth_user_created` on `auth.users`
- **RLS policies** on all 3 tables (see `<supabase-tables>` reference)
- **Secrets**: `LOVABLE_API_KEY`, `SANITY_WRITE_TOKEN`
- **Edge functions**: `generate-blog-post`, `seo-autofill`, `auto-publish-posts`
- **Cron**: hourly trigger for `auto-publish-posts` (configured in Lovable UI)

---

## 1. Create your own Supabase project

1. Go to https://supabase.com → **New project**
2. Region: closest to India (e.g. `ap-south-1` Mumbai)
3. Save the new **Project Ref**, **anon key**, **service role key**, and **DB password**.

---

## 2. Export schema + data from current project

Install Supabase CLI:
```bash
npm install -g supabase
supabase login
```

Link to the OLD (Lovable) project:
```bash
supabase link --project-ref sugyccacairrdxnyoehm
```

Dump schema and data:
```bash
supabase db dump --schema public --file schema.sql
supabase db dump --schema public --data-only --file data.sql
```

> Tip: leads table data is your most valuable asset — back this up first.

---

## 3. Apply schema to NEW project

The repo's existing migrations under `supabase/migrations/` are the source of truth. Easier path:

```bash
supabase link --project-ref <NEW_PROJECT_REF>
supabase db push        # applies all migrations from supabase/migrations/
```

If you prefer the dump:
```bash
psql "postgresql://postgres:<PASSWORD>@db.<NEW_REF>.supabase.co:5432/postgres" -f schema.sql
```

---

## 4. Import data into NEW project

```bash
psql "postgresql://postgres:<PASSWORD>@db.<NEW_REF>.supabase.co:5432/postgres" -f data.sql
```

Verify counts:
```sql
select count(*) from leads;
select count(*) from profiles;
select count(*) from user_roles;
```

---

## 5. Recreate auth users (if any admin accounts exist)

`auth.users` is **not** included in `pg_dump`. Two options:

**Option A — manual (recommended for <10 users):**
- Create each user in NEW Supabase → Authentication → Users → Add user
- Then in SQL editor, link them:
  ```sql
  insert into user_roles (user_id, role) values ('<new-user-uuid>', 'admin');
  ```

**Option B — programmatic:** use the Admin API (`/auth/v1/admin/users`) with the OLD service role key to list users, then `POST` them into the NEW project. Passwords cannot be migrated — users must reset.

---

## 6. Configure Auth in NEW project

Supabase Dashboard → Authentication → **Providers**:
- Enable **Email** (disable email confirmation only if you want; defaults are safer ON)
- Enable **Google** if you use it (paste OAuth Client ID / Secret from Google Cloud Console)

Authentication → **URL Configuration**:
- Site URL: `https://<your-vercel-domain>` (or final domain)
- Redirect URLs: add `http://localhost:8080`, your Vercel URL, and final domain

---

## 7. Add backend secrets

Supabase Dashboard → Project Settings → **Edge Functions → Secrets** → add:

| Secret | Where to get it |
|---|---|
| `SANITY_WRITE_TOKEN` | Sanity Manage → API → Tokens (see file 01 step 5) |
| `LOVABLE_API_KEY` | ⚠️ **Will not work outside Lovable.** See note below. |

> **Important**: `LOVABLE_API_KEY` only works inside Lovable's AI Gateway. After migration, switch the AI calls in `seo-autofill/index.ts` and `generate-blog-post/index.ts` to use your own provider key (e.g. `OPENAI_API_KEY` or `GOOGLE_AI_API_KEY`) and update the endpoint URLs. See file 03 for the code changes.

---

## 8. Deploy edge functions

```bash
supabase functions deploy generate-blog-post --no-verify-jwt
supabase functions deploy seo-autofill --no-verify-jwt
supabase functions deploy auto-publish-posts --no-verify-jwt
```

Test:
```bash
curl https://<NEW_REF>.supabase.co/functions/v1/auto-publish-posts \
  -H "Authorization: Bearer <NEW_ANON_KEY>"
```

---

## 9. Recreate the cron job

Supabase Dashboard → Database → **Cron** → New job:
- Name: `auto-publish-posts-hourly`
- Schedule: `0 * * * *`
- SQL:
  ```sql
  select net.http_post(
    url := 'https://<NEW_REF>.supabase.co/functions/v1/auto-publish-posts',
    headers := '{"Authorization":"Bearer <NEW_ANON_KEY>"}'::jsonb
  );
  ```

(Enable the `pg_cron` and `pg_net` extensions in Database → Extensions if not already on.)

---

## 10. Update front-end env vars

Edit `.env` (or set in Vercel — see file 03):

```
VITE_SUPABASE_URL=https://<NEW_REF>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<NEW_ANON_KEY>
VITE_SUPABASE_PROJECT_ID=<NEW_REF>
```

⚠️ The auto-generated `src/integrations/supabase/client.ts` and `src/integrations/supabase/types.ts` will not update themselves outside Lovable. Regenerate types locally:
```bash
supabase gen types typescript --project-id <NEW_REF> > src/integrations/supabase/types.ts
```
The `client.ts` file already reads from env vars, so no edit needed.

---

## 11. Update `supabase/config.toml`

```toml
project_id = "<NEW_PROJECT_REF>"
```

Keep the `[functions.*]` blocks as-is.

---

## 12. Verify

- [ ] App loads, blog renders, lead form submits
- [ ] New lead appears in NEW project's `leads` table
- [ ] Admin login works
- [ ] `/admin` routes show data
- [ ] Edge functions respond 200
- [ ] Cron fires hourly (check Edge Function Logs)

---

## Rollback

Revert `.env` to the old Lovable values. The old Lovable Cloud project keeps running in parallel until you explicitly disable it.
