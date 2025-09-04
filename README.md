## Next User Management

Minimal Next.js (App Router) project with Google social login (NextAuth) and basic user management using Prisma + SQLite.

### Features
- Google OAuth sign-in/out
- Prisma + SQLite persistence
- Role auto-promotion for a configured admin email
- Protected routes: dashboard, profile, admin user list
- Admin page lists all users
- Tailwind CSS styling

### Tech Stack
- Next.js 14 (App Router, TypeScript)
- NextAuth (Auth.js) with Google provider
- Prisma ORM (SQLite for local dev)
- Tailwind CSS

### Setup
1. Copy env template
```
cp .env.example .env.local
```
2. Fill in Google credentials (create at https://console.cloud.google.com/apis/credentials)
3. Generate a secret
```
openssl rand -base64 32
```
4. Install deps & generate Prisma client
```
npm install
npm run prisma:generate
```
5. Apply initial migration & open studio (optional)
```
npx prisma migrate dev --name init
npx prisma studio
```
6. Run the dev server
```
npm run dev
```
7. Visit http://localhost:3000

### Admin Role
The first time the user with `ADMIN_EMAIL` signs in, their role is updated to ADMIN automatically.

### Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – start production server
- `npm run prisma:migrate` – run migration (alias for initial init name)
- `npm run prisma:studio` – open Prisma Studio

### Profile REST API
- `GET /api/profile`: returns the authenticated user record
- `POST /api/profile`: initialize minimal profile fields on first login; only fills empty fields (idempotent)
- `PUT /api/profile`: update profile fields explicitly

Allowed fields: `firstName`, `lastName`, `displayName`, `bio`, `location`, `website`, `phone`.

Example init (first social login):
```
fetch('/api/profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ firstName: 'Ada', lastName: 'Lovelace', displayName: 'Ada' })
})
```

Example update (later edits):
```
fetch('/api/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bio: 'Computing pioneer', website: 'https://example.com' })
})
```

### Notes
- SQLite is fine for dev; swap `provider` and `DATABASE_URL` for Postgres/MySQL in `schema.prisma` for production.
- Ensure `NEXTAUTH_URL` matches your deployment URL when deploying.

### Next Steps / Ideas
- Add email verification
- Add audit log table
- Add password (credentials) provider
- Add user profile edit form

### Troubleshooting Login / Session
If user info not visible:
1. Confirm `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` match credentials in Google Cloud Console.
2. Ensure Authorized origin: http://localhost:3000 and redirect: http://localhost:3000/api/auth/callback/google.
3. Check session at /debug/session.
4. Delete local DB (prisma/dev.db*) and rerun migration if schema drift suspected.
5. Make sure cookies not blocked (try incognito window).
6. Verify `NEXTAUTH_URL` is http://localhost:3000 in `.env.local`.

---
MIT License
