import getCookie from "@/lib/cookies";

import { User } from "@/types/user";

const userApi = (() => {
  const getUser = async () => {
    const token = await getCookie("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/users?current=true`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Error fetching from the server.");
    }
    const data = await res.json();
    return data.data as User;
  };

  return { getUser };
})();

export default userApi;
