"use client";

import { Heart } from "lucide-react";

import { Post } from "@/types/post";

type Props = {
  post: Post;
};

const FeedPost = ({ post }: Props) => {
  console.log(post);
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
        <div className="flex justify-start">
          {/* render likes */}
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-darker"></Heart>
            <p className="text-darker text-[13px]">{post._count.Like}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;
