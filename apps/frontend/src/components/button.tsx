import Image from "next/image";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

type Props = {
  icon: string | null;
  children: string;
  outline: boolean;
};

const FormButton = ({ icon, children, outline }: Props) => {
  return (
    <Button
      className={cn(
        !outline
          ? "bg-foreground text-background hover:bg-foreground"
          : "bg-background text-foreground border-borde border hover:bg-background",
        `rounded-3xl hover:brightness-90`,
      )}
    >
      {icon && (
        <Image src={icon} width={18} height={18} alt="Google Icon"></Image>
      )}
      {children}
    </Button>
  );
};

export default FormButton;
