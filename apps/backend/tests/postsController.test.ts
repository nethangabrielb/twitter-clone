import { describe, expect, it, vi } from 'vitest';

const { createPostMock, deletePostMock, getPostAuthorIdMock } = vi.hoisted(
  () => ({
    createPostMock: vi.fn(),
    deletePostMock: vi.fn(),
    getPostAuthorIdMock: vi.fn(),
  })
);

vi.mock('../src/services/postService.ts', () => ({
  default: {
    createPost: createPostMock,
    getPost: vi.fn(),
    getPosts: vi.fn(),
    getPostsCursorPagination: vi.fn(),
    deletePost: deletePostMock,
    getPostAuthorId: getPostAuthorIdMock,
    getUserReplies: vi.fn(),
    getUserLiked: vi.fn(),
    getBookmarkedPosts: vi.fn(),
    getPostsByFollowingInitial: vi.fn(),
    getPostsByFollowing: vi.fn(),
  },
}));

import postsController from '../src/controllers/admin/postsController.ts';
import { createReq, createRes } from './helpers.ts';

describe('postsController.createPost', () => {
  it('always uses the authenticated user id, ignoring any userId in the body', async () => {
    createPostMock.mockResolvedValue({ id: 1 });
    const req = createReq({
      body: { content: 'hello', userId: 999 },
      user: { id: 7 },
    });
    const res = createRes();

    await postsController.createPost(req as never, res as never);

    expect(createPostMock).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'hello', userId: 7 }),
      null
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success' })
    );
  });
});

describe('postsController.deletePost', () => {
  it('rejects when the authenticated user is not the post author', async () => {
    getPostAuthorIdMock.mockResolvedValue(1);
    const req = createReq({ params: { postId: '10' }, user: { id: 2 } });
    const res = createRes();

    await postsController.deletePost(req as never, res as never);

    expect(deletePostMock).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'You are unauthorized to perform this action.',
      })
    );
  });

  it('deletes the post when the authenticated user is the author', async () => {
    getPostAuthorIdMock.mockResolvedValue(2);
    deletePostMock.mockResolvedValue({ id: 10 });
    const req = createReq({ params: { postId: '10' }, user: { id: 2 } });
    const res = createRes();

    await postsController.deletePost(req as never, res as never);

    expect(deletePostMock).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success' })
    );
  });
});
