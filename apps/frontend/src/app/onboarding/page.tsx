import ConfirmForm from "@/app/onboarding/components/form";

import { redirect } from "next/navigation";

import userApi from "@/lib/api/user";

import { User } from "@/types/user";

const Onboarding = async () => {
  const user: User = await userApi.getUser();

  if (user.onboarded) {
    redirect(`/home`);
  } else {
    // onboarding page should fetch user info using token
    return <ConfirmForm user={user}></ConfirmForm>;
  }
};

export default Onboarding;
