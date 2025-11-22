import 'express';

import type { User } from './user';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
