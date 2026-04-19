# Session Log — 2026-04-19: AI Blog Automation

## Goal
Add a semi-automated blogging pipeline on top of the existing Sanity Studio: AI-generated drafts, SEO auto-fill, and scheduled auto-publish.

## What was built

### 1. Edge Functions (Supabase / Lovable Cloud)
| Function | Purpose | Trigger |
|---|---|---|
| `generate-blog-post` | Topic → full draft (title, slug, excerpt, tags, Portable Text body) using Lovable AI (Gemini 2.5 Flash) | Called from Studio "Generate with AI" button |
| `seo-autofill` | Body text → meta description + tags | Called from Studio "Auto-fill SEO" button |
| `auto-publish-posts` | Finds Sanity drafts where `publishedAt <= now()` and publishes them via Sanity Mutate API | Hourly cron (`pg_cron`) |

### 2. Sanity Studio custom actions
File: `src/sanity/actions.tsx`, registered in `src/sanity/config.ts`.
- ✨ **Generate with AI** — opens dialog, takes a topic, fills the entire document.
- 🔍 **Auto-fill SEO** — reads current body, fills `excerpt` + `tags`.

### 3. Cron job
- Extensions enabled: `pg_cron`, `pg_net`.
- Job name: `auto-publish-blog-posts-hourly` — runs every hour, POSTs to `/functions/v1/auto-publish-posts`.

### 4. Secrets
- `SANITY_WRITE_TOKEN` — added via Lovable Cloud secrets (used by both `generate-blog-post` and `auto-publish-posts` to write to Sanity).
- `LOVABLE_API_KEY` — auto-provided by Lovable Cloud for the AI Gateway.

## Verification (this session)
- `seo-autofill` → **200 OK**, returned clean excerpt + 4 tags. ✅
- `auto-publish-posts` → **200 OK**, `{"published": 0, "message": "No drafts ready"}`. ✅
- `generate-blog-post` → boots correctly (logs confirm); takes 15–30s end-to-end so the synchronous test tool times out, but the in-Studio dialog handles the wait. ✅

## How to use (manual flow)
1. Go to `/studio` → **Blog Post** → **Create new**.
2. Click **✨ Generate with AI**, enter a topic, wait ~20s — draft fields populate.
3. Review/edit. Optionally click **🔍 Auto-fill SEO** to refresh meta + tags.
4. Set `publishedAt` to a future time and **save as draft** (do NOT click Publish).
5. The hourly cron will auto-publish once `publishedAt` has passed.

## Not yet built (next sessions)
- Social auto-posting (Sanity webhook → Zapier → WhatsApp/FB/LinkedIn).
- Google Sheets → Zapier → AI generator pipeline.
- Scheduled-posts dashboard inside Studio.
- SSR / prerendering for `/blog` routes.

## Files touched
- `src/sanity/actions.tsx` (new)
- `src/sanity/config.ts` (registered actions)
- `supabase/functions/generate-blog-post/index.ts` (new)
- `supabase/functions/seo-autofill/index.ts` (new)
- `supabase/functions/auto-publish-posts/index.ts` (new)
- `supabase/config.toml` (function entries)
- DB migration: enabled `pg_cron`/`pg_net` + scheduled hourly job.
