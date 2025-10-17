"use server";

import { db } from "@/db";
import { quizAnswers, quizes, quizQuestions } from "@/db/schema";
import { createQuizDto, CreateQuizDto } from "@/dtos/create-quiz.dto";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import z from "zod";

export async function createQuiz(data: CreateQuizDto) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      status: 401,
      code: "unathorized",
      title: "Unauthorized",
      message: "You are not allowed to perform this action.",
    };
  }

  const { user } = session;

  const result = createQuizDto.safeParse(data);

  if (!result.success) {
    return {
      status: 400,
      code: "validation_error",
      title: "Invalid Data",
      message: z.prettifyError(result.error),
    };
  }

  await db.transaction(async (tx) => {
    const [quiz] = await tx
      .insert(quizes)
      .values({
        title: result.data.title,
        description: result.data.description,
        imageUrl: result.data.imageUrl,
        createdById: user.id,
        categoryId: result.data.categoryId,
        difficulty: result.data.difficulty,
      })
      .returning({ id: quizes.id });

    const questions = await tx
      .insert(quizQuestions)
      .values(
        result.data.questions.map((question) => ({
          question: question.question,
          order: question.order,
          quizId: quiz.id,
        })),
      )
      .returning({ id: quizQuestions.id, order: quizQuestions.order });

    for (const question of questions) {
      const q = result.data.questions.find((q) => q.order === question.order);
      if (q) {
        for (const answer of q.answers) {
          await tx.insert(quizAnswers).values({
            ...answer,
            questionId: question.id,
          });
        }
      }
    }
  });
}
