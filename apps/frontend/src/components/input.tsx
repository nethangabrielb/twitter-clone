import type { FieldValues, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  children: string;
  label: string;
  register: UseFormRegister<FieldValues>;
};

const InputSharp = ({ children, label, register }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="peer-focus:translate-t-4">{label}</Label>
      <Input
        defaultValue={children}
        {...register(label)}
        className="active:border-primary py-6 rounded-[4px] peer"
      ></Input>
    </div>
  );
};

export { InputSharp };
