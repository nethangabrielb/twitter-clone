"use client";

import CreatePost from "@/app/home/components/create-post";
import FeedPost from "@/app/home/components/feed-post";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useEffect } from "react";

import Head from "next/head";

import { Spinner } from "@/components/ui/spinner";

import postApi from "@/lib/api/post";

import { Post } from "@/types/post";

const Home = () => {
  // POSTS FEED CONTENT QUERY
  const { data: posts, isPending } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const posts = await postApi.getPosts();
      return posts;
    },
  });

  useEffect(() => {
    document.title = "Home / Twitter";
  }, []);

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
          <FeedControlBtn>For you</FeedControlBtn>
          <FeedControlBtn>Following</FeedControlBtn>
        </div>
        <div className="mt-[57.1px]"></div>

        {/* CREATE POST SECTION */}
        <CreatePost></CreatePost>

        {/* RENDER POSTS */}
        <div className="w-full">
          {/* PENDING STATE */}
          {isPending && (
            <div className="flex justify-center items-center w-full h-full py-4">
              <Spinner className="size-7 text-primary"></Spinner>
            </div>
          )}
          {/* POSTS */}
          {posts &&
            posts.map((post: Post) => {
              return <FeedPost post={post} key={post.id}></FeedPost>;
            })}
        </div>
      </div>
    </>
  );
};

const FeedControlBtn = ({ children }: { children: string }) => {
  return (
    <button className="bg-transparent flex-1 p-4 hover:bg-neutral-900 border-b border-b-border ">
      {children}
    </button>
  );
};

export default Home;
