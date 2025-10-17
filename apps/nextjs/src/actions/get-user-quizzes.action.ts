"use server";

import { db } from "@/db";
import { quizes, quizSessions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ActionResult } from "@/types/action-result.type";
import { headers } from "next/headers";
import { eq, and, isNotNull, desc } from "drizzle-orm";

export async function getUserQuizzes(): Promise<ActionResult> {
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

    // Fetch quizzes created by the user
    const createdQuizzes = await db.query.quizes.findMany({
      where: eq(quizes.createdById, session.user.id),
      with: {
        questions: { columns: { id: true } }, // for count
        sessions: { columns: { id: true } }, // for participant count
      },
      orderBy: desc(quizes.createdAt),
    });

    // Fetch completed quiz sessions
    const completedSessions = await db.query.quizSessions.findMany({
      where: and(
        eq(quizSessions.userId, session.user.id),
        isNotNull(quizSessions.endedAt)
      ),
      with: {
        quiz: {
          with: {
            questions: { columns: { id: true } },
          },
        },
      },
      orderBy: desc(quizSessions.endedAt),
    });

    // Transform created quizzes data
    const transformedCreatedQuizzes = createdQuizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description || "",
      difficulty: quiz.difficulty,
      category: quiz.category,
      imageUrl: quiz.imageUrl || "/placeholder.svg",
      questions: quiz.questions.length,
      participants: quiz.sessions.length,
      createdAt: quiz.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

    // Transform completed sessions data
    const transformedCompletedSessions = completedSessions.map((session) => {
      const timeTaken = session.endedAt
        ? Math.round(
            (new Date(session.endedAt).getTime() -
              new Date(session.startedAt).getTime()) /
              60000
          )
        : 0;

      if (!session.quiz) {
        throw new Error("Session quiz not found");
      }

      const scorePercentage =
        session.quiz.questions.length > 0
          ? Math.round((session.score / session.quiz.questions.length) * 100)
          : 0;

      return {
        id: session.id,
        quizId: session.quizId,
        title: session.quiz.title,
        description: session.quiz.description || "",
        difficulty: session.quiz.difficulty,
        category: session.quiz.category,
        imageUrl: session.quiz.imageUrl || "/placeholder.svg",
        questions: session.quiz.questions.length,
        score: scorePercentage,
        timeTaken: `${timeTaken} min`,
        completedAt: session.endedAt
          ? new Date(session.endedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Unknown",
      };
    });

    return {
      data: {
        createdQuizzes: transformedCreatedQuizzes,
        completedSessions: transformedCompletedSessions,
      },
      error: null,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Failed to get user quizzes", error);
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
