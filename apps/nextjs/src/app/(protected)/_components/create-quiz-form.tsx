"use client";

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
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { createQuizDto, CreateQuizDto } from "@/dtos/create-quiz.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuiz } from "@/actions/create-quiz.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { QUIZ_CATEGORY } from "@/constants";
import { UploadButton, UploadDropzone } from "@/lib/utils/uploadthing";
import Image from "next/image";

const DEFAULT_VALUES: Partial<CreateQuizDto> = {
  title: "",
  description: "",
  questions: [
    {
      question: "",
      order: 1,
      answers: [
        {
          answer: "",
          isCorrect: false,
          order: 1,
        },
        {
          answer: "",
          isCorrect: false,
          order: 2,
        },
        {
          answer: "",
          isCorrect: false,
          order: 3,
        },
        {
          answer: "",
          isCorrect: false,
          order: 4,
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

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  async function handleCreateQuiz(data: CreateQuizDto) {
    // Transform the data to ensure proper order values
    const transformedData: CreateQuizDto = {
      ...data,
      questions: data.questions.map((question, qIndex) => ({
        ...question,
        order: qIndex + 1,
        answers: question.answers.map((answer, aIndex) => ({
          ...answer,
          order: aIndex + 1,
        })),
      })),
    };

    const response = await createQuiz(transformedData);
    if (response.success) {
      toast.success(`Your new quiz has been created and published.`);
      router.push(`/my-quizzes`);
    } else {
      toast.error(response.error.message);
    }
  }

  const addQuestion = () => {
    const newQuestion = {
      question: "",
      order: questionFields.length + 1,
      answers: [
        {
          answer: "",
          isCorrect: false,
          order: 1,
        },
        {
          answer: "",
          isCorrect: false,
          order: 2,
        },
        {
          answer: "",
          isCorrect: false,
          order: 3,
        },
        {
          answer: "",
          isCorrect: false,
          order: 4,
        },
      ],
    };
    appendQuestion(newQuestion);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questionFields.length > 1) {
      removeQuestion(index);
    }
  };

  const image = form.watch("imageUrl");

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

                <Field>
                  <FieldLabel>Image</FieldLabel>

                  {!!image && (
                    <div className="relative h-56 ">
                      <Image
                        src={image}
                        alt="uploaded image"
                        fill
                        objectFit="contain"
                      />
                    </div>
                  )}
                  {!image && (
                    <UploadDropzone
                      appearance={{
                        button:
                          "!bg-primary !text-primary-foreground ut-uploading:bg-primary/90 ut-ready:bg-green-500",
                      }}
                      className="bg-muted"
                      endpoint="quizImage"
                      onUploadError={(error) => {
                        toast.error(error.message);
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("imageUrl", res[0].ufsUrl);
                      }}
                    />
                  )}
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field>
                          <FieldLabel htmlFor="category">Category</FieldLabel>
                          <Select
                            value={field.value}
                            disabled={field.disabled}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="category">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(QUIZ_CATEGORY).map((v) => (
                                <SelectItem key={v} value={v}>
                                  {v}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
              {questionFields.map((question, qIndex) => (
                <Card key={question.id} className="border-primary/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Question {qIndex + 1}</Badge>
                        <CardTitle className="text-lg">
                          Question Details
                        </CardTitle>
                      </div>
                      {questionFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <Controller
                      name={`questions.${qIndex}.question`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Question</FieldLabel>
                          <Textarea
                            {...field}
                            placeholder="Enter your question..."
                            aria-invalid={fieldState.invalid}
                            rows={2}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <div className="space-y-3">
                      <Label>Answer Options</Label>
                      {question.answers.map((_, aIndex) => (
                        <div key={aIndex} className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className="w-8 h-8 flex items-center justify-center shrink-0"
                          >
                            {String.fromCharCode(65 + aIndex)}
                          </Badge>
                          <Controller
                            name={`questions.${qIndex}.answers.${aIndex}.answer`}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <div className="flex-1">
                                <Input
                                  {...field}
                                  placeholder={`Option ${String.fromCharCode(65 + aIndex)}`}
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </div>
                            )}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Controller
                        name={`questions.${qIndex}.answers`}
                        control={form.control}
                        render={({ field }) => (
                          <RadioGroup
                            value={
                              field.value
                                .find((answer) => answer.isCorrect)
                                ?.order?.toString() || ""
                            }
                            onValueChange={(value) => {
                              const newAnswers = field.value.map(
                                (answer, index) => ({
                                  ...answer,
                                  isCorrect: index === parseInt(value) - 1,
                                })
                              );
                              field.onChange(newAnswers);
                            }}
                          >
                            <div className="flex gap-4">
                              {field.value.map((_, aIndex) => (
                                <div
                                  key={aIndex}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={(aIndex + 1).toString()}
                                    id={`correct-${qIndex}-${aIndex}`}
                                  />
                                  <Label
                                    htmlFor={`correct-${qIndex}-${aIndex}`}
                                    className="cursor-pointer"
                                  >
                                    {String.fromCharCode(65 + aIndex)}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        )}
                      />
                    </div>

                    <Controller
                      name={`questions.${qIndex}.answers`}
                      control={form.control}
                      render={({ field }) => {
                        const correctAnswer = field.value.find(
                          (answer) => answer.isCorrect
                        );
                        return (
                          <Field>
                            <FieldLabel>Explanation (Optional)</FieldLabel>
                            <Textarea
                              value={correctAnswer?.explanation || ""}
                              onChange={(e) => {
                                const newAnswers = field.value.map(
                                  (answer) => ({
                                    ...answer,
                                    explanation: answer.isCorrect
                                      ? e.target.value
                                      : answer.explanation,
                                  })
                                );
                                field.onChange(newAnswers);
                              }}
                              placeholder="Explain why this is the correct answer..."
                              rows={2}
                            />
                          </Field>
                        );
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Question Button */}
            <Button
              type="button"
              variant="outline"
              onClick={addQuestion}
              className="w-full mb-6 border-dashed border-2 h-12 bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Question
            </Button>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {/*<Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent shrink-0 w-full"
                onClick={() => console.log("[v0] Preview quiz")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>*/}

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
