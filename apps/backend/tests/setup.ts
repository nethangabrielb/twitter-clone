// Global test setup: provide the env vars modules read at import time so
// importing controllers/services doesn't throw (e.g. supabase's createClient
// requires a URL, prisma resolves DATABASE_URL lazily).
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.SERVER_URL = 'http://localhost:5000';
process.env.DATABASE_URL =
  'postgresql://test:test@localhost:5432/chirper?schema=public';
process.env.DIRECT_URL = 'postgresql://test:test@localhost:5432/chirper';
