import postRepository from '../repositories/postRepository';
import { Post } from '../types/post';

const postService = {
  createPost: async (data: Post) => {
    const newPost = await postRepository.create(data);
    if (!newPost) {
      throw new Error('There was a problem making a post');
    }
    return newPost;
  },
  getPost: async (postId: number) => {
    const post = await postRepository.get(postId);
    if (!post) {
      throw new Error('There was a problem fetching the post');
    }
    return post;
  },
};

export default postService;
