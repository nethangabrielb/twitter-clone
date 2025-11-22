"use client";

import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import { Activity, ReactNode, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ActionButton } from "@/components/button";
import Icon from "@/components/icon";
import NavIcon from "@/components/navIcon";

import userApi from "@/lib/api/user";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
};

const links = [
  {
    title: "Home",
    url: "/home",
  },
  {
    title: "Notifications",
    url: "/notifications",
  },
  {
    title: "Messages",
    url: "/messages",
  },
  {
    title: "Bookmarks",
    url: "/bookmarks",
  },
  {
    title: "Chat",
    url: "/chat",
  },
  {
    title: "Profile",
    url: "",
  },
  {
    title: "Settings",
    url: "/settings/account",
  },
];

const Sidebar = ({ children }: Props) => {
  const setUser = useUser((state) => state.setUser);
  const [visible, setVisible] = useState<boolean>(false);
  const path = usePathname();
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/users?current=true`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Error fetching from the server.");
      }
      const data = await res.json();
      const user = data.data;
      setUser(user);
      return user;
    },
  });

  const renderSidebar = (currentPath: string) => {
    switch (currentPath) {
      case "/":
        setVisible(false);
        break;
      case "/register":
        setVisible(false);
        break;
      case "/login":
        setVisible(false);
        break;
      case "/onboarding":
        setVisible(false);
        break;
      default:
        setVisible(true);
    }
  };

  useEffect(() => {
    renderSidebar(path);
  }, [path]);

  return (
    <div className={cn(visible && "flex justify-center", "h-full")}>
      <Activity mode={visible ? "visible" : "hidden"}>
        <div className="flex flex-col gap-[8px] lg:w-[300px] h-full py-4 px-8">
          <div className="pl-3 pb-3">
            <Icon width={36} height={36} alt="Twitter Icon"></Icon>
          </div>
          {links.map((link) => {
            return (
              <Link
                href={link.url}
                key={crypto.randomUUID()}
                className="text-lg flex items-center gap-6 w-fit hover:bg-muted transition-all p-3 rounded-4xl"
              >
                <NavIcon title={link.title}></NavIcon>
                {link.title}
              </Link>
            );
          })}
          <ActionButton className="bg-primary text-white p-3! hover:brightness-90 hover:bg-primary!">
            Tweet
          </ActionButton>
          <div className="mt-auto flex items-center gap-4">
            <img
              src={data?.avatar}
              alt="User avatar"
              loading="eager"
              className="size-[40px] rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-[15px] text-text font-bold">{data?.name}</p>
              <p className="text-[15px] text-darker font-bold">
                @{data?.username}
              </p>
            </div>
          </div>
        </div>
      </Activity>
      {children}
    </div>
  );
};

export default Sidebar;
