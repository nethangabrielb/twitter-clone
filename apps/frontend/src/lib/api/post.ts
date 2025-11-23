import { Post } from "@/types/post";

const postApi = (() => {
  const getPosts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/posts`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error fetching from the server.");
    }
    const data = await res.json();
    return data.data as Post[];
  };

  return { getPosts };
})();

export default postApi;
