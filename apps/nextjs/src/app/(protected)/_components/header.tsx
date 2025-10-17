import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { ProtectedHeaderNav } from "./header-nav";
import { UserButton } from "./user-button";

export async function ProtectedHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/explore" className="flex items-center gap-2">
          <div className="text-2xl">👻</div>
          <span className="text-lg font-bold tracking-tight">
            Spooky Dev Quiz
          </span>
        </Link>

        <ProtectedHeaderNav />

        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
