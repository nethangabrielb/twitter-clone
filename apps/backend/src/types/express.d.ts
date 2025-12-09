import 'express';

import type { User } from './user';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
