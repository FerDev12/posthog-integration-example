import { auth } from "@/lib/auth";
import { redirectToSignIn } from "@/lib/utils/navigation";
import { headers } from "next/headers";
import { CreateQuizForm } from "../_components/create-quiz-form";

export default async function CreateQuizPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirectToSignIn();
  }

  return <CreateQuizForm />;
}
