# Vercel Deploy + Lovable Offboarding Checklist

Deploy the front-end to Vercel, swap the AI gateway, and cut the cord from Lovable.

> Prereq: complete files **01 (Sanity)** and **02 (Supabase)** first.
> Time: ~45 min

---

## 0. What changes when leaving Lovable

| Today (Lovable) | After migration |
|---|---|
| Hosting: `bhumiseva.lovable.app` | Vercel (your domain) |
| AI: Lovable AI Gateway via `LOVABLE_API_KEY` | Direct provider (Google AI / OpenAI) |
| Backend: Lovable Cloud (managed Supabase) | Your own Supabase project |
| Auto-deploy: Lovable on every chat edit | `git push` → Vercel |
| Custom domain: Lovable Pro plan ($25/mo) | Vercel free + Hostinger DNS |

---

## 1. Push the repo to GitHub

```bash
# In the project folder
git init                          # if not already
git remote add origin git@github.com:<you>/bhumiseva.git
git add .
git commit -m "Initial migration commit"
git push -u origin main
```

In Lovable: **Settings → GitHub → Connect** lets you mirror the repo automatically (recommended even if you self-host).

---

## 2. Swap the AI gateway in edge functions

`LOVABLE_API_KEY` only works inside Lovable. Replace it.

### Pick a provider

- **Google Gemini** (cheapest for SEO/blog generation): https://aistudio.google.com/apikey
- **OpenAI**: https://platform.openai.com/api-keys

### Update `supabase/functions/seo-autofill/index.ts`

Replace:
```ts
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
// ...
const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, ... },
  body: JSON.stringify({ model: "google/gemini-2.5-flash-lite", ... })
});
```

With (Google example):
```ts
const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
const aiResp = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GOOGLE_AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gemini-2.0-flash",
      messages: [...],
      tools: [...],
      tool_choice: {...},
    }),
  }
);
```

Apply the same swap in `supabase/functions/generate-blog-post/index.ts`.

Add the new secret in Supabase Dashboard → Edge Functions → Secrets:
- `GOOGLE_AI_API_KEY` = your Gemini key

Redeploy:
```bash
supabase functions deploy seo-autofill --no-verify-jwt
supabase functions deploy generate-blog-post --no-verify-jwt
```

---

## 3. Set up Vercel

1. https://vercel.com → **Add New Project** → import the GitHub repo
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. **Environment Variables** (Production + Preview + Development):

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://<NEW_REF>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | new anon key |
| `VITE_SUPABASE_PROJECT_ID` | new project ref |

6. Click **Deploy**. First deploy takes ~2 min.

---

## 4. SPA routing on Vercel

Vite SPA needs a fallback so deep links (e.g. `/blog/khatiyan-kya`) don't 404.

Create **`vercel.json`** at the repo root (commit it):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 5. Add your custom domain

### In Vercel
Project → **Settings → Domains → Add** → enter your domain (e.g. `bhumiseva.in`).
Vercel will show DNS records to add (A `76.76.21.21` for apex + CNAME `cname.vercel-dns.com` for `www`).

### In Hostinger / your DNS provider
Add the A and CNAME records exactly as Vercel shows. SSL is auto-provisioned in 5–10 min.

---

## 6. Update CORS everywhere

After the new domain is live, add it to:
- **Sanity** → CORS origins (file 01 step 4)
- **Supabase** → Authentication → URL Configuration
- **Google OAuth** → Authorized JavaScript origins + redirect URIs

---

## 7. Update n8n callback / webhooks

If n8n calls any URL on your site (e.g. revalidation hooks), repoint it from `bhumiseva.lovable.app` to the new domain.

---

## 8. Final smoke test

- [ ] `https://yourdomain.com` loads
- [ ] Deep link `/blog/<slug>` does NOT 404
- [ ] Lead form submits → row appears in new Supabase
- [ ] Admin login works at `/admin`
- [ ] AI generation works in `/studio` actions
- [ ] Cron published a draft within an hour

---

## 9. Decommission Lovable (only after 1–2 weeks of clean operation)

1. Lovable → **Cloud → Disable Cloud** (deletes managed Supabase)
   - ⚠️ Make absolutely sure step 2 of file 02 was completed and you have the dump.
2. Lovable → **Settings → Cancel subscription** (if on Pro)
3. Remove the Lovable badge from `index.html` if any leftover script tag exists.
4. Old `bhumiseva.lovable.app` URL will return 404 — set up a 301 redirect from your DNS or just let it die.

---

## 10. Ongoing cost after migration

| Item | Cost |
|---|---|
| Vercel Hobby | Free (100 GB bandwidth/mo) |
| Supabase Free | Free (500 MB DB, 2 GB bandwidth) |
| Sanity Free | Free (3 users, 10k docs, 5 GB assets) |
| Google Gemini API | ~$0.10 per 1M tokens (Flash) — likely <$1/mo |
| Domain | ~$10/yr |
| n8n VPS (Hostinger) | $5/mo |
| **Total** | **~$5–6 / month** |

vs. Lovable Pro $25/mo. Savings: **~$20/mo**, at the cost of self-managing deploys.

---

## Rollback

Lovable Cloud is **not** restorable once disabled. Until you run step 9, both stacks run in parallel and you can revert by switching `.env` back and pointing DNS to Lovable.
