import { describe, expect, it } from 'vitest';

import {
  authMiddleware,
  guestAuthMiddleware,
} from '../src/middlewares/authMiddleware.ts';
import userRouter from '../src/routes/admin/userRoutes.ts';

describe('userRouter guest protection wiring', () => {
  it('mounts guestAuthMiddleware after authMiddleware so guests cannot reach protected routes', () => {
    const handles = userRouter.stack.map(layer => layer.handle);

    const authIdx = handles.indexOf(authMiddleware);
    const guestIdx = handles.indexOf(guestAuthMiddleware);

    expect(authIdx).toBeGreaterThan(-1);
    expect(guestIdx).toBeGreaterThan(-1);
    expect(guestIdx).toBeGreaterThan(authIdx);
  });
});
