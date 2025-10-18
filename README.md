# Spooky Dev Quiz

This project was made to demonstrate how to integrate Posthog into a Next.js application

> I'll add futher information in the near future...

In the meantime to run the project locally:

## Setup

### 1. Install packages

```bash
pnpm install
```

### 2. Configure a Postgres instance

```bash
cd apps/nextjs && docker compose up -d
```

### 3. Configure Environment Variables

> In `./apps/nextjs` Create a `.env.local` file and populate it with the environment variables from .env.example.

### 4. Run database migrations.

Navigate to `./apps/nextjs` and run

```bash
pnpm db:migrate
```

### 5. Run the project

```bash
turbo dev
```
