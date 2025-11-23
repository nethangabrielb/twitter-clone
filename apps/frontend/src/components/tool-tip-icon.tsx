import type { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  children: ReactNode;
  content: string;
};

export function TooltipIcon({ children, content }: Readonly<Props>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="p-3 rounded-full hover:bg-primary/10 transition-all">
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
