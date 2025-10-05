import { Request, Response } from 'express';

import postService from '../../services/postService';
import { Post } from '../../types/post';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const postsController = (() => {
  const createPost = async (
    req: Request<object, object, Post>,
    res: Response
  ) => {
    try {
      const newPost = await postService.createPost(req.body);

      res.json({
        status: 'success',
        message: 'Post created successfully!',
        data: newPost,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getPost = async (req: Request<{ postId: string }>, res: Response) => {
    try {
      const post = await postService.getPost(Number(req.params.postId));

      res.json({
        status: 'success',
        message: 'Post fetched success',
        data: post,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { getPost, createPost };
})();

export default postsController;
