import { NewPost } from "@/app/home/types/create-post.type";

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

  const createPost = async (values: NewPost) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/posts`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  const deletePost = async (postId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/posts/${postId}`,
      {
        credentials: "include",
        method: "DELETE",
      },
    );

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  const likePost = async (postId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/likes/posts/${postId}`,
      {
        credentials: "include",
        method: "POST",
      },
    );

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  const unlikePost = async (postId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/likes/posts/${postId}`,
      {
        credentials: "include",
        method: "DELETE",
      },
    );

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  return { getPosts, createPost, deletePost, likePost, unlikePost };
})();

export default postApi;
