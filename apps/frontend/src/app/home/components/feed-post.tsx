"use client";

import { Post } from "@/types/post";

type Props = {
  post: Post;
};

const FeedPost = ({ post }: Props) => {
  return (
    <div className="flex gap-4 p-4 border-b border-b-border">
      <img
        src={post.user.avatar}
        alt="User icon"
        className="rounded-full object-cover size-12"
      />
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <p className="font-bold text-text space tracking-[0.2px] text-[18px]">
            {post.user.name}
          </p>
          <p className="text-darker font-light text-[15px]">
            @{post.user.username}
          </p>
        </div>
        <p className="text-text text-[15px]">{post.content}</p>
      </div>
    </div>
  );
};

export default FeedPost;
