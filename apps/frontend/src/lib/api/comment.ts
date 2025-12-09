import { Comment } from "@/app/post/types/coment";

const commentApi = (() => {
  const createComment = async (comment: Comment) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/comments`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify(comment),
    });

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  return { createComment };
})();

export default commentApi;
