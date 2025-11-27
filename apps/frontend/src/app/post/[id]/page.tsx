"use client";

import PostSingle from "@/app/post/components/post";
import CreateReply from "@/app/post/components/reply-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect } from "react";

import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";

import postApi from "@/lib/api/post";

import { PostType } from "@/types/post";

const Post = () => {
  const params = useParams();
  const queryClient = useQueryClient();

  const { data: post, refetch } = useQuery<PostType>({
    queryKey: ["post", params.id],
    queryFn: async () => {
      const posts = await postApi.getPost(params.id);
      return posts;
    },
  });

  const refetchPosts = async () => {
    await queryClient.refetchQueries({ queryKey: ["posts"] });
    await queryClient.refetchQueries({ queryKey: ["post"] });
  };

  useEffect(() => {
    document.title = `${post?.user?.username} on Twitter: ${post?.content}`;
  }, [post]);

  return (
    <>
      <Head>
        <title>{document.title}</title>
        <meta
          name="description"
          content="Home page of my attempt to make a clone of Twitter"
        />
      </Head>
      <div className="lg:w-[600px] border-l border-r border-l-border border-r-border h-full relative">
        {/* FEED CONTROL UI */}
        <div className="flex backdrop-blur-lg absolute top-0 w-full">
          <div className="bg-transparent flex-1 p-2 border-b border-b-border font-bold flex items-center gap-8">
            <Link
              className="p-2 rounded-full hover:bg-neutral-500/20 transition-all cursor-pointer"
              href={"/home"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </Link>
            <h1>Post</h1>
          </div>
        </div>
        <div className="mt-[57.1px]"></div>
        {post && (
          <PostSingle post={post} refetchPosts={refetchPosts}></PostSingle>
        )}
        <CreateReply refetch={refetch}></CreateReply>
      </div>
    </>
  );
};

export default Post;
