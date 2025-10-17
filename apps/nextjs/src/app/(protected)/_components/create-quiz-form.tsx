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

interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export default function CreateQuizPage() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("");
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

  const handleSave = () => {
    console.log("[v0] Saving quiz:", {
      title: quizTitle,
      description: quizDescription,
      difficulty,
      category,
      questions,
    });
    // Here you would typically save to a database
    alert("Quiz saved successfully!");
  };

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

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/explore"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/create-quiz"
              className="text-sm text-primary font-medium"
            >
              Create Quiz
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Spooky Quiz</h1>
            <p className="text-muted-foreground">
              Share your developer knowledge and challenge the community
            </p>
          </div>

          {/* Quiz Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>
                Basic information about your quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., JavaScript Nightmares"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your quiz is about..."
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., JavaScript, React, CSS"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                    <Label htmlFor={`question-${question.id}`}>Question</Label>
                    <Textarea
                      id={`question-${question.id}`}
                      placeholder="Enter your question..."
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(question.id, "question", e.target.value)
                      }
                      rows={2}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Answer Options</Label>
                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="flex items-center gap-3">
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
                            updateOption(question.id, option.id, e.target.value)
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
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
