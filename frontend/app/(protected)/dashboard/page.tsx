"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { PageTransition } from "@/components/page-transition";
import {
  GraduationCap,
  Plus,
  Calendar,
  TrendingUp,
  Award,
  AlertTriangle,
  BarChart3,
  LogOut,
  FileText,
} from "lucide-react";

function getStatusIcon(status: string) {
  switch (status) {
    case "Excellent":
      return <Award className="h-5 w-5 text-green-500" />;
    case "Average":
      return <BarChart3 className="h-5 w-5 text-yellow-500" />;
    case "Needs Improvement":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return <BarChart3 className="h-5 w-5" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Excellent":
      return "bg-green-100 text-green-700 border-green-200";
    case "Average":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Needs Improvement":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export default function DashboardPage() {
  const { user, predictions, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                EduPredict
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-muted-foreground sm:block">
                Welcome, {user?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                View your predictions and start new analyses
              </p>
            </div>
            <Link href="/predict">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                New Prediction
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Predictions
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {predictions.length}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Score
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {predictions.length > 0
                      ? Math.round(
                          predictions.reduce(
                            (acc, p) => acc + p.predictedMarks,
                            0
                          ) / predictions.length
                        )
                      : "-"}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Best Score
                  </CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {predictions.length > 0
                      ? Math.max(...predictions.map((p) => p.predictedMarks))
                      : "-"}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Predictions List */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Your Predictions
            </h2>

            {predictions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <BarChart3 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      No predictions yet
                    </h3>
                    <p className="mb-6 max-w-sm text-center text-muted-foreground">
                      Start your first prediction to see how our AI can help you
                      understand your academic potential.
                    </p>
                    <Link href="/predict">
                      <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="h-4 w-4" />
                        Start New Prediction
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-border/50 transition-all hover:border-primary/30 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(prediction.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                          {getStatusIcon(prediction.status)}
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">
                            Predicted Final Marks
                          </p>
                          <p className="text-3xl font-bold text-foreground">
                            {prediction.predictedMarks}
                            <span className="text-lg text-muted-foreground">
                              /100
                            </span>
                          </p>
                        </div>

                        <div
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(prediction.status)}`}
                        >
                          {prediction.status}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
