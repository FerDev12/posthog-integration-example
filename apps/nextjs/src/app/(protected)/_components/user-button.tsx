"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOutIcon, UserIcon } from "lucide-react";

export function UserButton() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const avatarFallback = session?.user.name
    .trim()
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("");

  async function handleSignOut() {
    await authClient.signOut(undefined, {
      onSuccess: () => {
        router.replace("/sign-in");
      },
      onError: () => {
        toast.error("Failed to sign out");
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Avatar>
            <AvatarFallback>{avatarFallback ?? <UserIcon />}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-medium">{session?.user.name}</span>
          <span>{session?.user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuItem
          disabled={isPending}
          onSelect={handleSignOut}
          className="group hover:!text-destructive hover:!bg-destructive/10 transition-colors [&_svg]:hover:!text-destructive cursor-pointer"
        >
          <LogOutIcon className="" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
