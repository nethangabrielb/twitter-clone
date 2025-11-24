"use client";

import PostSchema from "@/app/home/schema/create-post.schema";
import { NewPost } from "@/app/home/types/create-post.type";
import useUser from "@/stores/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Image, Smile } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import React, { useState } from "react";

import { ActionButton } from "@/components/button";
import { TooltipIcon } from "@/components/tool-tip-icon";

import postApi from "@/lib/api/post";

import { User } from "@/types/user";

const CreatePost = () => {
  const [displayIndicator, setDisplayIndicator] = useState(false);
  const [dashOffset, setDashOffset] = useState(565.48);
  const [inputDisabled, setInputDisabled] = useState(false);
  const user = useUser((state) => state.user) as User;

  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NewPost>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      userId: user.id,
    },
  });

  // CREATE POSTS MUTATION
  const mutation = useMutation({
    mutationFn: async (values: NewPost) => {
      const res = await postApi.createPost(values);
      if (res) {
        toast.success(res.message);
      }
    },
  });

  const createPost = () => {
    const values = getValues();
    mutation.mutate(values);
  };

  const checkLengthExceed = (length: number) => {
    if (length >= 250) {
      setInputDisabled(true);
    } else {
      setInputDisabled(false);
    }
  };

  const updateLimitOffset = (length: number) => {
    setDashOffset(565.48);
    setDashOffset((prev) => prev - 2.26192 * length);
  };

  return (
    <div className="flex gap-4 p-4 border-b border-b-border w-full">
      <img
        src={`${user?.avatar}`}
        alt={`${user?.username}'s icon`}
        className="size-[48px]"
      />
      <form
        onSubmit={handleSubmit(createPost)}
        className="w-[95%] max-w-[95%] flex flex-col gap-4"
      >
        <textarea
          {...register("content")}
          placeholder="What's happening?"
          className="bg-transparent pt-3 pb-8 border-b border-b-border outline-0 placeholder:text-gray field-sizing-content placeholder:text-lg w-[95%] max-w-[95%] resize-none overflow-auto text-lg"
          onChange={(e) => {
            const length = e.target.value.length;

            if (!inputDisabled) {
              updateLimitOffset(length);
            }

            if (length > 0) {
              setDisplayIndicator(true);
            } else {
              setDisplayIndicator(false);
            }

            checkLengthExceed(length);
          }}
          maxLength={250}
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
          <div className="flex items-center gap-4">
            {displayIndicator && (
              <svg
                width="26"
                height="26"
                viewBox="-25 -25 250 250"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: "rotate(-90deg)" }}
                className="stroke-neutral-700"
              >
                <circle
                  r="90"
                  cx="100"
                  cy="100"
                  fill="transparent"
                  stroke="#e0e0e0"
                  strokeWidth="16px"
                ></circle>
                <circle
                  r="90"
                  cx="100"
                  cy="100"
                  className="stroke-primary"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeDashoffset={`${dashOffset}`}
                  fill="transparent"
                  strokeDasharray="565.48px"
                ></circle>
              </svg>
            )}

            <ActionButton
              className="bg-primary text-white hover:bg-primary! hover:brightness-90!"
              disabled={inputDisabled}
            >
              Tweet
            </ActionButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
