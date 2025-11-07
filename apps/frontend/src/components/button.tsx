"use client";

import { useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

type Props = {
  icon?: string;
  children: string;
  outline?: boolean;
  type?: "google" | "login" | "register";
  className?: string;
};

const FormButton = ({ icon, children, outline, type, className }: Props) => {
  const router = useRouter();
  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data) {
        if (event.data.success) {
          globalThis.location.href = `/onboarding`;
        } else if (event.data.success === false) {
          globalThis.location.href = `/`;
        }
      }
    });
  }, []);

  const clickHandler = (path: string | undefined) => {
    switch (path) {
      case "google":
        authApi.googleAuth();
        break;
      case "register":
        router.push("/register");
        break;
      case "login":
        router.push("/login");
        break;
    }
  };

  return (
    <Button
      className={cn(
        !outline && "hover:!bg-foreground bg-foreground text-background",
        `${className} rounded-3xl border-muted-foreground  h-fit`,
      )}
      variant={outline ? "outline" : "default"}
      onClick={() => clickHandler(type)}
    >
      {icon && (
        <Image src={icon} width={18} height={18} alt="Google Icon"></Image>
      )}
      {children}
    </Button>
  );
};

export default FormButton;
