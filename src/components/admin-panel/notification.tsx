"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-4">
        <DropdownMenuLabel className="mb-2 text-lg font-medium">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
