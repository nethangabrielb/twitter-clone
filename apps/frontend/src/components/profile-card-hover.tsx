import { format } from "date-fns";
import { Calendar } from "lucide-react";

import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { User } from "@/types/user";

export function ProfileHoverCard({ user }: { user: User }) {
  console.log(user);
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Avatar>
          <AvatarImage src={user.avatar} alt={`${user.username}'s avatar`} />
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col justify-between">
          <Link className="cursor-pointer" href={`/profile/${user.id}`}>
            <Avatar className="size-[72px]! mb-4">
              <AvatarImage
                src={user.avatar}
                alt={`${user.username}'s avatar`}
              />
            </Avatar>
          </Link>
          <div className="space-y-1">
            <div className="flex flex-col items-start">
              <p className="text-[22px] text-text font-bold">{user?.name}</p>
              <Link
                className="text-darker font-light text-[15px] hover:underline"
                href={`/profile/${user.id}`}
              >
                @{user?.username}
              </Link>
            </div>
            {user && (
              <div className="flex items-center gap-2 my-4">
                <Calendar size={18} className="text-darker"></Calendar>
                <p className="text-darker ">
                  Join on {format(user?.createdAt as Date, "LLLL yyyy")}
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <p className="text-darker">
                <span className="text-white">{user?._count.Followers}</span>{" "}
                followers
              </p>
              <p className="text-darker">
                <span className="text-white">{user?._count.Followings}</span>{" "}
                followers
              </p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
