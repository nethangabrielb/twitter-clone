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
};

const FormButton = ({ icon, children, outline, light, type }: Props) => {
  return (
    <Button
      className={cn(
        !outline && "hover:!bg-foreground bg-foreground text-background",
        "rounded-3xl border-muted-foreground p-[8px] h-fit",
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
