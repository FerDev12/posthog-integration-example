import { ReactNode } from "react";
import { ProtectedHeader } from "./_components/header";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ProtectedHeader />
      <main>{children}</main>
    </>
  );
}
