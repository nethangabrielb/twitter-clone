import PostSingle from "@/app/post/components/post";

import { cookies } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
};

const Post = async ({ params }: Props) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/posts/${id}`, {
    headers: {
      Cookie: `token=${token?.value}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error fetching from the server.");
  }

  const post = await res.json();

  return (
    <div className="lg:w-[600px] border-l border-r border-l-border border-r-border h-full relative">
      {/* FEED CONTROL UI */}
      <div className="flex backdrop-blur-lg absolute top-0 w-full">
        <h1 className="bg-transparent flex-1 p-4 border-b border-b-border font-bold">
          Following
        </h1>
      </div>
      <div className="mt-[57.1px]"></div>
      <PostSingle post={post.data}></PostSingle>
    </div>
  );
};

export default Post;
