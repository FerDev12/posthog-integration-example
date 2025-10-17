"use server";

import { db } from "@/db";
import { quizSessions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ActionResult } from "@/types/action-result.type";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function advanceQuestion(
  quizSessionId: string,
  nextQuestionId: string
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

    // Verify the quiz session belongs to the user
    const quizSession = await db.query.quizSessions.findFirst({
      where: (s, { eq, and }) =>
        and(eq(s.id, quizSessionId), eq(s.userId, session.user.id)),
    });

    if (!quizSession) {
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

    // Update session with next question
    const updatedSession = await db
      .update(quizSessions)
      .set({
        currentQuestionId: nextQuestionId,
      })
      .where(eq(quizSessions.id, quizSessionId))
      .returning();

    return {
      data: updatedSession[0],
      error: null,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Failed to advance question", error);
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
