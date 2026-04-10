# Seva Property Link

## Getting Started

### Prerequisites
- Node.js 18+ or [Bun](https://bun.sh)
- A [Supabase](https://supabase.com) project

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushhCreator/seva-property-link.git
   cd seva-property-link
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Open .env and fill in your Supabase credentials
   ```
   > ⚠️  **Never commit `.env`** – it contains secrets and is listed in `.gitignore`.

3. **Install dependencies**
   ```bash
   npm install
   # or: bun install
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

## Security

See [SECURITY.md](./SECURITY.md) for details on:
- How to set up `.env` safely
- History rewrite instructions (a Supabase key was previously leaked — rotate it now)
- How to report security vulnerabilities
