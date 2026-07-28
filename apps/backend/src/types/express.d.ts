import 'express';

import type { User } from './user.ts';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
