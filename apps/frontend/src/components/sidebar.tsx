"use client";

import { Activity, ReactNode, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Icon from "@/components/icon";

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
    title: "Settings and Privacy",
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
        <div className="flex flex-col gap-6 lg:w-[275px] h-full pt-4">
          <Icon width={36} height={36} alt="Twitter Icon"></Icon>
          {data.map((link) => {
            return (
              <Link href={link.url} key={crypto.randomUUID()}>
                {link.title}
              </Link>
            );
          })}
        </div>
      </Activity>
      {children}
    </div>
  );
};

export default Sidebar;
