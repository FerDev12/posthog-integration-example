import { QUIZ_CATEGORY } from "@/constants";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const quizDifficulty = pgEnum("quiz_level", [
  "begginer",
  "easy",
  "medium",
  "hard",
]);

export const quizCategories = pgEnum("quiz_categories", QUIZ_CATEGORY);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const quizes = pgTable("quizes", {
  id: text("id").primaryKey().$defaultFn(crypto.randomUUID),
  title: text("title").notNull(),
  difficulty: quizDifficulty("difficulty").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  createdById: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  category: quizCategories("category").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const quizesRelations = relations(quizes, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [quizes.createdById],
    references: [users.id],
  }),
  questions: many(quizQuestions),
}));

export const quizQuestions = pgTable("quiz_questions", {
  id: text("id").primaryKey().$default(crypto.randomUUID),
  question: text("question").notNull(),
  quizId: text("quiz_id").references(() => quizes.id, { onDelete: "cascade" }),
  order: integer("order").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const quizQuestionsRelations = relations(
  quizQuestions,
  ({ one, many }) => ({
    quiz: one(quizes, {
      fields: [quizQuestions.quizId],
      references: [quizes.id],
    }),
    answers: many(quizAnswers),
  }),
);

export const quizAnswers = pgTable(
  "quiz_answers",
  {
    id: text("id").primaryKey().$default(crypto.randomUUID),
    answer: text("answer").notNull(),
    questionId: text("question_id").references(() => quizQuestions.id, {
      onDelete: "cascade",
    }),
    order: integer("order").default(1).notNull(),
    isCorrect: boolean("is_correct").default(false).notNull(),
    explanation: text("explanation"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [unique("question_answer").on(t.questionId, t.answer)],
);

export const quizAnswersRelations = relations(quizAnswers, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizAnswers.questionId],
    references: [quizQuestions.id],
  }),
}));

export const quizSessions = pgTable("quiz_sessions", {
  id: text("id").primaryKey().$default(crypto.randomUUID),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  quizId: text("quiz_id").references(() => quizes.id, { onDelete: "cascade" }),
  currentQuestionId: text("current_question_id").references(
    () => quizQuestions.id,
    {
      onDelete: "cascade",
    },
  ),
  score: integer("score").default(0).notNull(),
  startedAt: timestamp("started_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});
