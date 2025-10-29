import { ConfirmUser } from "@/app/onboarding/components/form";
import _ from "lodash";
import type { UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  children: string;
  label: "avatar" | "username" | "name";
  register: UseFormRegister<ConfirmUser>;
  errorMessage: string | undefined;
};

const InputSharp = ({ children, label, register, errorMessage }: Props) => {
  return (
    <div className="flex flex-col gap-2 relative">
      <Label>{_.upperFirst(label)}</Label>
      <Input
        defaultValue={children}
        {...register(label)}
        className="active:border-primary py-6 rounded-[4px] bg-transparent border border-border"
        required
      ></Input>
      <p className="text-red-600 font-medium text-xs absolute top-0 right-0 mb-2">
        {errorMessage}
      </p>
    </div>
  );
};

export { InputSharp };
