"use client";

import { MoreHorizontalIcon, Pin } from "lucide-react";

import DeleteDialog from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  handleDelete: () => void;
  settingsCn?: string;
  buttonCn?: string;
};

export function CurrentUserPostDropdown({
  handleDelete,
  settingsCn,
  buttonCn,
}: Readonly<Props>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        asChild
        className={`absolute top-0 right-0 m-3 ${settingsCn}`}
      >
        <Button
          variant="outline"
          aria-label="Open menu"
          className={`h-fit! border-0 bg-transparent! hover:bg-primary/20! rounded-full w-fit! p-2! transition-all ${buttonCn}`}
        >
          <MoreHorizontalIcon className="text-neutral-500 bg-transparent!" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-50 bg-background shadow-sm shadow-neutral-600"
        align="start"
        side="top"
      >
        <DropdownMenuItem
          className="hover:bg-secondary/60! w-full"
          onSelect={(e) => e.preventDefault()}
        >
          <DeleteDialog deleteHandler={handleDelete}></DeleteDialog>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-secondary/60!">
          <div className="flex items-center gap-2 text-text">
            <Pin className="flex items-center gap-2 text-text"></Pin>
            <p className="font-bold">Pin</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
