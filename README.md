# Next.js + Express Monorepo Template

A production-ready monorepo template featuring Next.js 15 frontend and Express backend with TypeScript, Prisma ORM, and authentication.

## 🚀 Features

### Frontend
- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **shadcn/ui** components
- **TanStack Query** for data fetching
- **React Hook Form + Zod** for form validation
- **Lucide React** icons

### Backend
- **Express 5** with TypeScript
- **Prisma ORM** with PostgreSQL
- **JWT Authentication** with bcrypt
- **Passport.js** with Google OAuth
- **Express Validator** for request validation
- **CORS** enabled
- Clean architecture with layered structure

## 📦 Project Structure

```
.
├── apps/
│   ├── backend/          # Express API server
│   │   ├── prisma/       # Database schema and migrations
│   │   └── src/
│   │       ├── config/   # Configuration files (Passport, etc.)
│   │       ├── controllers/  # Request handlers
│   │       ├── middlewares/  # Custom middleware
│   │       ├── repositories/ # Database access layer
│   │       ├── routes/   # API routes
│   │       ├── services/ # Business logic
│   │       ├── types/    # TypeScript types
│   │       └── validators/  # Request validation rules
│   │
│   └── frontend/         # Next.js application
│       └── src/
│           ├── app/      # App Router pages
│           ├── components/  # React components
│           ├── lib/      # Utilities
│           ├── providers/   # Context providers
│           ├── schemas/  # Zod schemas
│           └── types/    # TypeScript types
│
└── packages/             # Shared packages (if any)
```

## 🛠️ Prerequisites

- **Node.js** 20+ 
- **pnpm** 10.17.1+
- **PostgreSQL** database

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd next-express-template

# Install dependencies
pnpm install
```

### 2. Environment Setup

Create an `.env` file in the backend for db and google information:

**Backend (`apps/backend/.env`):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-jwt-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Setup

```bash
# Navigate to backend
cd apps/backend

# Run migrations
pnpm prisma migrate dev

# Generate Prisma Client
pnpm prisma generate
```

### 4. Run Development Servers

```bash
# Run both frontend and backend concurrently
pnpm dev

# Or run them individually:
pnpm frontend  # Frontend only (http://localhost:3000)
pnpm backend   # Backend only (http://localhost:3001)
```

## 📝 Available Scripts

### Root Level
- `pnpm dev` - Run both frontend and backend in parallel
- `pnpm frontend` - Run frontend only
- `pnpm backend` - Run backend only

### Backend (`apps/backend`)
- `pnpm dev` - Start development server with hot reload
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint

### Frontend (`apps/frontend`)
- `pnpm dev` - Start Next.js dev server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🏗️ Architecture

### Backend Architecture

The backend follows a **layered architecture**:

1. **Routes** → Define API endpoints
2. **Controllers** → Handle HTTP requests/responses
3. **Services** → Contain business logic
4. **Repositories** → Database access layer
5. **Middlewares** → Authentication, validation, etc.

### Authentication Flow

- JWT-based authentication
- Google OAuth integration via Passport.js
- Password hashing with bcryptjs
- Protected routes with authentication middleware

## 🗄️ Database

### Prisma Schema

The project includes:
- User model with authentication
- Federated credentials for OAuth
- Migration history

To modify the schema:
```bash
cd apps/backend
# Edit prisma/schema.prisma
pnpm prisma migrate dev --name your_migration_name
```

## 🎨 Frontend Features

- **Modern UI** with shadcn/ui components
- **Type-safe forms** with React Hook Form + Zod
- **Optimistic updates** with TanStack Query
- **Responsive design** with Tailwind CSS
- **Animation utilities** with tw-animate-css

## 🔧 Tech Stack

| Category | Frontend | Backend |
|----------|----------|---------|
| Framework | Next.js 15 | Express 5 |
| Language | TypeScript | TypeScript |
| Database | - | Prisma + PostgreSQL |
| Styling | Tailwind CSS 4 | - |
| State Management | TanStack Query | - |
| Authentication | - | JWT + Passport.js |
| Validation | Zod | Express Validator |
| Dev Tools | ESLint, Prettier | ESLint, Prettier, Nodemon |

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using modern web technologies
