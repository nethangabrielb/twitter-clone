"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { googleAuth } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

type Props = {
  icon: string | null;
  children: string;
  outline: boolean;
  light: boolean;
  type: "google" | "login" | "register";
  padding: "large" | "small" | undefined;
};

const FormButton = ({
  icon,
  children,
  outline,
  light,
  type,
  padding,
}: Props) => {
  return (
    <Button
      className={cn(
        !outline && "hover:!bg-foreground bg-foreground text-background",
        padding === "large" && "p-3",
        padding === "small" && "p-[8px]",
        "rounded-3xl border-muted-foreground  h-fit",
      )}
      variant={outline ? "outline" : "default"}
      onClick={type === "google" ? googleAuth : undefined}
    >
      {icon && (
        <Image src={icon} width={18} height={18} alt="Google Icon"></Image>
      )}
      {children}
    </Button>
  );
};

export default FormButton;
