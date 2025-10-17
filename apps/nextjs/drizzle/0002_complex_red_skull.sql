CREATE TABLE "quiz_session_answers" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text,
	"question_id" text,
	"selected_answer_id" text,
	"is_correct" boolean NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quiz_session_answers" ADD CONSTRAINT "quiz_session_answers_session_id_quiz_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."quiz_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_session_answers" ADD CONSTRAINT "quiz_session_answers_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_session_answers" ADD CONSTRAINT "quiz_session_answers_selected_answer_id_quiz_answers_id_fk" FOREIGN KEY ("selected_answer_id") REFERENCES "public"."quiz_answers"("id") ON DELETE cascade ON UPDATE no action;