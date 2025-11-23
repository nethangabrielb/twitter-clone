"use client";

import useUser from "@/stores/user.store";
import { Image, Smile } from "lucide-react";

import { ActionButton } from "@/components/button";
import { TooltipIcon } from "@/components/tool-tip-icon";

import { User } from "@/types/user";

const CreatePost = () => {
  const user = useUser((state) => state.user) as User;

  console.log(user);

  return (
    <div className="flex gap-4 p-4 border-b border-b-border w-full">
      <img
        src={`${user?.avatar}`}
        alt={`${user?.username}'s icon`}
        className="size-[48px]"
      />
      <form action="" className="w-[95%] max-w-[95%] flex flex-col gap-4">
        <textarea
          placeholder="What's happening?"
          className="bg-transparent pt-3 pb-8 border-b border-b-border outline-0 placeholder:text-gray field-sizing-content placeholder:text-lg w-[95%] max-w-[95%] resize-none overflow-auto text-lg"
        />
        <div className="flex items-center justify-between w-[95%] max-w-[95%]">
          <div className="flex items-center">
            <TooltipIcon content="Upload image">
              <Image size={20} className="text-primary" />
            </TooltipIcon>
            <TooltipIcon content="Emoji">
              <Smile size={20} className="text-primary" />
            </TooltipIcon>
          </div>
          <ActionButton className="bg-primary text-white hover:bg-primary! hover:brightness-90!">
            Tweet
          </ActionButton>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
