# AGENTS.md — Chirper

Audit context for coding agents. This file explains **why** Chirper is
structured the way it is, not just what exists — with extra emphasis on
auth/session handling and deployment topology, which is where the fragile
edge cases live.

## 1. Project overview

Chirper is a full-featured Twitter/X clone (posts, replies, likes,
bookmarks, follow graph, real-time direct messages, live notifications,
guest read-only mode, Google OAuth). It was built as the final project
for The Odin Project's Node.js curriculum (Odin-Book assignment), and is
a learning/production-leaning showcase.

It is a **pnpm monorepo** (`pnpm-workspace.yaml`, `packageManager:
pnpm@10.17.1`) with three workspaces:

- `apps/backend` — Node.js + Express API, TypeScript, Prisma, Socket.IO.
- `apps/frontend` — Next.js 16 App Router frontend (Vercel).
- `packages/shared` — `@twitter-clone/shared`, shared TypeScript types
  (e.g. `ChatMessage`) consumed by both ends. It exports raw `.ts`
  (`main: ./index.ts`), so it is type-only/compiled by the consuming app.

Live app: `https://chirper-frontend.vercel.app/`. No account is required
— "Continue as Guest" provides instant read-only access.

## 2. Tech stack (actual versions)

**Backend** (`apps/backend/package.json`):
- Express **^5.1.0**, TypeScript **^5.9.2** (ESM, `"type": "module"`,
  `tsx` for dev, `tsc` for build).
- Prisma **6.16.2** (`@prisma/client` + `prisma`). Client is generated
  to a **custom output**: `generator client { output = "../generated/prisma" }`
  (checked in under `apps/backend/generated/`, gitignored).
- PostgreSQL via Prisma `datasource` using `DATABASE_URL` + `DIRECT_URL`
  (split pooled/direct connection string — characteristic of a Neon
  serverless/pooler setup; see `prisma/schema.prisma`).
- Socket.IO **^4.8.3** server with `connectionStateRecovery`.
- Auth: Passport **^0.7.0** + `passport-google-oidc` **^0.1.0**,
  `jsonwebtoken` **^9.0.2**, `express-session` **^1.18.2**, `bcryptjs`
  **^3.0.2**, `cookie` + `cookie-parser`.
- Storage: `@supabase/supabase-js` **^2.79.0** (images/avatars).
- Uploads: `multer` **^2.0.2**. Compression: `compression`.

**Frontend** (`apps/frontend/package.json`):
- Next.js **16.0.7** (App Router, Turbopack), React **19.2.1**.
- TanStack React Query **^5.90.2**, Zustand **^5.0.8**, `socket.io-client`
  **^4.8.3**, Tailwind CSS **^4**, Radix UI **^1.4.3**, `next-themes`
  **^0.4.6**, `nextjs-toploader` **^3.9.17**, lucide-react,
  react-hook-form + zod.

**Environment variables in use** (do not rename without checking every
consumer):
- Frontend: `BACKEND_URL` (Next rewrites + `isAuthenticated` proxy),
  `NEXT_PUBLIC_API` (Socket.IO client URL), `NEXT_PUBLIC_SERVER_URL`
  (Google OAuth popup → backend).
- Backend: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CLIENT_URL`
  (CORS + Socket.IO origin), `SERVER_URL` (OAuth callback), `GOOGLE_*`,
  `SUPABASE_*`, `PORT` (default 5000).

## 3. Deployment topology

**Frontend on Vercel, backend on Heroku — separate domains. This is the
root cause of most past auth bugs. Treat it as a first-class constraint.**

- Backend: Heroku app `chirper-api`, built from the multi-stage
  `Dockerfile` at repo root via `heroku.yml` (docker web build). Exposes
  port **5000**, Docker `HEALTHCHECK` pings `GET /health` (checks status
  200 only). Git remotes confirm: `heroku` → chirper-api, `origin` →
  GitHub.
- Frontend: Vercel (`chirper-frontend.vercel.app`).
- **Cross-origin strategy:** the browser only ever talks to the Vercel
  origin for REST. `next.config.ts` rewrites `/api/:path*` →
  `${BACKEND_URL}/api/:path*` and `/health` → `${BACKEND_URL}/health`,
  so `Set-Cookie` responses from Heroku arrive to the browser as
  first-party cookies for the frontend domain. Socket.IO is the one
  exception — it connects **directly** to the backend
  (`process.env.NEXT_PUBLIC_API`) over `transports: ["websocket"]` with
  `withCredentials: true`.
- Backend runs on a **Heroku Eco dyno** (see section 7).

## 4. Key architectural patterns

**Layered backend (routes → controllers → services → repositories):**
- `routes/` split into `guest/` (public auth routes) and `admin/` (9
  domain routers, all behind auth middleware). Controllers mirror this:
  `controllers/guest/authController.ts` + `controllers/admin/*`.
- 9 service files and 9 repository files (post, comment, follow, like,
  bookmark, message, room, notification, user). Controllers handle
  HTTP, services handle business logic + Supabase uploads, repositories
  are the only layer touching Prisma.

**Auth middleware ordering is load-bearing** (`src/app.ts`):
```
/health                     → public
/api/auth/*                 → public (register/login/logout/google)
/api/users*                 → public (includes /api/users?current=true)
authMiddleware              → JWT cookie verify
guestAuthMiddleware         → blocks writes for guest sessions
all other /api/*            → protected
```
- `authMiddleware` reads `req.cookies.token`, `jwt.verify`s it against
  `JWT_SECRET`, attaches `req.user`, else 401/403. It also exports
  `isSocketValid` used by Socket.IO.
- `guestAuthMiddleware` returns 403 for guests on POST/PUT/PATCH/DELETE,
  with hardcoded exceptions for `/api/auth/login|register|logout`.

**Prisma structure:**
- `User` ↔ `Follow` (named relations "Followings"/"Followers",
  `@@unique([followerId, followingId])`).
- **Threaded replies are a self-referential `Post` relation**
  ("PostReplies"): `Post.replies Post[]` + `Post.reply Post?` on
  `replyId Int?`. The feed filters `replyId: null`; replies are fetched
  nested and **ordered by like count** (`orderBy: { Like: { _count:
  'desc' } }`), top-level posts by `createdAt desc`.
- Soft delete via `Post.deleted Boolean`; queries filter
  `deleted: false` (replies too).
- `PostLike`/`Bookmark` are `@@unique([userId, postId])`.
- `FederatedCredentials` maps `provider + subject → userId` for OAuth.
- **Warning:** `postRepository.ts` is ~1000 lines of deeply nested
  `include`s (post → replies → reply → nested replies → users → counts →
  likes → bookmarks). Any change to the Post model must consider these
  include shapes.

**Cursor pagination (infinite scroll):**
- `findAllByCursor(cursor)` / `findByFollowingCursor(userId, cursor)` use
  `orderBy: [{ createdAt: 'desc' }, { id: 'asc' }]`, `cursor: { id }`,
  `skip: 1`, `take: 20`. The cursor is the last post's `id`. Feed page
  and notifications page use TanStack `useInfiniteQuery`.

**Socket.IO** (`src/sockets/index.ts`):
- `io.use(isSocketValid)`: parses the `token` cookie from
  `socket.handshake.headers.cookie`, verifies JWT, sets
  `socket.data.userId`. Invalid → `next(new Error(...))`.
- Every event re-checks the sender via `validateEventSender(senderId,
  socket.data.userId)` (sender id must equal the authenticated socket
  user id) — e.g. `newMessage`, `joinRoom`, `leaveRoom`,
  `notification`. Events use `socket.to(room)` and `socket.broadcast`.
- `connectionStateRecovery: { maxDisconnectionDuration: 2min,
  skipMiddlewares: true }`.
- `sockets/handlers/*.ts` are empty dead files — the real handlers live
  in `sockets/index.ts`.

**Frontend patterns:**
- `src/proxy.ts` (Next.js middleware) does server-side route protection:
  reads the `token` cookie and calls `${BACKEND_URL}/api/auth/user` with
  it; redirects unauthenticated users to `/`; keeps guests out of
  everything except `/home`, `/post/*`, `/profile/*`. Matcher excludes
  `api|auth|health|_next/*|login|register|favicon|static assets`.
- `HealthGate` (`src/providers/health-gate.tsx`) wraps the provider tree
  and holds rendering until `GET /health` succeeds — a cold-start gate
  (see section 7).
- Providers: `query-provider` (TanStack), `user-provider` (fetches
  `/api/users?current=true`, always-stale), `socket-provider` (connects
  the socket once a real user exists), `theme-provider`.
- REST calls are same-origin (`/api/...`, `credentials: "include"`).

## 5. Auth flow — three strategies, one JWT httpOnly cookie

All strategies end in the same `token` httpOnly cookie, JWT-signed with
`JWT_SECRET`, `maxAge` 14 days. Cookie opts (in `authController`):
`httpOnly: true`, `secure: production`, `sameSite: production ? 'none' :
'lax'`, `path: '/'`.

1. **Email/password:** `POST /api/auth/login` →
   `UserService.loginUser` (bcrypt) → JWT → set cookie. Register creates
   a user (and, via Google strategy, creates default-avatar users with
   `password: ''`).
2. **Guest:** `POST /api/auth/login?guest=true` → signs a synthetic
   user (`id: 999999999`, `isGuest: true`) into the same cookie.
   Read-only enforcement lives in `guestAuthMiddleware` (backend) and
   `proxy.ts` (frontend) + a `guest-dialog` UI for blocked writes.
3. **Google OAuth (popup flow):** the frontend opens
   `${NEXT_PUBLIC_SERVER_URL}/api/auth/login/google` **directly on the
   backend origin** in a popup (NOT through the Next proxy — this is
   intentional, see section 6). Passport (`passport-google-oidc`)
   handles the dance; the callback
   `/api/auth/oauth2/redirect/google` (`authController.redirect`) signs
   a JWT from `req.user`, **destroys the express session**, then serves
   an HTML page that runs
   `window.opener.postMessage({ success: true, token }, '*')` and closes
   the popup. The frontend's `FormButton` (in
   `src/components/button.tsx`) listens for that message and navigates
   to the frontend's own `/auth/callback?token=...` route
   (`src/app/auth/callback/route.ts`), which **sets the httpOnly token
   cookie on the Vercel domain** and redirects to `/onboarding`.
   `src/app/auth/success/page.tsx` is the leftover popup "success"
   page.

**Socket.IO auth:** each connection authenticates with the **same
`token` cookie** via `isSocketValid` (see section 4), so REST auth and
websocket auth stay in sync as long as the cookie is present.

**Validation endpoint:** `/api/auth/user`
(`authController.validateUserAuthorization`) is what `proxy.ts` and the
frontend use to check a token — it returns `{ authorized: boolean,
isGuest?: boolean }` (not a bare boolean; commits `04f1a21`,
`926feff`).

## 6. Known past issues (why the current shape exists)

**Root cause shared by all of these: the frontend (Vercel) and backend
(Heroku) are different origins, and browsers enforce same-site cookie
rules across origins.**

1. **Brave browser dropped the cross-origin auth cookie.** Brave (and
   other strict browsers) blocked `Set-Cookie` coming from the Heroku
   origin, so the JWT cookie never persisted. **Fix:** all `/api/*`
   calls are routed through Next.js rewrites (`next.config.ts`) so the
   browser sees same-origin requests and the proxied `Set-Cookie` is
   stored as a first-party cookie on the frontend domain. For OAuth, the
   cookie is set by the frontend's own `/auth/callback` route rather
   than the backend response. **Why:** cookie storage is origin-scoped;
   do not reintroduce direct cross-origin `fetch`es that rely on the
   backend setting the auth cookie.

2. **Google OAuth session mismatch in production.** Passport's OAuth
   state uses `express-session` with the default in-memory store. When
   OAuth initiation was routed through the Next proxy, the session was
   created on one server/host path while the callback landed on the
   backend, splitting session state and failing Passport's state check.
   **Fix:** OAuth initiation is **bypassed around the proxy** — the
   popup opens the backend URL directly
   (`NEXT_PUBLIC_SERVER_URL/api/auth/login/google`, commit `1aca5a2`),
   so initiation + callback both stay on the Heroku origin and the
   session state never leaves that server. The token then crosses back
   to the frontend via `postMessage`, and the backend destroys the
   session immediately after use (`cfffc26`) to avoid leaking in-memory
   state. **Why:** in-process session state is per-server/per-process;
   any hop through a different host invalidates it. If the OAuth flow is
   ever reworked, the initiation and callback must remain on the same
   origin/server.

Related hardening visible in history: cookie `SameSite=None; Secure`
for production (`7662ef5`, `d31ccd9`, `252f77b`), `postMessage`
replacing direct redirects/token-in-URL for cross-origin delivery
(`64b4072`, `9f3e9b5`, `0feaf45`), and `proxy.ts` matcher exclusions so
auth/public pages aren't hijacked by the route guard (`35572a0`,
`8c661c1`).

## 7. Current focus areas for review

- **Heroku Eco dyno cold starts.** The backend sleeps after ~30 min of
  inactivity and takes ~5–15 s to cold-start on the next request. The
  `HealthGate` provider and the JSON `/health` route (plus the `/health`
  rewrite in `next.config.ts`) exist specifically to absorb that: the
  gate retries `/health` with backoff (2–3 s) for up to 45 s before
  showing a refresh error. The gate wraps the provider tree so no app
  requests (user fetch, socket connect) fire until the dyno is warm.
- **Socket.IO reconnection across a cold start is NOT thoroughly
  tested** and is the current priority audit area. The socket connects
  directly to `NEXT_PUBLIC_API`; when the dyno sleeps, in-flight
  connections drop and the client's `reconnectionAttempts: 5,
  reconnectionDelay: 1000` config may or may not recover cleanly once
  the dyno wakes. `connectionStateRecovery` (2-min window) only helps
  within that window and is backend-side. Any change to the socket
  client config, the auth cookie, or dyno sizing should be checked
  against the cold-start + reconnect path.
- Keep in mind when touching anything auth-related: it runs cross-origin
  (section 3), cookie-setting is proxy/callback-route dependent
  (section 6), and the OAuth popup flow must not be routed through the
  Next proxy.

## 8. Commands

Root (`package.json`):
- `pnpm dev` — run `frontend` and `backend` in parallel.
- `pnpm frontend` — frontend dev only.
- `pnpm backend` — backend dev only.
- `pnpm test` — delegates to the backend Vitest suite (`pnpm --filter backend test`).
- `pnpm lint` / `pnpm typecheck` — not defined at root; run per app.

Backend (`apps/backend/package.json`):
- `pnpm dev` — `tsx watch ./src/app.ts`.
- `pnpm test` — `vitest run` (tests live in `apps/backend/tests/`, config in
  `vitest.config.ts`, env in `tests/setup.ts`). Unit tests mock the service
  layer with `vi.mock`/`vi.hoisted`; ownership/actor logic is asserted at the
  controller level.
- `pnpm typecheck` — `tsc --noEmit` (only covers `src`, not `tests/`).
- `pnpm lint` — `pnpm eslint .`.
- `pnpm build` — `tsc` (used by the Dockerfile).
- `pnpm seed:users`, `pnpm seed:social`, `pnpm delete:seed` —
  Faker seeding/cleanup via `tsx`.
- `npx prisma migrate dev` (against `apps/backend`) for schema changes.

Frontend (`apps/frontend/package.json`):
- `pnpm dev` — `next dev --turbopack`.
- `pnpm build` — `next build --turbopack`.
- `pnpm start` — `next start`.
- `pnpm lint` — `eslint` (currently crashes on config load with an
  `@eslint/eslintrc` circular-structure error in this environment —
  pre-existing, unrelated to app code; `tsc --noEmit` is the reliable
  check).

Notes:
- Backend ESM requires explicit `.ts` extensions on relative imports
  (e.g. `./middlewares/authMiddleware.ts`). Preserve this convention.
- Backend unit tests use Vitest (see commands above); the frontend has no
  test setup.
