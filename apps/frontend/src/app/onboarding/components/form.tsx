"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useRef, useState } from "react";

import Image from "next/image";

import FormButton from "@/components/button";
import Icon from "@/components/icon";
import { InputSharp } from "@/components/input";

import { cn } from "@/lib/utils";

import { User } from "@/types/user";

const UserSchema = z.object({
  name: z.string().refine((val) => val.trim().length >= 1, {
    message: "Name can't be empty",
  }),
  username: z.string().refine((val) => val.trim().length >= 1, {
    message: "Username can't be empty",
  }),
  avatar: z.file().refine((file) => file.size <= 5 * 1024 * 1024, {
    error: "Image exceeds the 5MB limit.",
  }),
});

export type ConfirmUser = z.infer<typeof UserSchema>;

type Props = {
  user: User;
};

const ConfirmForm = ({ user }: Props) => {
  const [mouseEnter, setMouseEnter] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState<File | null>(null);
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConfirmUser>({ resolver: zodResolver(UserSchema) });
  const fileInput = useRef<null | HTMLInputElement>(null);

  const uploadHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInput?.current?.click();
  };

  const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files[0].size <= 5 * 1024 * 1024) {
        setValue("avatar", e.target.files[0], { shouldValidate: true });
        setFilePreview(e.target.files[0]);
      } else {
        toast.error("Avatar must be 2MB or smaller.");
      }
    }
  };

  console.log(watch());

  return (
    <form className="w-full m-auto h-full flex flex-col justify-center items-center gap-8">
      <div className="flex flex-col gap-4 items-center bg-card border border-border p-8 rounded-md">
        <Icon width={48} height={48} alt="Twitter Icon"></Icon>
        <h1 className="font-extrabold text-2xl rotate-x-[20deg] mb-4">
          Confirm profile
        </h1>
        <div className="flex flex-col gap-4 w-[350px]">
          <button
            className="w-[130px] h-[130px] mx-auto relative"
            onMouseOver={() => setMouseEnter(true)}
            onMouseLeave={() => setMouseEnter(false)}
            onClick={uploadHandler}
          >
            <Image
              src={filePreview ? URL.createObjectURL(filePreview) : user.avatar}
              width={130}
              height={130}
              alt="User Icon"
              className={cn(
                "rounded-full border h-full object-cover",
                mouseEnter && "opacity-30",
              )}
            ></Image>
            <Pencil
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                mouseEnter ? "!visible !opacity-100" : "!invisible",
              )}
            ></Pencil>
          </button>
          {errors.avatar?.message && (
            <p className="text-red-500 font-medium">{errors.avatar?.message}</p>
          )}
          <input
            type="file"
            name="avatar"
            id="avatar"
            className="invisible"
            ref={fileInput}
            accept="image/*"
            onChange={uploadAvatar}
          />
          <InputSharp label="name" register={register}>
            {user.name}
          </InputSharp>
          <InputSharp label="username" register={register}>
            {user.username}
          </InputSharp>
          <div className="mt-2"></div>
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
      </div>
    </form>
  );
};

export default ConfirmForm;
