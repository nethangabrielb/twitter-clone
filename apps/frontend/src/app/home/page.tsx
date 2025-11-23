import CreatePost from "@/app/home/components/create-post";
import FeedPost from "@/app/home/components/feed-post";

import postApi from "@/lib/api/post";

import { Post } from "@/types/post";

const Home = async () => {
  const posts: Post[] = await postApi.getPosts();

  return (
    <div className="lg:w-[600px] border-l border-r border-l-border border-r-border h-full relative">
      <div className="flex backdrop-blur-lg absolute top-0 w-full">
        <FeedControlBtn>For you</FeedControlBtn>
        <FeedControlBtn>Following</FeedControlBtn>
      </div>
      <div className="mt-[57.1px]"></div>
      <CreatePost></CreatePost>
      {/* RENDER POSTS */}
      <div className="w-full">
        {posts.map((post: Post) => {
          return <FeedPost post={post} key={post.id}></FeedPost>;
        })}
      </div>
    </div>
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
