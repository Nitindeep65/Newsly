"use client";

import { UserButton } from "@clerk/nextjs";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/nextjs";

export function UserNav() {
  const { user, isLoaded } = useUser();

  if (!user) return null;
  if (!isLoaded) return null;

  return (
    <DropdownMenu>
      <UserButton />
    </DropdownMenu>
  );
}
