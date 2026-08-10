import { describe, expect, it, vi } from 'vitest';

const { getCommentMock, deleteCommentMock } = vi.hoisted(() => ({
  getCommentMock: vi.fn(),
  deleteCommentMock: vi.fn(),
}));

vi.mock('../src/services/commentService.ts', () => ({
  default: {
    createComment: vi.fn(),
    getComment: getCommentMock,
    deleteComment: deleteCommentMock,
  },
}));

import commentsController from '../src/controllers/admin/commentsController.ts';
import { createReq, createRes } from './helpers.ts';

describe('commentsController.deleteComment', () => {
  it('rejects when the authenticated user does not own the comment', async () => {
    getCommentMock.mockResolvedValue({ id: 3, userId: 1 });
    const req = createReq({ params: { commentId: '3' }, user: { id: 2 } });
    const res = createRes();

    await commentsController.deleteComment(req as never, res as never);

    expect(deleteCommentMock).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'You are unauthorized to perform this action.',
      })
    );
  });

  it('deletes the comment when the authenticated user owns it', async () => {
    getCommentMock.mockResolvedValue({ id: 3, userId: 2 });
    deleteCommentMock.mockResolvedValue({ id: 3 });
    const req = createReq({ params: { commentId: '3' }, user: { id: 2 } });
    const res = createRes();

    await commentsController.deleteComment(req as never, res as never);

    expect(deleteCommentMock).toHaveBeenCalledWith(3);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success' })
    );
  });
});
