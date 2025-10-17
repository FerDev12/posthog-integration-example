import { useState } from "react";
import Link from "next/link";
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
import { QuizSession, QuizWithQuestionsAndAnswers } from "@/db/schema";

const quizData = {
  id: 1,
  title: "JavaScript Nightmares",
  description: "Test your knowledge of JavaScript's most haunting features",
  difficulty: "Hard",
  totalQuestions: 5,
  questions: [
    {
      id: 1,
      question: "What will be the output of: console.log(typeof null)?",
      options: [
        { id: "a", text: "'null'" },
        { id: "b", text: "'object'" },
        { id: "c", text: "'undefined'" },
        { id: "d", text: "'number'" },
      ],
      correctAnswer: "b",
      explanation:
        "This is a well-known JavaScript quirk. typeof null returns 'object' due to a bug in the original JavaScript implementation that has been kept for backward compatibility.",
    },
    {
      id: 2,
      question: "What does the following code return: [] == ![]?",
      options: [
        { id: "a", text: "true" },
        { id: "b", text: "false" },
        { id: "c", text: "undefined" },
        { id: "d", text: "TypeError" },
      ],
      correctAnswer: "a",
      explanation:
        "This returns true due to JavaScript's type coercion. ![] becomes false, then [] == false compares an empty array to false, both coerce to 0, making the comparison true.",
    },
    {
      id: 3,
      question: "What is a closure in JavaScript?",
      options: [
        {
          id: "a",
          text: "A function that has access to variables in its outer scope",
        },
        { id: "b", text: "A way to close browser windows" },
        { id: "c", text: "A method to end a loop" },
        { id: "d", text: "A type of error handling" },
      ],
      correctAnswer: "a",
      explanation:
        "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.",
    },
    {
      id: 4,
      question: "What will console.log(0.1 + 0.2 === 0.3) output?",
      options: [
        { id: "a", text: "true" },
        { id: "b", text: "false" },
        { id: "c", text: "undefined" },
        { id: "d", text: "NaN" },
      ],
      correctAnswer: "b",
      explanation:
        "This outputs false due to floating-point precision issues. 0.1 + 0.2 actually equals 0.30000000000000004 in JavaScript.",
    },
    {
      id: 5,
      question: "What is the difference between let and var?",
      options: [
        { id: "a", text: "No difference, they're the same" },
        { id: "b", text: "let is block-scoped, var is function-scoped" },
        { id: "c", text: "var is block-scoped, let is function-scoped" },
        { id: "d", text: "let can't be reassigned" },
      ],
      correctAnswer: "b",
      explanation:
        "let is block-scoped (limited to the block where it's defined), while var is function-scoped (available throughout the entire function).",
    },
  ],
};

type QuizProps = {
  quiz: QuizWithQuestionsAndAnswers;
  session: QuizSession;
};

export function Quiz({ quiz, session }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const progress = ((currentQuestion + 1) / quizData.totalQuestions) * 100;
  const currentQ = quizData.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quizData.totalQuestions - 1;

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerId,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quizData.totalQuestions) * 100;

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl">👻</div>
              <span className="text-lg font-bold tracking-tight">
                Spooky Dev Quiz
              </span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="border-primary/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl mb-2">Quiz Complete!</CardTitle>
                <CardDescription className="text-lg">
                  {quizData.title}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {score}/{quizData.totalQuestions}
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
                      {quizData.totalQuestions - score}
                    </div>
                    <div className="text-sm text-muted-foreground">Wrong</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {Math.floor(timeElapsed / 60)}:
                      {(timeElapsed % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-muted-foreground">Time</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Review Answers</h3>
                  {quizData.questions.map((q, index) => {
                    const userAnswer = selectedAnswers[index];
                    const isCorrect = userAnswer === q.correctAnswer;
                    const selectedOption = q.options.find(
                      (opt) => opt.id === userAnswer
                    );
                    const correctOption = q.options.find(
                      (opt) => opt.id === q.correctAnswer
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
                                    {selectedOption?.text || "Not answered"}
                                  </span>
                                </div>
                                {!isCorrect && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Correct answer:{" "}
                                    </span>
                                    <span className="text-primary font-medium">
                                      {correctOption?.text}
                                    </span>
                                  </div>
                                )}
                                <p className="text-muted-foreground italic">
                                  {q.explanation}
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
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl">👻</div>
            <span className="text-lg font-bold tracking-tight">
              Spooky Dev Quiz
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(timeElapsed / 60)}:
                {(timeElapsed % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Quiz Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{quizData.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {quizData.description}
                </p>
              </div>
              <Badge variant="secondary">{quizData.difficulty}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Question {currentQuestion + 1} of {quizData.totalQuestions}
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
                {currentQ.question}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <RadioGroup
                value={selectedAnswers[currentQuestion] || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQ.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                      selectedAnswers[currentQuestion] === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label
                      htmlFor={option.id}
                      className="flex-1 cursor-pointer"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!selectedAnswers[currentQuestion]}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLastQuestion ? "Finish Quiz" : "Next"}
                {!isLastQuestion && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </CardFooter>
          </Card>

          {/* Question Navigator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {quizData.questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentQuestion === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 ${
                      selectedAnswers[index]
                        ? currentQuestion === index
                          ? "bg-primary"
                          : "border-primary text-primary"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
