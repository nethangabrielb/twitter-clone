"use client";

import { CurrentUserPostDropdown } from "@/app/home/components/post-controls";
import useUser from "@/stores/user.store";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { Activity } from "react";

import postApi from "@/lib/api/post";
import { formatDate } from "@/lib/utils";

import { Post } from "@/types/post";
import { User } from "@/types/user";

type Props = {
  post: Post;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<Post[], Error>>;
};

const FeedPost = ({ post, refetch }: Props) => {
  const user = useUser((state) => state.user) as User;

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await postApi.deletePost(post.id);
      return res;
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        refetch();
        toast.success(res.message, {
          position: "top-center",
          style: {
            background: "#1d9bf0",
            color: "white",
            width: "fit-content",
          },
        });
      } else {
        toast.error(res.message);
      }
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <div className="flex gap-4 p-4 border-b border-b-border relative">
      <Activity mode={user.id === post.userId ? "visible" : "hidden"}>
        <CurrentUserPostDropdown
          handleDelete={handleDelete}
        ></CurrentUserPostDropdown>
      </Activity>
      <img
        src={post.user.avatar}
        alt="User icon"
        className="rounded-full object-cover size-12"
      />
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center">
          <p className="font-bold text-text space tracking-[0.2px] text-[18px]">
            {post.user.name}
          </p>
          <div className="flex items-center gap-1">
            <p className="text-darker font-light text-[15px]">
              @{post.user.username}
            </p>
            <div className="text-darker font-light w-0.8 my-auto flex justify-center text-a items-center">
              .
            </div>
            <p className="text-darker font-light text-[14px]">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        <p className="text-text text-[15px]">{post.content}</p>
        <div className="flex justify-start">
          {/* render comments */}
          <div className="flex items-center gap-2 flex-1">
            <MessageCircle
              size={20}
              className="stroke-darker text-darker font-light stroke-[1.2px]"
            ></MessageCircle>
            <p className="text-darker text-[14px] font-light">
              {post._count.Comment}
            </p>
          </div>

          {/* render likes */}
          <div className="flex items-center gap-2 flex-1 ">
            <Heart
              size={20}
              className="stroke-darker text-darker font-light stroke-[1.2px]"
            ></Heart>
            <p className="text-darker text-[14px] font-light ">
              {post._count.Like}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;
