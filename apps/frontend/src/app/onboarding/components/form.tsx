"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";

import FormButton from "@/components/button";
import Icon from "@/components/icon";
import { InputSharp } from "@/components/input";

const UserSchema = z.object({
  name: z.string(),
  username: z.string(),
});

type User = z.infer<typeof UserSchema>;

type Props = {
  user: User;
};

const ConfirmForm = ({ user }: Props) => {
  const { register } = useForm();

  return (
    <form className="w-full h-full flex flex-col justify-center items-center gap-8">
      <Icon width={48} height={48} alt="Twitter Icon"></Icon>
      <h1 className="font-extrabold text-2xl rotate-x-[20deg]">
        Confirm profile
      </h1>
      <div className="flex flex-col gap-4 w-[20%]">
        <InputSharp label="Name" register={register}>
          {user.name}
        </InputSharp>
        <InputSharp label="Username" register={register}>
          {user.username}
        </InputSharp>
        <div className="mt-6"></div>
        <FormButton
          outline={false}
          light={true}
          type="register"
          icon={null}
          padding="large"
        >
          Confirm details
        </FormButton>
      </div>
    </form>
  );
};

export default ConfirmForm;
