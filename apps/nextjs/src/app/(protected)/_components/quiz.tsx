"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Trophy,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  QuizSession,
  QuizWithQuestionsAndAnswers,
  QuizSessionAnswer,
} from "@/db/schema";
import { submitAnswer } from "@/actions/submit-answer.action";
import { advanceQuestion } from "@/actions/advance-question.action";

type QuizProps = {
  quiz: QuizWithQuestionsAndAnswers;
  session: QuizSession;
  sessionAnswers?: any[];
  initialShowResults?: boolean;
};

export function Quiz({
  quiz,
  session,
  sessionAnswers: initialSessionAnswers = [],
  initialShowResults = false,
}: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResults, setShowResults] = useState(initialShowResults);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<{
    isCorrect: boolean;
    explanation: string;
    correctAnswer: any;
  } | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<QuizSessionAnswer[]>(
    initialSessionAnswers
  );
  const [currentSession, setCurrentSession] = useState(session);
  const router = useRouter();

  // Find current question based on currentSession.currentQuestionId
  const currentQuestion =
    quiz.questions.find((q) => q.id === currentSession.currentQuestionId) ||
    quiz.questions[0];

  const currentQIndex = quiz.questions.findIndex(
    (q) => q.id === currentQuestion?.id
  );
  const isLastQuestion = currentQIndex === quiz.questions.length - 1;
  const progress = ((currentQIndex + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    setIsSubmitting(true);
    try {
      const result = await submitAnswer(
        quiz.id,
        session.id,
        currentQuestion.id,
        selectedAnswer
      );

      if (result.success && result.data) {
        const data = result.data as any; // Type assertion for now
        setAnswerFeedback({
          isCorrect: data.isCorrect,
          explanation: data.explanation,
          correctAnswer: data.correctAnswer,
        });

        // Add to session answers
        setSessionAnswers((prev) => [...prev, data.sessionAnswer]);

        // Update session score only, don't advance to next question yet
        setCurrentSession((prev) => ({
          ...prev,
          score: data.updatedScore,
        }));

        // If it's the last question, navigate to results page
        if (data.isLastQuestion) {
          router.push(`/quiz/${quiz.id}?showResults=true`);
        }
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Navigate to results page with search parameter
      router.push(`/quiz/${quiz.id}?showResults=true`);
    } else {
      // Get the next question
      const nextQuestionIndex = currentQIndex + 1;
      const nextQuestion = quiz.questions[nextQuestionIndex];

      try {
        // Advance to next question in database
        const result = await advanceQuestion(
          currentSession.id,
          nextQuestion.id
        );

        if (result.success) {
          // Update local session state
          setCurrentSession((prev) => ({
            ...prev,
            currentQuestionId: nextQuestion.id,
          }));

          // Reset for next question
          setSelectedAnswer("");
          setAnswerFeedback(null);
        }
      } catch (error) {
        console.error("Failed to advance question:", error);
      }
    }
  };

  const calculateScore = () => {
    return sessionAnswers.filter((answer) => answer.isCorrect).length;
  };

  if (showResults) {
    const score = currentSession.score;
    const percentage = (score / quiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="border-primary/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl mb-2">Quiz Complete!</CardTitle>
                <CardDescription className="text-lg">
                  {quiz.title}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {score}/{quiz.questions.length}
                  </div>
                  <p className="text-muted-foreground">
                    You scored {percentage.toFixed(0)}%
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {score}
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">
                      {quiz.questions.length - score}
                    </div>
                    <div className="text-sm text-muted-foreground">Wrong</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {/* {Math.floor(timeElapsed / 60)}:
                      {(timeElapsed % 60).toString().padStart(2, "0")} */}
                      {currentSession.endedAt && currentSession.startedAt
                        ? Math.round(
                            (new Date(currentSession.endedAt).getTime() -
                              new Date(currentSession.startedAt).getTime()) /
                              60000
                          )
                        : 0}{" "}
                      min
                    </div>
                    <div className="text-sm text-muted-foreground">Time</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Review Answers</h3>
                  {quiz.questions.map((q, index) => {
                    const userAnswer = sessionAnswers.find(
                      (sa) => sa.questionId === q.id
                    );
                    const isCorrect = userAnswer?.isCorrect || false;
                    const selectedOption = userAnswer?.selectedAnswerId
                      ? q.answers.find(
                          (opt) => opt.id === userAnswer.selectedAnswerId
                        )
                      : null;
                    const correctOption = q.answers.find(
                      (opt) => opt.isCorrect
                    );

                    return (
                      <Card
                        key={q.id}
                        className={
                          isCorrect
                            ? "border-primary/50"
                            : "border-destructive/50"
                        }
                      >
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            {isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                            ) : (
                              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-1" />
                            )}
                            <div className="flex-1">
                              <CardTitle className="text-base mb-2">
                                Question {index + 1}: {q.question}
                              </CardTitle>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">
                                    Your answer:{" "}
                                  </span>
                                  <span
                                    className={
                                      isCorrect
                                        ? "text-primary font-medium"
                                        : "text-destructive font-medium"
                                    }
                                  >
                                    {selectedOption?.answer || "Not answered"}
                                  </span>
                                </div>
                                {!isCorrect && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Correct answer:{" "}
                                    </span>
                                    <span className="text-primary font-medium">
                                      {correctOption?.answer}
                                    </span>
                                  </div>
                                )}
                                <p className="text-muted-foreground italic">
                                  {correctOption?.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>

              <CardFooter className="flex gap-4">
                <Link href="/explore" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Explore
                  </Button>
                </Link>
                <Link href={`/quiz/${quiz.id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Quiz
                  </Button>
                </Link>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Try Another Quiz
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Quiz Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{quiz.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {quiz.description}
                </p>
              </div>
              <Badge variant="secondary">{quiz.difficulty}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Question {currentQIndex + 1} of {quiz.questions.length}
                </span>
                <span className="font-medium">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-balance">
                {currentQuestion?.question}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <RadioGroup
                value={selectedAnswer}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
                disabled={!!answerFeedback}
              >
                {currentQuestion?.answers.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                      selectedAnswer === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    } ${
                      answerFeedback && option.isCorrect
                        ? "border-green-500 bg-green-50"
                        : answerFeedback &&
                            selectedAnswer === option.id &&
                            !option.isCorrect
                          ? "border-red-500 bg-red-50"
                          : ""
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label
                      htmlFor={option.id}
                      className="flex-1 cursor-pointer"
                    >
                      {option.answer}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {answerFeedback && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    answerFeedback.isCorrect
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {answerFeedback.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={`font-medium ${
                          answerFeedback.isCorrect
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {answerFeedback.isCorrect ? "Correct!" : "Incorrect"}
                      </p>
                      {answerFeedback.explanation && (
                        <p className="text-sm text-gray-700 mt-1">
                          {answerFeedback.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={async () => {
                  const prevQuestionIndex = Math.max(0, currentQIndex - 1);
                  const prevQuestion = quiz.questions[prevQuestionIndex];

                  try {
                    const result = await advanceQuestion(
                      currentSession.id,
                      prevQuestion.id
                    );

                    if (result.success) {
                      setCurrentSession((prev) => ({
                        ...prev,
                        currentQuestionId: prevQuestion.id,
                      }));
                      setSelectedAnswer("");
                      setAnswerFeedback(null);
                    }
                  } catch (error) {
                    console.error("Failed to go to previous question:", error);
                  }
                }}
                disabled={currentQIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {!answerFeedback ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLastQuestion ? "Finish Quiz" : "Next Question"}
                  {!isLastQuestion && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Question Navigator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {quiz.questions.map((q, index) => {
                  const isAnswered = sessionAnswers.some(
                    (sa) => sa.questionId === q.id
                  );
                  const isCorrect = sessionAnswers.find(
                    (sa) => sa.questionId === q.id
                  )?.isCorrect;

                  return (
                    <Button
                      key={q.id}
                      variant={currentQIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={async () => {
                        try {
                          const result = await advanceQuestion(
                            currentSession.id,
                            q.id
                          );

                          if (result.success) {
                            setCurrentSession((prev) => ({
                              ...prev,
                              currentQuestionId: q.id,
                            }));
                            setSelectedAnswer("");
                            setAnswerFeedback(null);
                          }
                        } catch (error) {
                          console.error(
                            "Failed to navigate to question:",
                            error
                          );
                        }
                      }}
                      className={`w-10 h-10 ${
                        isAnswered
                          ? currentQIndex === index
                            ? "bg-primary"
                            : isCorrect
                              ? "border-green-500 text-green-600"
                              : "border-red-500 text-red-600"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
