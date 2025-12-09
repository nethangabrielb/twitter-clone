import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateSlugPost(date: Date) {
  return format(date, "h:mm b . PP");
}

export function formatDateFeedPost(date: Date) {
  return format(date, "PP");
}
