import { ConfirmUser } from "@/app/onboarding/components/form";
import { Register } from "@/app/register/components/form";
import _ from "lodash";
import type { Path, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

type Props<T extends Register | ConfirmUser> = {
  children?: string;
  label: keyof T;
  register: UseFormRegister<T>;
  errorMessage?: string;
  displayErrMessage?: boolean;
};

const InputSharp = <T extends Register | ConfirmUser>({
  children,
  label,
  register,
  errorMessage,
  displayErrMessage = true,
}: Props<T>) => {
  return (
    <div className="flex flex-col gap-2 relative">
      <Label className="font-bold text-lg tracking-tighter">
        {_.upperFirst(label as string)}
      </Label>
      {children ? (
        <Input
          defaultValue={children}
          {...register(label as Path<T>)}
          className={cn(
            "active:border-primary py-6 rounded-[4px] bg-transparent border border-border",
            errorMessage &&
              "border-red-400  focus:border-red-400! focus-visible:ring-red-500",
          )}
          required
        ></Input>
      ) : (
        <Input
          {...register(label as Path<T>)}
          className={cn(
            "active:border-primary py-6 rounded-[4px] bg-transparent border border-border",
            errorMessage &&
              "border-red-400  focus:border-red-400! focus-visible:ring-red-500",
          )}
          required
        ></Input>
      )}
      <p className="text-red-600 font-medium text-xs absolute top-0 right-0 mt-4">
        {displayErrMessage && errorMessage}
      </p>
    </div>
  );
};

export { InputSharp };
