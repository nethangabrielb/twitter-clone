"use client";

import { MoreHorizontalIcon, Pin, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CurrentUserPostDropdown() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="absolute top-0 right-0 m-3">
        <Button
          variant="outline"
          aria-label="Open menu"
          className="h-fit! border-0 bg-transparent! hover:bg-primary/20! rounded-full w-fit! p-2! transition-all"
        >
          <MoreHorizontalIcon className="text-neutral-500 bg-transparent!" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40 bg-background shadow-sm shadow-neutral-600"
        align="start"
        side="top"
      >
        <DropdownMenuItem className="hover:bg-secondary/60!">
          <div className="flex items-center gap-2 text-text">
            <Trash2 className="text-red-600"></Trash2>
            <p className="text-red-600">Delete</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-secondary/60!">
          <div className="flex items-center gap-2 text-text">
            <Pin className="flex items-center gap-2 text-text"></Pin>
            <p>Pin</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
