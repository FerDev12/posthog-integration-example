"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, Save, Eye } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { createQuizDto, CreateQuizDto } from "@/dtos/create-quiz.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuiz } from "@/actions/create-quiz";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

const DEFAULT_VALUES: Partial<CreateQuizDto> = {
  title: "",
  description: "",
  questions: [
    {
      question: "",
      order: 1,
      answers: [
        {
          order: 1,
          answer: "",
        },
        {
          order: 2,
          answer: "",
        },
        {
          order: 3,
          answer: "",
        },
        {
          order: 4,
          answer: "",
        },
      ],
    },
  ],
};

export function CreateQuizForm() {
  const router = useRouter();

  const form = useForm<CreateQuizDto>({
    resolver: zodResolver(createQuizDto),
    defaultValues: DEFAULT_VALUES,
  });

  async function handleCreateQuiz(data: CreateQuizDto) {
    const response = await createQuiz(data);
    if (response.success) {
      toast.success(`Your new quiz has been created and published.`);
      router.push(`/my-quizzes`);
    } else {
      toast.error(response.error.message);
    }
  }

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "",
      options: [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ],
      correctAnswer: "",
      explanation: "",
    },
  ]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      options: [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ],
      correctAnswer: "",
      explanation: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: string, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, text: value } : opt,
              ),
            }
          : q,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Spooky Quiz</h1>
            <p className="text-muted-foreground">
              Share your developer knowledge and challenge the community
            </p>
          </div>

          <form
            id="create-quiz-form"
            onSubmit={form.handleSubmit(handleCreateQuiz)}
          >
            {/* Quiz Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
                <CardDescription>
                  Basic information about your quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field>
                        <FieldLabel>Quiz Title</FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g., JavaScript Nightmares"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="Describe what your quiz is about..."
                          rows={3}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field>
                          <FieldLabel>Category</FieldLabel>
                          <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            placeholder="e.g., JavaScript, React, CSS"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  <Controller
                    name="difficulty"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field>
                          <FieldLabel>Difficulty</FieldLabel>
                          <Select
                            value={field.value}
                            disabled={field.disabled}
                            aria-invalid={fieldState.invalid}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="difficulty">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-6 mb-6">
              {questions.map((question, qIndex) => (
                <Card key={question.id} className="border-primary/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Question {qIndex + 1}</Badge>
                        <CardTitle className="text-lg">
                          Question Details
                        </CardTitle>
                      </div>
                      {questions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${question.id}`}>
                        Question
                      </Label>
                      <Textarea
                        id={`question-${question.id}`}
                        placeholder="Enter your question..."
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "question",
                            e.target.value,
                          )
                        }
                        rows={2}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Answer Options</Label>
                      {question.options.map((option, oIndex) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-3"
                        >
                          <Badge
                            variant="secondary"
                            className="w-8 h-8 flex items-center justify-center shrink-0"
                          >
                            {option.id.toUpperCase()}
                          </Badge>
                          <Input
                            placeholder={`Option ${option.id.toUpperCase()}`}
                            value={option.text}
                            onChange={(e) =>
                              updateOption(
                                question.id,
                                option.id,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <RadioGroup
                        value={question.correctAnswer}
                        onValueChange={(value) =>
                          updateQuestion(question.id, "correctAnswer", value)
                        }
                      >
                        <div className="flex gap-4">
                          {question.options.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={option.id}
                                id={`correct-${question.id}-${option.id}`}
                              />
                              <Label
                                htmlFor={`correct-${question.id}-${option.id}`}
                                className="cursor-pointer"
                              >
                                {option.id.toUpperCase()}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`explanation-${question.id}`}>
                        Explanation (Optional)
                      </Label>
                      <Textarea
                        id={`explanation-${question.id}`}
                        placeholder="Explain why this is the correct answer..."
                        value={question.explanation}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "explanation",
                            e.target.value,
                          )
                        }
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Question Button */}
            <Button
              variant="outline"
              onClick={addQuestion}
              className="w-full mb-6 border-dashed border-2 h-12 bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Question
            </Button>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => console.log("[v0] Preview quiz")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <Field>
                <Button
                  type="submit"
                  isLoading={form.formState.isSubmitting}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Quiz
                </Button>
              </Field>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
