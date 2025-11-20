import FeedPost from "@/app/home/components/feed-post";

import postApi from "@/lib/api/post";

import { Post } from "@/types/post";

const Home = async () => {
  const posts: Post[] = await postApi.getPosts();

  return (
    <div className="lg:w-[600px] border-l border-r border-l-border border-r-border h-full">
      {/* RENDER POSTS */}
      <div className="w-full">
        {posts.map((post: Post) => {
          return <FeedPost post={post} key={post.id}></FeedPost>;
        })}
      </div>
    </div>
  );
};

export default Home;
