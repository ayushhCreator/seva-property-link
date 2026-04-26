# Security – Environment Variables & Secret Management

## ⚠️  A Secret Was Previously Committed

A Supabase anon key (`VITE_SUPABASE_PUBLISHABLE_KEY`) was accidentally committed in `.env`
in a previous commit.

**That key should be treated as compromised. Rotate it immediately in your Supabase project
dashboard: _Project Settings → API → Regenerate anon key_.**

---

## Setting Up `.env` Locally

1. Copy the template:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and replace every placeholder with your actual values.
3. **Never commit `.env`** – it is listed in `.gitignore` and must stay there.

---

## Why `.env` Must Never Be Committed

`.env` contains credentials that grant access to backend services. Once pushed to a public
repository, those credentials are publicly visible and should be considered compromised,
even after removal from the latest commit. Rotate any exposed credentials immediately.

---

## Rewriting Git History to Remove the Secret

> **Run these commands only after all open PRs have been merged or closed, and after
> coordinating with all collaborators.**

### Prerequisites

Install `git-filter-repo` (requires Python 3):

```bash
# macOS / Linux (pip)
pip install git-filter-repo

# macOS (Homebrew)
brew install git-filter-repo
```

### Steps

```bash
# 1. Clone a fresh, full copy of the repository (do NOT use your existing working copy)
git clone https://github.com/ayushhCreator/seva-property-link.git seva-clean
cd seva-clean

# 2. Remove .env from every commit in history
git filter-repo --path .env --invert-paths

# 3. Force-push all refs to GitHub
git push origin --force --all
git push origin --force --tags

# 4. Delete the local clone; re-clone for day-to-day work
cd ..
rm -rf seva-clean
git clone https://github.com/ayushhCreator/seva-property-link.git
```

### After the Force-Push

* **All collaborators** must discard their local clones and re-clone:
  ```bash
  # From outside the old repo directory
  git clone https://github.com/ayushhCreator/seva-property-link.git
  ```
  Or, if they must keep local changes:
  ```bash
  git fetch --all
  git reset --hard origin/main
  ```
* **Open pull requests** may show merge conflicts because their base commits are gone.
  Each PR branch should be rebased onto the new `main`:
  ```bash
  git fetch origin
  git rebase origin/main
  git push --force-with-lease
  ```
* GitHub's own "cached views" of the old commit may persist for a short time in GitHub's
  CDN/cache. Contact GitHub Support to request a cache purge if needed.

---

## Reporting Security Issues

If you discover a security vulnerability, please **do not** open a public issue.
Instead, email the maintainer directly or use
[GitHub Private Vulnerability Reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability).
