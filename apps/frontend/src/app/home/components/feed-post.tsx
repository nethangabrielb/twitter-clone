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

import { Activity, startTransition, useOptimistic, useState } from "react";

import Link from "next/link";

import postApi from "@/lib/api/post";
import { cn, formatDate } from "@/lib/utils";

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

  // put likes in a state to use as source of truth
  // for useOptimistic hooks
  const [likes, setLikes] = useState(post?._count.Like);

  // source of truth to determine if clicking the like button should either
  // like or unlike a tweet by determining if current user has alr liked a post
  const [userHasLiked, setUserHasLiked] = useState(
    post?.Like[0]?.userId === user?.id,
  );
  const [optimisticLikes, addOptimisticLikes] = useOptimistic(
    likes,
    (currentLike: number, updatedLike: number) => currentLike + updatedLike,
  );

  // DELETE POST API INTERFACE
  const postMutation = useMutation({
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

  // LIKE/UNLIKE POST API INTERFACE
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (userHasLiked) {
        startTransition(() => {
          addOptimisticLikes(-1);
        });
        const res = await postApi.unlikePost(post.id);
        return res;
      } else {
        startTransition(() => {
          addOptimisticLikes(1);
        });
        const res = await postApi.likePost(post.id);
        return res;
      }
    },
    onSuccess: (res) => {
      if (res.message === "Post liked successfully") {
        setLikes((prev) => prev + 1);
        setUserHasLiked(true);
      } else if (res.message === "Unlike success") {
        setLikes((prev) => prev - 1);
        setUserHasLiked(false);
      }
    },
  });

  const handleDelete = () => {
    postMutation.mutate();
  };

  return (
    <Link
      className="flex gap-4 p-4 border-b border-b-border relative hover:bg-secondary/40 transition-all"
      href={`/post/${post.id}`}
    >
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
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-1">
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
        <div className="flex justify-between w-[60%] ">
          {/* render comments */}
          <div className="flex items-center group cursor-pointer">
            <div className="p-2 rounded-full group-hover:bg-primary/20 transition-all">
              <MessageCircle
                size={20}
                className="stroke-darker text-darker font-light stroke-[1.2px] group-hover:stroke-primary! transition-all"
              ></MessageCircle>
            </div>
            <p className="text-darker text-[14px] font-light group-hover:text-primary transition-all">
              {post._count.Comment}
            </p>
          </div>

          {/* render likes */}
          <button
            className="flex items-center group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              likeMutation.mutate();
            }}
          >
            <div className="p-2 rounded-full group-hover:bg-red-500/20 transition-all bg-transparent group">
              <Heart
                size={20}
                className={cn(
                  "text-darker font-light stroke-[1.2px] group-hover:stroke-red-500! group-active:scale-150 duration-500",
                  userHasLiked
                    ? "fill-red-500 stroke-red-500!"
                    : "stroke-darker",
                )}
              ></Heart>
            </div>
            <p className="text-darker text-[14px] font-light group-hover:text-red-500 transition-all">
              {optimisticLikes}
            </p>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FeedPost;
