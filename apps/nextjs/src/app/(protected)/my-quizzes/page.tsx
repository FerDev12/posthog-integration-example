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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Users,
  Trophy,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirectToSignIn } from "@/lib/utils/navigation";
import { getUserQuizzes } from "@/actions/get-user-quizzes.action";

export default async function MyQuizzesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirectToSignIn();
  }

  // Fetch user quizzes data
  const result = await getUserQuizzes();

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Quizzes</h1>
          <p className="text-muted-foreground">
            {result.error?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  const { createdQuizzes, completedSessions } = result.data as {
    createdQuizzes: any[];
    completedSessions: any[];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              My <span className="text-primary">Spooky</span> Quizzes
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Track your created quizzes and review your completed challenges
            </p>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your quizzes..."
                  className="pl-10 bg-background"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Created Quizzes Section */}
      <section className="py-12 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Quizzes You Created</h2>
              <p className="text-muted-foreground">
                Manage and track your published quizzes
              </p>
            </div>
            <Link href="/create-quiz">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create New Quiz
              </Button>
            </Link>
          </div>

          {createdQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdQuizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="overflow-hidden hover:border-primary/50 transition-colors group"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={quiz.imageUrl || "/placeholder.svg"}
                      alt={quiz.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-background/90 text-foreground border-border">
                      {quiz.category}
                    </Badge>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl">{quiz.title}</CardTitle>
                      <Badge
                        variant={
                          quiz.difficulty === "Hard"
                            ? "destructive"
                            : quiz.difficulty === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                        className="shrink-0"
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>{quiz.questions} Q</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{quiz.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.avgTime}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created on {quiz.createdAt}
                    </p>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't created any quizzes yet
              </p>
              <Link href="/create-quiz">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Create Your First Quiz
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      {/* Completed Quizzes Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Completed Quizzes</h2>
            <p className="text-muted-foreground">
              Review your quiz history and scores
            </p>
          </div>

          {completedSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedSessions.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="overflow-hidden hover:border-primary/50 transition-colors group"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={quiz.imageUrl || "/placeholder.svg"}
                      alt={quiz.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-background/90 text-foreground border-border">
                      {quiz.category}
                    </Badge>
                    {/* Score Badge */}
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold text-lg shadow-lg">
                      {quiz.score}%
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl">{quiz.title}</CardTitle>
                      <Badge
                        variant={
                          quiz.difficulty === "Hard"
                            ? "destructive"
                            : quiz.difficulty === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                        className="shrink-0"
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>{quiz.questions} Q</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.timeTaken}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-primary font-medium">
                          {quiz.score}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Completed on {quiz.completedAt}
                    </p>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Link href={`/quiz/${quiz.quizId}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        Retake Quiz
                      </Button>
                    </Link>
                    <Link
                      href={`/quiz/${quiz.quizId}?showResults=true`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        View Results
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't completed any quizzes yet
              </p>
              <Link href="/explore">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Explore Quizzes
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready for More Challenges?
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore more spooky quizzes and test your developer skills
            </p>
            <Link href="/explore">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Explore Quizzes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
