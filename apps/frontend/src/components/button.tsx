import Image from "next/image";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

type Props = {
  icon: string | null;
  children: string;
  outline: boolean;
  light: boolean;
};

const FormButton = ({ icon, children, outline, light }: Props) => {
  return (
    <Button
      className={cn(
        !outline && "hover:!bg-foreground bg-foreground text-background",
        "rounded-3xl border-muted-foreground",
      )}
      variant={outline ? "outline" : "default"}
    >
      {icon && (
        <Image src={icon} width={18} height={18} alt="Google Icon"></Image>
      )}
      {children}
    </Button>
  );
};

export default FormButton;
