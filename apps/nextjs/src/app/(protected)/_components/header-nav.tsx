"use client";

import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProtectedHeaderNav() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <HeaderNavLink href="/explore" text="Explore" />
      <HeaderNavLink href="/create-quiz" text="Create Quiz" />
      <HeaderNavLink href="/my-quizzes" text="My Quizzes" />
    </nav>
  );
}

function HeaderNavLink({ href, text }: { href: string; text: string }) {
  const pathname = usePathname();

  const isActive = href === pathname;
  return (
    <Link
      href={href}
      className={cn(
        "text-sm text-muted-foreground hover:text-foreground transition-colors",
        isActive && "text-primary",
      )}
    >
      {text}
    </Link>
  );
}
