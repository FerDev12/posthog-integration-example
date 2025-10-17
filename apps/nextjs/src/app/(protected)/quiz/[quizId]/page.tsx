import { auth } from "@/lib/auth";
import { redirectToSignIn } from "@/lib/utils/navigation";
import { headers } from "next/headers";

type Props = {
  params: { quizId: string };
};

export default async function QuizPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirectToSignIn();
  }

  return <div>{params.quizId}</div>;
}
