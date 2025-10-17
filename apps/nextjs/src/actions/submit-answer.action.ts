"use server";

import { db } from "@/db";
import { quizSessions, quizSessionAnswers, quizAnswers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ActionResult } from "@/types/action-result.type";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

export async function submitAnswer(
  quizId: string,
  quizSessionId: string,
  questionId: string,
  selectedAnswerId: string
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

    // Get the selected answer and check if it's correct
    const selectedAnswer = await db.query.quizAnswers.findFirst({
      where: (a, { eq, and }) =>
        and(eq(a.id, selectedAnswerId), eq(a.questionId, questionId)),
    });

    if (!selectedAnswer) {
      return {
        error: {
          code: "answer_not_found",
          status: 404,
          title: "Answer Not Found",
          message: "The selected answer does not exist for this question",
        },
        data: null,
        success: false,
      };
    }

    // Check if this question has already been answered
    const existingAnswer = await db.query.quizSessionAnswers.findFirst({
      where: (a, { eq, and }) =>
        and(eq(a.sessionId, quizSessionId), eq(a.questionId, questionId)),
    });

    if (existingAnswer) {
      return {
        error: {
          code: "question_already_answered",
          status: 400,
          title: "Question Already Answered",
          message: "This question has already been answered",
        },
        data: null,
        success: false,
      };
    }

    // Insert the answer record
    const [sessionAnswer] = await db
      .insert(quizSessionAnswers)
      .values({
        sessionId: quizSessionId,
        questionId: questionId,
        selectedAnswerId: selectedAnswerId,
        isCorrect: selectedAnswer.isCorrect,
      })
      .returning();

    // Update session score if correct
    const newScore = selectedAnswer.isCorrect
      ? quizSession.score + 1
      : quizSession.score;

    // Get the next question
    const quiz = await db.query.quizes.findFirst({
      where: (q, { eq }) => eq(q.id, quizId),
      with: {
        questions: {
          orderBy: (q, { asc }) => [asc(q.order)],
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

    const currentQuestionIndex = quiz.questions.findIndex(
      (q) => q.id === questionId
    );
    const nextQuestion = quiz.questions[currentQuestionIndex + 1];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    // Update session with new score only (don't advance to next question yet)
    const updatedSession = await db
      .update(quizSessions)
      .set({
        score: newScore,
        endedAt: isLastQuestion ? new Date() : undefined,
      })
      .where(eq(quizSessions.id, quizSessionId))
      .returning();

    // Get the correct answer for explanation
    const correctAnswer = await db.query.quizAnswers.findFirst({
      where: (a, { eq, and }) =>
        and(eq(a.questionId, questionId), eq(a.isCorrect, true)),
    });

    return {
      data: {
        sessionAnswer,
        isCorrect: selectedAnswer.isCorrect,
        explanation: correctAnswer?.explanation || "",
        correctAnswer: correctAnswer,
        isLastQuestion,
        nextQuestionId: nextQuestion?.id || null,
        updatedScore: newScore,
      },
      error: null,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Failed to submit answer", error);
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
