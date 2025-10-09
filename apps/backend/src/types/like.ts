interface PostLike {
  userId: number;
  postId: number;
}

interface CommentLike {
  userId: number;
  commentId: number;
}

export { PostLike, CommentLike };
