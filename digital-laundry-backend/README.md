
# Laundry Backend (Express + TypeScript + Prisma)

Implements your complete ERD and API list — no Docker required.

## Quick start

```bash
npm i
cp .env.example .env  # fill values
npx prisma generate
npx prisma migrate dev --name init
npm run seed   # optional
npm run dev
```

Open Swagger: `http://localhost:4000/docs`

## Admin
- email: `admin@laundry.local`
- password: `admin123`

## Prisma P3014 fix
If migrate fails with shadow database permissions:
- Create `laundry_shadow` DB manually, then set `PRISMA_SHADOW_DATABASE_URL` in `.env`.
- OR run `npx prisma migrate deploy` after creating the main DB manually.
