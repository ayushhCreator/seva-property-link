# Sanity Migration Checklist (Old → New Account)

Move all blog content from the **old Sanity project** (`ajhhf96y`) to a **new Sanity project** under your new account, and update every place in the codebase + automations that references it.

> Time: ~30–45 min · Downtime: zero

---

## 0. Prerequisites

- Node.js 18+ installed locally
- Access to BOTH old and new Sanity accounts
- This repo cloned locally
- Sanity CLI: `npm install -g @sanity/cli`

---

## 1. Export from the OLD project

```bash
sanity login           # login with the OLD account
sanity dataset export production ./bhumiseva-backup.tar.gz --project ajhhf96y
```

The `.tar.gz` contains all documents, drafts and image assets. Keep it safe.

---

## 2. Create the NEW Sanity project

```bash
sanity logout
sanity login           # login with the NEW account
```

Then go to https://www.sanity.io/manage → **Create new project**:
- Name: `BhumiSeva`
- Dataset: `production`
- Visibility: **Public** (required for the website to read without a token)

Copy the new **Project ID** (e.g. `abcd1234`) — you will paste it in many places.

---

## 3. Import into the NEW project

```bash
sanity dataset import ./bhumiseva-backup.tar.gz production \
  --project <NEW_PROJECT_ID> --replace
```

Verify in the Studio (Vision tab):
```groq
count(*[_type == "post"])
```
Number must match the old project.

---

## 4. CORS origins on the NEW project

Sanity Manage → **API → CORS origins** → add:

| Origin | Allow credentials |
|---|---|
| `http://localhost:8080` | ✅ |
| `http://localhost:3333` | ✅ |
| `https://*.lovable.app` | ❌ |
| `https://*.lovableproject.com` | ❌ |
| `https://bhumiseva.lovable.app` | ❌ |
| `https://<your-vercel-app>.vercel.app` | ❌ |
| `https://<your-final-domain>` | ❌ |

---

## 5. Create a WRITE token

Sanity Manage → **API → Tokens → Add API token**:
- Name: `BhumiSeva Write`
- Permissions: **Editor**
- Copy the token immediately (shown only once).

---

## 6. Update the codebase

**`src/lib/sanity.ts`**:
```ts
export const SANITY_PROJECT_ID = '<NEW_PROJECT_ID>';
```

**`supabase/functions/auto-publish-posts/index.ts`**:
```ts
const SANITY_PROJECT_ID = "<NEW_PROJECT_ID>";
```

Sanity check:
```bash
grep -r "ajhhf96y" .
```
Replace every remaining match.

---

## 7. (Optional) Reconnect embedded Studio

```bash
sanity init --reconfigure
# pick new project, dataset = production, do NOT overwrite files
```

---

## 8. Update n8n workflow

In your n8n **Sanity Write** node:
- URL → `https://<NEW_PROJECT_ID>.api.sanity.io/v2024-01-01/data/mutate/production`
- Header → `Authorization: Bearer <NEW_WRITE_TOKEN>`
- Run a test with a dummy post.

---

## 9. Update backend secret

In Lovable: **Cloud → Secrets → SANITY_WRITE_TOKEN** → paste new token.
(If you migrate off Lovable, set `SANITY_WRITE_TOKEN` in your new platform — see file 03.)

---

## 10. Verify

- [ ] Blog page loads posts from new project
- [ ] Single post renders with images
- [ ] `/studio` opens the new project
- [ ] `auto-publish-posts` returns 200 when invoked
- [ ] n8n test creates a draft in the new project

---

## 11. Cleanup (after 1–2 weeks)

- Delete old Sanity project at sanity.io/manage
- Revoke the old write token
- Archive or delete `bhumiseva-backup.tar.gz`

---

## Rollback

Revert `SANITY_PROJECT_ID` in `src/lib/sanity.ts` and the edge function to `ajhhf96y`. Old data is untouched until step 11.
