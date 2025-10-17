"use server";

import { db } from "@/db";
import { quizSessionAnswers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ActionResult } from "@/types/action-result.type";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

export async function getSessionAnswers(
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

    const answers = await db.query.quizSessionAnswers.findMany({
      where: (a, { eq }) => eq(a.sessionId, quizSessionId),
      with: {
        selectedAnswer: true,
        question: true,
      },
    });

    return {
      data: answers,
      error: null,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Failed to get session answers", error);
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
