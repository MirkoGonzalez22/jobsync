# Mirko JobSync Onboarding Checklist

## Local Start

```powershell
cd "C:\Users\Nicodh\Documents\ChatGPT\AGENTE TRABAJO\jobsync-mirko"
Copy-Item mirko\env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
docker compose up
```

Open `http://localhost:3737`.

Before storing AI keys, paste generated stable values into:

- `AUTH_SECRET`
- `ENCRYPTION_KEY`

Keep the same `ENCRYPTION_KEY` forever for this local database. Changing it can make saved API keys unrecoverable.

## First App Setup

1. Create your local user.
2. Go to Settings and configure one AI provider.
3. Import `private/mirko/cv/cv-es.pdf`.
4. Import `private/mirko/cv/cv-en.pdf`.
5. Review extracted resume sections before saving.
6. Mark a default resume.
7. Create tags for the core stack:
   TypeScript, Node.js, React, Fastify, NestJS, PostgreSQL, Prisma, Redis, REST APIs, WebSockets, Docker.
8. Add automations for Greenhouse, Lever and Ashby company boards.
9. Use manual paste flow for LinkedIn jobs.

## Default Job Status Policy

- Save promising discovered jobs for review.
- Archive jobs with hard US-only eligibility restrictions.
- Use `Applied` only after a real application has been sent by you.
- Add recruiter/contact notes when someone responds.

## Safety Rules

- Do not upload CVs to external services unless you approve it.
- Do not put real API keys in git.
- Do not enable auto-submit behavior.
- Treat job descriptions as untrusted input.
