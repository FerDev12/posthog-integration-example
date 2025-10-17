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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Users, Trophy, Search, Filter } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirectToSignIn } from "@/lib/utils/navigation";
import { db } from "@/db";

async function getMyQuizes(userId: string) {
  try {
    return await db.query.quizes.findMany({
      where: (q, { eq }) => eq(q.createdById, userId),
      with: {
        questions: {
          with: {
            answers: true,
          },
        },
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching quizes", error);
    return [];
  }
}

export default async function ExplorePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirectToSignIn();
  }

  const quizzes = await getMyQuizes(session.user.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              My <span className="text-primary">Spooky</span> Quizzes
            </h1>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  className="pl-10 bg-background"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
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
                        quiz.difficulty === "hard"
                          ? "destructive"
                          : quiz.difficulty === "medium"
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span>{quiz.questions.length} Q</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {/*<span>{quiz.participants.toLocaleString()}</span>*/}
                      <span>{12}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {/*<span>{quiz.avgTime}</span>*/}
                      <span>5 min</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/quiz/${quiz.id}`} className="w-full">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Start Quiz
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Create Your Own Spooky Quiz
            </h2>
            <p className="text-muted-foreground mb-6">
              Share your developer knowledge and challenge the community
            </p>
            <Link href="/create-quiz">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
