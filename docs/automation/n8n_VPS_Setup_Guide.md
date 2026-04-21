# n8n on Hostinger VPS — Multi-Site AI Blog Automation

**Goal:** Run a self-hosted n8n instance on your Hostinger VPS that generates SEO blog drafts every morning, writes them to Sanity, and notifies you on Telegram. Same workflow scales to any number of websites.

**Time to first working pipeline:** ~2 hours, one time.
**Maintenance after that:** ~0. Just open the n8n UI when you want to monitor or change something.

---

## 0. Prerequisites

| Item | Where to get it | Required? |
|---|---|---|
| Hostinger VPS (Ubuntu 22.04, **min 2 GB RAM**) | Hostinger panel → VPS | Yes |
| A subdomain like `n8n.bhumiseva.in` | Your DNS provider | Yes |
| Sanity write token | sanity.io/manage → BhumiSeva → API → Tokens (Editor) | Yes — you already have one as `SANITY_WRITE_TOKEN` |
| AI API access | Reuse `LOVABLE_API_KEY` (free quota) **OR** Anthropic/OpenAI key | Yes |
| Telegram bot (alerts) | Chat with `@BotFather` on Telegram → `/newbot` → save token + your chat ID | Optional but recommended |

---

## 1. Provision the VPS (10 min)

1. In Hostinger panel: **VPS → Create instance** → Ubuntu 22.04 → smallest 2 GB plan.
2. Note the **public IP**.
3. In your DNS provider, create an **A record**: `n8n` → `<vps-ip>`. Wait 5–10 min for propagation.
4. SSH in:
   ```bash
   ssh root@<vps-ip>
   ```

---

## 2. Install Docker + Caddy (10 min)

Run these one by one:

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Caddy (auto-HTTPS reverse proxy — easier than nginx)
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy
```

---

## 3. Configure Caddy for HTTPS (2 min)

Edit `/etc/caddy/Caddyfile`:

```bash
nano /etc/caddy/Caddyfile
```

Replace contents with:

```
n8n.bhumiseva.in {
    reverse_proxy localhost:5678
}
```

Save (`Ctrl+O`, `Enter`, `Ctrl+X`), then:

```bash
systemctl restart caddy
```

Caddy will auto-issue a Let's Encrypt SSL cert. Done.

---

## 4. Run n8n (5 min)

```bash
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 127.0.0.1:5678:5678 \
  -e N8N_HOST=n8n.bhumiseva.in \
  -e N8N_PROTOCOL=https \
  -e WEBHOOK_URL=https://n8n.bhumiseva.in/ \
  -e GENERIC_TIMEZONE=Asia/Kolkata \
  -e TZ=Asia/Kolkata \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

Open `https://n8n.bhumiseva.in` in your browser → create owner account. You're in.

---

## 5. Add Credentials in n8n (5 min, one time)

In n8n UI → **Credentials → New**:

| Credential name | Type | Value |
|---|---|---|
| `Sanity BhumiSeva` | HTTP Header Auth | Header name: `Authorization`, Header value: `Bearer <SANITY_WRITE_TOKEN>` |
| `Lovable AI` | HTTP Header Auth | Header name: `Authorization`, Header value: `Bearer <LOVABLE_API_KEY>` |
| `Telegram Bot` | Telegram API | Access token from `@BotFather` |

Anthropic / OpenAI / Google Gemini credentials can be added later if you want to swap models.

---

## 6. Import the Starter Workflow (2 min)

1. Download `docs/automation/n8n_workflow_bhumiseva.json` from this repo.
2. In n8n: **Workflows → Import from File** → pick the JSON.
3. Open each node with a 🔑 icon and re-select the credential you created in step 5.
4. In the **Sanity Write** node, replace `YOUR_SANITY_PROJECT_ID` with your actual project ID (from `src/lib/sanity.ts`).
5. In the **Telegram Notify** node, set your chat ID.
6. Click **Active** toggle (top-right) → workflow is live.

---

## 7. Test it Once

- Click **Execute Workflow** (manual run button).
- Watch each node turn green. Click any node to inspect its input/output.
- Open Sanity Studio at `/studio` → you should see a new draft post with `publishedAt` set to tomorrow 9 AM.
- Telegram should ping with the title.

The existing Lovable Cloud `auto-publish-posts` cron will publish it automatically when its time comes. **Nothing else to wire.**

---

## 8. Swap the AI Model (the "model dropdown" you asked for)

The AI call lives in **one HTTP Request node** named `Generate with AI`. To swap providers:

| Provider | URL | Auth credential | `model` value in body |
|---|---|---|---|
| **Lovable AI (default, free quota)** | `https://ai.gateway.lovable.dev/v1/chat/completions` | Lovable AI | `google/gemini-3-flash-preview` |
| Lovable AI — premium | same URL | Lovable AI | `openai/gpt-5` |
| Anthropic Claude | `https://api.anthropic.com/v1/messages` | Anthropic | `claude-sonnet-4-5` (different body format) |
| OpenAI direct | `https://api.openai.com/v1/chat/completions` | OpenAI | `gpt-5` |
| Local Ollama (free) | `http://localhost:11434/v1/chat/completions` | none | `llama3.1:8b` |

Just open the node → change URL + credential + `model` field → save. No code changes, no redeploy.

---

## 9. Add a Second Website (5 min)

1. **Workflows → Right-click the BhumiSeva workflow → Duplicate.**
2. Rename to e.g. `Daily Blog — EduSeva`.
3. Open the **Sanity Write** node → change the project ID + Sanity credential.
4. Open the **Topic Picker** node → change the keyword list to the new niche.
5. Activate. Done — same instance, same UI, totally independent runs.

You can host **dozens** of site workflows on one n8n instance.

---

## 10. Monitoring (the UI you wanted)

- **Executions tab** — every run, every node, full input/output. Click any past run to replay.
- **Workflow editor** — visual flowchart, drag-edit any node.
- **Error workflow** — set under Settings → workflow auto-runs a Telegram alert on failure.
- **Manual trigger** — "Execute Workflow" button for testing on demand.
- **Webhook trigger** — replace the schedule node with a webhook to trigger from Google Sheets / Zapier / your admin dashboard.

---

## 11. Backup

All n8n data lives in the Docker volume `n8n_data`. Back it up weekly:

```bash
docker run --rm -v n8n_data:/data -v $(pwd):/backup ubuntu \
  tar czf /backup/n8n-backup-$(date +%F).tar.gz /data
```

Copy the resulting `.tar.gz` off the VPS (e.g. to Google Drive via `rclone`).

---

## 12. Troubleshooting

| Symptom | Fix |
|---|---|
| `n8n.bhumiseva.in` shows "connection refused" | DNS not propagated yet, or Caddy not running (`systemctl status caddy`) |
| HTTPS cert error | Wait 2 min — Caddy is still issuing it. Check `journalctl -u caddy -f`. |
| Sanity write returns 401 | Token wrong / expired. Regenerate in sanity.io/manage → API → Tokens. |
| Sanity write returns 403 | Token doesn't have Editor permission. |
| AI node returns 429 | Rate-limited. Either wait, switch model, or add credits. |
| AI node returns 402 | Out of Lovable AI credits → top up in Lovable workspace settings. |
| Draft created but never publishes | Check that the Lovable Cloud `auto-publish-posts` cron is still scheduled. `publishedAt` must be in the past. |

---

## What you DON'T need to do

- ❌ No code to write or maintain.
- ❌ No need to change anything in the Lovable project — Sanity is the single source of truth.
- ❌ No need to touch the existing `auto-publish-posts` edge function — it keeps doing its job.
- ❌ No need to install Node.js, PM2, or a custom bot. n8n replaces all of it.

---

**Next step after setup:** open `n8n_workflow_bhumiseva.json`, import it, run it once, and watch your first AI-generated draft appear in Sanity Studio. 🚀