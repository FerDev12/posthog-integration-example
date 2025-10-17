import { z } from "zod";

export const createQuizDto = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string(),
  imageUrl: z.url().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  questions: z.array(
    z.object({
      question: z.string().min(1),
      order: z.int(),
      answers: z.array(
        z.object({
          answer: z.string().min(1),
          isCorrect: z.boolean().default(false),
          explanation: z.string().optional(),
          order: z.int(),
        }),
      ),
    }),
  ),
});

export type CreateQuizDto = z.infer<typeof createQuizDto>;
