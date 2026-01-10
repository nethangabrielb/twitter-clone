import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

import { FollowType } from "@/types/follow";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateSlugPost(date: Date) {
  return format(date, "h:mm b . PP");
}

export function formatDateFeedPost(date: Date) {
  return format(date, "PP");
}

export function isFollowing(
  currentUserFollowings: Array<{ following: FollowType }>,
  followerId: number,
) {
  let isUserFollowing = false;
  currentUserFollowings.forEach((following) => {
    if (following.following.id === followerId) {
      isUserFollowing = true;
    } else {
      isUserFollowing = false;
    }
  });

  return isUserFollowing;
}
