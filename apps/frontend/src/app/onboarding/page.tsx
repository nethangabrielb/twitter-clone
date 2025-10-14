import ConfirmForm from "@/app/onboarding/components/form";

import userApi from "@/lib/api/user";

import { User } from "@/types/user";

const Onboarding = async () => {
  const user: User = await userApi.getUser();

  // onboarding page should fetch user info using token
  return <ConfirmForm user={user}></ConfirmForm>;
};

export default Onboarding;
