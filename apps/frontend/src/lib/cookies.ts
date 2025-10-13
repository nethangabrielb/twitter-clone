import { cookies } from "next/headers";

const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(name);

  if (token) {
    return token.value;
  }
};

export default getCookie;
