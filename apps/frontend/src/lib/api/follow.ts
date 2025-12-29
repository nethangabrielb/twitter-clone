const followApi = (() => {
  const getFollowers = async (userId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/follows/followers/${userId}`,
      {
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  const getFollowings = async (userId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/follows/followings/${userId}`,
      {
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  return { getFollowers, getFollowings };
})();

export default followApi;
