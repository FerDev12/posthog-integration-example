import { auth } from "@/lib/auth";
import { redirectToSignIn } from "@/lib/utils/navigation";
import { headers } from "next/headers";

export default async function CreateQuizPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirectToSignIn();
  }

  return <div>Create Quiz</div>;
}
