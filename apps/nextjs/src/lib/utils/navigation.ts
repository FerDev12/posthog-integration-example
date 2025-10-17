import { redirect } from "next/navigation";

export function redirectToSignIn() {
  return redirect("/sign-in");
}
