# BhumiSeva — Complete Handover Guide

**Project:** BhumiSeva — Property Documentation Marketplace, Patna
**Owner:** Aditya (Founder & CEO)
**Date:** April 19, 2026
**Status:** Phase 1 (Customer site + Lead capture + AI Blog automation) — LIVE

---

## 1. Tech Stack Used

### Frontend
| Layer | Technology | Why |
|---|---|---|
| Framework | **React 18 + Vite** | Fast dev, instant HMR, lightweight production builds |
| Language | **TypeScript 5** | Type safety, fewer runtime bugs |
| Styling | **Tailwind CSS v3** | Utility-first, consistent design tokens |
| UI Components | **shadcn/ui + Radix UI** | Accessible, unstyled primitives we themed ourselves |
| Routing | **React Router v6** | Client-side routing for SPA |
| Forms | **React Hook Form + Zod** | Validation + great UX |
| Data Fetching | **TanStack Query** | Caching, retries, background refetch |
| Icons | **lucide-react** | Clean, consistent icon set |
| Animations | **tailwindcss-animate** | Smooth micro-interactions |

### Backend (Lovable Cloud — powered by Supabase)
| Layer | Technology | Purpose |
|---|---|---|
| Database | **PostgreSQL** | Stores `leads` table |
| Auth | **Lovable Cloud Auth** | (Ready for admin login when we build dashboard) |
| Edge Functions | **Deno serverless** | `generate-blog-post`, `seo-autofill`, `auto-publish-posts` |
| Cron Jobs | **pg_cron + pg_net** | Hourly auto-publish of scheduled blog posts |
| Secrets | **Lovable Cloud Secrets** | `SANITY_WRITE_TOKEN`, `LOVABLE_API_KEY` |

### Content / CMS
| Layer | Technology | Purpose |
|---|---|---|
| Blog CMS | **Sanity.io** | Headless CMS for blog posts at `/studio` |
| AI Provider | **Lovable AI Gateway (Gemini 2.5 Flash)** | Powers AI blog generator + SEO auto-fill — no API key needed |

### Hosting
- **Lovable** (lovable.app subdomain by default)
- Custom domain support via DNS (instructions in section 2)

---

## 2. Deployment

### Option A — Deploy on Lovable (Recommended, Easiest)

1. **Publish the app**
   - Click the **Publish** button (top-right of the editor).
   - You'll get a free URL: `bhumiseva-property-link.lovable.app` (already live).

2. **Connect your Hostinger domain (e.g. `bhumiseva.com`)**

   **Step 1 — In Lovable:**
   - Go to **Project Settings → Domains → Connect Domain**.
   - Enter your domain (e.g. `bhumiseva.com`).
   - Lovable will show you DNS records to add.

   **Step 2 — In Hostinger:**
   - Login → **Domains → Manage → DNS / Nameservers**.
   - Add these records:
     | Type | Name | Value |
     |---|---|---|
     | A | @ | `185.158.133.1` |
     | A | www | `185.158.133.1` |
     | TXT | _lovable | (value Lovable shows you) |
   - **Delete** any old conflicting A/CNAME records pointing elsewhere.

   **Step 3 — Wait**
   - DNS propagation: 15 min – 72 hours.
   - SSL (https) is auto-provisioned by Lovable.
   - Verify at [dnschecker.org](https://dnschecker.org).

3. **Frontend updates**
   Every time you make UI changes, click **Publish → Update** to push them live.
   Backend changes (edge functions, DB) deploy automatically.

### Option B — Self-Host (Not recommended for you)
Possible but needs manual setup of Supabase + hosting. See [docs.lovable.dev/tips-tricks/self-hosting](https://docs.lovable.dev/tips-tricks/self-hosting).
**Stick with Option A** — it's free hosting + auto SSL + zero DevOps.

---

## 3. How to Use the System

### 3.1 Customer Flow (what your customer does)
1. Visits `bhumiseva.com` (or current Lovable URL).
2. Browses services on homepage → clicks one (e.g. "Jamabandi").
3. Fills the multi-step enquiry form (name, phone, khesra, etc.).
4. Form submits → lead saved to your database.
5. Customer sees a thank-you message + can click WhatsApp button to reach you instantly.

### 3.2 Monitoring Leads (what YOU do)

**Right now (no admin dashboard yet):**
- Open **Lovable editor → Cloud (sidebar) → Database → Tables → `leads`**.
- You see every lead with: name, phone, service, city, all form fields, timestamp.
- Export to CSV from the same screen if needed.

**After Phase 2 (admin dashboard — not built yet, see PRD):**
- Login at `bhumiseva.com/admin`.
- See dashboard: today's leads, total leads, charts.
- Filter, search, change status (New → Contacted → Delivered), add notes.
- One-click WhatsApp the customer.

**Daily workflow (suggested):**
- Morning: Open the leads table, see overnight enquiries.
- Call each new lead within 2 hours.
- Update status (once dashboard is built) or maintain in a Google Sheet for now.

### 3.3 Working with the Blog (AI-Powered)

**Where:** Go to `bhumiseva.com/studio` (Sanity Studio — login with the email you set up).

**Creating a post:**
1. Click **Blog Post → Create new**.
2. Click **✨ Generate with AI** at the top.
3. Type a topic (e.g. *"How to apply for Jamabandi online in Patna 2026"*).
4. Wait ~20 seconds — title, body (with H2/H3), excerpt, tags all auto-fill.
5. **Review and edit** — never publish AI content blindly. Add your local touches, photos, links.
6. Click **🔍 Auto-fill SEO** to refresh meta description + tags from final body.
7. Set `publishedAt` to a future date/time (e.g. tomorrow 9 AM).
8. **Save as draft** (do NOT click Publish).
9. The hourly cron job (`auto-publish-posts`) auto-publishes once the time arrives.

**Suggested cadence:**
- Generate 5–10 drafts on Sunday.
- Schedule them across the week (1 per day, 9 AM).
- The system publishes them automatically.

### 3.4 Monitoring Blog Performance

The site **doesn't yet** track blog analytics. You have 3 options (pick one in next phase):

| Tool | Cost | What you get |
|---|---|---|
| **Google Analytics 4** (recommended) | Free | Page views, time on page, traffic sources, top posts |
| **Google Search Console** | Free | What people search before landing on your blog, ranking positions |
| **Plausible / Umami** | $9/mo or self-host | Privacy-friendly, simpler dashboard |

**Recommended setup:** GA4 + Search Console (both free). I can wire them up in 30 min — just give the IDs.

**Monthly review checklist:**
- Top 5 blog posts by traffic → write more on those topics.
- Search Console queries with high impressions but low clicks → improve title/meta.
- Posts with 0 traffic after 30 days → rewrite or unpublish.

---

## 4. Other Important Information

### 4.1 What's Already Live ✅
- Customer website (homepage, service pages, contact, about, pricing/FAQ, blog, city page).
- Lead capture forms → saved to database.
- WhatsApp floating button (linked to **7464026177**).
- Cookie consent banner (GDPR/India DPDP-friendly).
- AI blog generator + SEO auto-fill + hourly auto-publish cron.
- Sanity Studio at `/studio` for blog management.

### 4.2 What's NOT Built Yet ⚠️
| Feature | Priority | Effort |
|---|---|---|
| Admin dashboard (login + lead management) | 🔴 High | 1–2 weeks |
| Razorpay payment integration | 🔴 High | 1 week |
| WhatsApp auto-notifications (Interakt/Wati) | 🟡 Medium | 1 week |
| Google Analytics + Meta Pixel | 🟡 Medium | 2–3 days |
| Order tracking page for customers | 🟡 Medium | 1 week |
| Social auto-posting (blog → WhatsApp/FB/LinkedIn) | 🟢 Low | 3 days |
| SSR/prerendering for blog SEO | 🟢 Low | 1 week |
| Multi-city expansion | 🟢 Low | varies |

### 4.3 Security Notes
- All forms validate input (Zod).
- Database uses RLS (Row Level Security) — leads are write-only from public, no public read.
- ⚠️ One open security finding: the `leads` table RLS could be tightened (route inserts through an edge function with rate-limiting). Recommended fix in next sprint.
- HTTPS enforced everywhere (auto by Lovable).
- No private API keys in frontend code.

### 4.4 Costs Going Forward (Operational)
| Item | Cost |
|---|---|
| Lovable hosting | Free tier covers low traffic; ~$20/mo for higher tiers |
| Lovable Cloud (DB + Edge Functions) | Free tier generous; pay-as-you-grow |
| Lovable AI Gateway (blog generation) | Free credits monthly; ~₹0.50–₹2 per blog post after |
| Sanity.io | Free tier: 3 users, 10k docs (more than enough) |
| Hostinger domain | ~₹700–1000/year |
| Razorpay (when added) | 2% per transaction (no monthly fee) |
| Interakt / Wati WhatsApp (when added) | ₹999–₹2,499/mo |
| Google Analytics | Free |

**Realistic monthly running cost (current state):** ₹0–₹500.
**With WhatsApp + payments live:** ₹1,000–₹3,000/mo + 2% on transactions.

### 4.5 Key Files & Locations (for any future developer)
- Customer pages: `src/pages/`
- Reusable components: `src/components/`
- Sanity Studio config: `src/sanity/config.ts`, `src/sanity/actions.tsx`
- Edge functions: `supabase/functions/`
- Design tokens: `src/index.css`, `tailwind.config.ts`
- Session logs: `docs/sessions/` (one .md per build session)
- PRD: `docs/BhumiSeva_PRD_and_Admin_Plan.md`

### 4.6 Backups & Continuity
- **Code:** Lives in Lovable, auto-versioned. You can revert to any prior version.
- **Database:** Lovable Cloud handles automated backups.
- **Blog content (Sanity):** Sanity keeps full version history of every post.
- **Domain:** Stays with you at Hostinger — Lovable only points to it.
- ⚠️ Recommend: monthly manual CSV export of `leads` table as backup.

---

## 5. Pricing — Final Amount

### 5.1 Basic Setup (What's delivered NOW) — One-time
| Deliverable | Value |
|---|---|
| Custom-designed customer website (10+ pages) | ₹35,000 |
| Multi-step lead capture forms with DB integration | ₹15,000 |
| Sanity Studio + Blog system | ₹12,000 |
| **AI Blog Writer (custom edge function + Studio UI)** | ₹18,000 |
| **SEO Auto-fill (custom edge function + Studio UI)** | ₹8,000 |
| **Auto-Publish Scheduler (cron + edge function)** | ₹10,000 |
| WhatsApp button + Trust bar + Reviews + Cookie consent | ₹5,000 |
| SEO basics (meta tags, JSON-LD, sitemap-ready) | ₹7,000 |
| Deployment + custom domain setup | ₹5,000 |
| Documentation (PRD, session logs, this handover) | ₹5,000 |
| **TOTAL (Basic Setup, one-time)** | **₹1,20,000** |

> **Recommended quote to client: ₹85,000 – ₹1,20,000 one-time**
> (₹85k if budget-sensitive; ₹1.2L is fair market value for what's been built.)

### 5.2 Recurring (Monthly Maintenance) — Highly Recommended
| Tier | What's included | Price |
|---|---|---|
| **Basic** | Bug fixes, small text/image edits (up to 4/mo), uptime monitoring | **₹3,000/mo** |
| **Standard** ⭐ | Basic + 2 new blog topic prompts/mo + Google Analytics review + 1 small feature/mo | **₹6,000/mo** |
| **Pro** | Standard + WhatsApp template management + monthly performance report + priority support | **₹10,000/mo** |

> **Recommended pitch:** Quote ₹6,000/mo Standard (most clients pick the middle option).

### 5.3 Add-Ons (Phase 2+) — One-time each
| Feature | Price |
|---|---|
| Admin Dashboard (login + lead management + CSV export) | ₹25,000 – ₹35,000 |
| Razorpay Payment Integration | ₹15,000 – ₹20,000 |
| WhatsApp Auto-Notifications (Interakt/Wati) | ₹15,000 + ₹999/mo to BSP |
| Google Analytics + Meta Pixel + Search Console setup | ₹5,000 |
| Order Tracking page for customers | ₹12,000 |
| Social auto-posting (blog → WhatsApp/FB/LinkedIn via Zapier) | ₹8,000 + Zapier subscription |
| SSR / Prerendering for better blog SEO | ₹15,000 |
| Multi-city expansion (Gaya, Muzaffarpur, etc.) | ₹10,000 per city |
| SMS notifications (MSG91) | ₹8,000 + per-SMS cost |
| Customer login + order dashboard | ₹20,000 |

### 5.4 Total Pitch Summary (give this to the client)
> **One-time setup: ₹1,00,000** (covers everything live today including AI blog automation)
> **Monthly maintenance: ₹6,000/mo** (Standard tier — keeps the system healthy and growing)
> **Phase 2 (Admin + Payments + WhatsApp): ₹55,000–₹70,000** (when you're ready)

---

## Quick Reference

| Need | Where to go |
|---|---|
| See leads | Lovable editor → Cloud → Database → `leads` |
| Write a blog | `yourdomain.com/studio` |
| Edit website code | Lovable editor (chat with me!) |
| Check what was built | `docs/sessions/` |
| Customer enquiries | WhatsApp **7464026177** |
| Push UI changes live | Click **Publish → Update** |

---

*Generated April 19, 2026 — keep this file updated as the project grows.*
