import { ConfirmUser } from "@/app/onboarding/components/form";
import _ from "lodash";
import type { UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  children: string;
  label: "avatar" | "username" | "name";
  register: UseFormRegister<ConfirmUser>;
};

const InputSharp = ({ children, label, register }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{_.upperFirst(label)}</Label>
      <Input
        defaultValue={children}
        {...register(label)}
        className="active:border-primary py-6 rounded-[4px] bg-transparent border border-border"
        required
      ></Input>
    </div>
  );
};

export { InputSharp };
