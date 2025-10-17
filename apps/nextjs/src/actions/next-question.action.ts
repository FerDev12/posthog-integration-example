"use server";

import { db } from "@/db";
import { quizSessions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ActionResult } from "@/types/action-result.type";
import { headers } from "next/headers";

export async function nextQuestion(
  quizId: string,
  quizSessionId: string
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        error: {
          code: "unauthorized",
          status: 401,
          title: "Unauthorized",
          message: "You do not have access to this resource.",
        },
        success: false,
        data: null,
      };
    }

    const quiz = await db.query.quizes.findFirst({
      where: (q, { eq }) => eq(q.id, quizId),
      with: {
        questions: {
          columns: {
            id: true,
            order: true,
          },
        },
        sessions: {
          where: (s, { eq, and }) =>
            and(eq(s.userId, session.user.id), eq(s.id, quizSessionId)),
          limit: 1,
        },
      },
    });

    if (!quiz) {
      return {
        error: {
          code: "quiz_not_found",
          status: 404,
          title: "Quiz Not Found",
          message: "The quiz you are looking for does not exist.",
        },
        success: false,
        data: null,
      };
    }

    if (quiz.sessions.length === 0) {
      return {
        error: {
          code: "quiz_session_not_found",
          status: 404,
          title: "Quiz Session Not Found",
          message: "The quiz session you are looking for does not exist",
        },
        data: null,
        success: false,
      };
    }

    const currentQuestion = quiz.questions.find(
      (q) => q.id === quiz.sessions[0].currentQuestionId
    );

    if (!currentQuestion) {
      return {
        error: {
          code: "question_not_found",
          status: 404,
          title: "Question Not Found",
          message: "The quiz question you are looking for does not exist",
        },
        data: null,
        success: false,
      };
    }

    const nextQuestion = quiz.questions.find(
      (q) => q.order === currentQuestion.order + 1
    );

    if (!nextQuestion) {
      return {
        error: {
          code: "end_of_quiz",
          status: 400,
          title: "End of Quiz",
          message: "No more questions available for this quiz.",
        },
        data: null,
        success: false,
      };
    }

    const updatedSession = await db
      .update(quizSessions)
      .set({
        currentQuestionId: nextQuestion.id,
      })
      .returning();

    return {
      data: updatedSession,
      error: null,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Failed to start quiz", error);
    return {
      error: {
        status: 500,
        code: "internal_server_error",
        message: "Oops! Something went wrong on our side. Please try again.",
        title: "Internal Server Error",
      },
      success: false,
      data: null,
    };
  }
}
