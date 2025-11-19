"use client";

import { Activity, ReactNode, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ActionButton } from "@/components/button";
import Icon from "@/components/icon";
import NavIcon from "@/components/navIcon";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
};

const data = [
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
  const [visible, setVisible] = useState<boolean>(false);
  const path = usePathname();

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
        <div className="flex flex-col gap-[8px] lg:w-[300px] h-full pt-4 px-8">
          <div className="pl-3 pb-3">
            <Icon width={36} height={36} alt="Twitter Icon"></Icon>
          </div>
          {data.map((link) => {
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
        </div>
      </Activity>
      {children}
    </div>
  );
};

export default Sidebar;
