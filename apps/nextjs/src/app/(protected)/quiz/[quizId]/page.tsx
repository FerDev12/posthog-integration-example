import { db } from "@/db";
import { auth } from "@/lib/auth";
import { redirectToSignIn } from "@/lib/utils/navigation";
import { notFound } from "next/navigation";
import { Quiz } from "../../_components/quiz";
import { headers } from "next/headers";
import { QuizSession, quizSessions } from "@/db/schema";
import { getSessionAnswers } from "@/actions/get-session-answers.action";

async function createNewSession(quizId: string, userId: string) {
  try {
    // Get the first question of the quiz
    const firstQuestion = await db.query.quizQuestions.findFirst({
      where: (q, { eq }) => eq(q.quizId, quizId),
      orderBy: (q, { asc }) => [asc(q.order)],
    });

    const [session] = await db
      .insert(quizSessions)
      .values({
        quizId: quizId,
        userId: userId,
        currentQuestionId: firstQuestion?.id,
      })
      .returning();
    return session;
  } catch (error: unknown) {
    console.error("Failed to create new session", error);
    throw error;
  }
}

async function getQuiz(quizId: string, userId: string) {
  try {
    return await db.query.quizes.findFirst({
      where: (q, { eq }) => eq(q.id, quizId),
      with: {
        questions: {
          with: {
            answers: true,
          },
        },
        sessions: {
          where: (s, { eq, and, isNull }) =>
            and(eq(s.userId, userId), isNull(s.endedAt)),
          limit: 1,
        },
      },
    });
  } catch (error: unknown) {
    console.error("Failed to fetch quiz", error);
  }
}

type Props = {
  params: {
    quizId: string;
  };
  searchParams: {
    showResults?: string;
  };
};

export default async function QuizPage({ params, searchParams }: Props) {
  const { quizId } = await params;
  const { showResults } = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirectToSignIn();
  }

  const quiz = await getQuiz(quizId, session.user.id);

  if (!quiz) {
    return notFound();
  }

  let quizSession: QuizSession | undefined = undefined;

  if (quiz.sessions.length === 0) {
    quizSession = await createNewSession(quiz.id, session.user.id);
  } else {
    quizSession = quiz.sessions[0];
  }

  // Determine if we should show results
  const shouldShowResults = showResults === "true" || !!quizSession.endedAt;

  // Get session answers for completed sessions or when showing results
  let sessionAnswers: any[] = [];
  if (shouldShowResults) {
    const answersResult = await getSessionAnswers(quizSession.id);
    if (
      answersResult.success &&
      answersResult.data &&
      Array.isArray(answersResult.data)
    ) {
      sessionAnswers = answersResult.data;
    }
  }

  return (
    <Quiz
      quiz={quiz}
      session={quizSession}
      sessionAnswers={sessionAnswers}
      initialShowResults={shouldShowResults}
    />
  );
}
