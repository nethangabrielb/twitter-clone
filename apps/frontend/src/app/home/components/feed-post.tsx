"use client";

import { Post } from "@/types/post";

type Props = {
  post: Post;
};

const FeedPost = ({ post }: Props) => {
  return (
    <div className="flex p-4 border-b border-b-border">
      <img src={post.user.avatar} alt="User icon" width={48} height={48} />
      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          <p>{post.user.name}</p>
          <p>@{post.user.username}</p>
        </div>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default FeedPost;
