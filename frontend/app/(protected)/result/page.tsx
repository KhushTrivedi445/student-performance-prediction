"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { PageTransition } from "@/components/page-transition";
import type { PredictionFormData } from "@/lib/prediction-schema";
import {
  GraduationCap,
  Award,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Save,
  Home,
  RefreshCw,
  TrendingUp,
  BookOpen,
  Clock,
} from "lucide-react";

interface PredictionResult {
  predictedMarks: number;
  formData: PredictionFormData;
}

function getPerformanceStatus(marks: number): {
  status: "Excellent" | "Average" | "Needs Improvement";
  color: string;
  bgColor: string;
  icon: typeof Award;
} {
  if (marks >= 70) {
    return {
      status: "Excellent",
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: Award,
    };
  } else if (marks >= 50) {
    return {
      status: "Average",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      icon: BarChart3,
    };
  } else {
    return {
      status: "Needs Improvement",
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: AlertTriangle,
    };
  }
}

function generateInsights(
  marks: number,
  formData: PredictionFormData
): { icon: typeof Lightbulb; title: string; description: string }[] {
  const insights: { icon: typeof Lightbulb; title: string; description: string }[] = [];

  // Study time insight
  if (formData.studytime <= 2) {
    insights.push({
      icon: Clock,
      title: "Increase Study Hours",
      description:
        "Consider dedicating more time to studying. Students who study 5+ hours weekly typically score higher.",
    });
  } else {
    insights.push({
      icon: Clock,
      title: "Maintain Study Routine",
      description:
        "Your study habits are solid. Keep up the consistent effort for continued success.",
    });
  }

  // Absences insight
  if (formData.absences > 10) {
    insights.push({
      icon: BookOpen,
      title: "Improve Attendance",
      description:
        "High absences can significantly impact performance. Try to attend classes regularly.",
    });
  } else {
    insights.push({
      icon: BookOpen,
      title: "Great Attendance",
      description:
        "Your attendance record is helping your academic performance. Keep showing up!",
    });
  }

  // Performance trend insight
  const avgPrev = (formData.G1 + formData.G2) / 2;
  if (marks > avgPrev) {
    insights.push({
      icon: TrendingUp,
      title: "Upward Trend",
      description:
        "Your predicted score shows improvement from previous terms. Your hard work is paying off!",
    });
  } else if (marks < avgPrev - 5) {
    insights.push({
      icon: TrendingUp,
      title: "Focus on Improvement",
      description:
        "Consider seeking additional help or tutoring to boost your final performance.",
    });
  }

  return insights.slice(0, 3);
}

export default function ResultPage() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { addPrediction } = useAuth();

  useEffect(() => {
    const storedResult = sessionStorage.getItem("predictionResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      router.push("/predict");
    }
  }, [router]);

  const handleSave = () => {
    if (!result) return;

    setIsSaving(true);

    const performance = getPerformanceStatus(result.predictedMarks);
    addPrediction({
      date: new Date().toISOString(),
      predictedMarks: result.predictedMarks,
      status: performance.status,
      formData: result.formData,
    });

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      toast({
        title: "Prediction Saved!",
        description: "Your prediction has been saved to your dashboard.",
      });
      // Clear session storage
      sessionStorage.removeItem("predictionResult");
      sessionStorage.removeItem("predictionFormData");
    }, 500);
  };

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const performance = getPerformanceStatus(result.predictedMarks);
  const StatusIcon = performance.icon;
  const insights = generateInsights(result.predictedMarks, result.formData);

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
          </div>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Result Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-border/50 shadow-lg">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center sm:p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                >
                  <StatusIcon className="h-10 w-10 text-white" />
                </motion.div>
                <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                  Your Prediction Results
                </h1>
                <p className="text-white/80">
                  Based on your submitted information
                </p>
              </div>

              <CardContent className="p-6 sm:p-8">
                {/* Score Display */}
                <div className="mb-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Predicted Final Marks (G3)
                    </p>
                    <div className="mb-4 text-6xl font-bold text-foreground sm:text-7xl">
                      {result.predictedMarks}
                      <span className="text-2xl text-muted-foreground">
                        /100
                      </span>
                    </div>
                  </motion.div>

                  {/* Progress Bar */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-4"
                  >
                    <Progress
                      value={result.predictedMarks}
                      className="h-4 w-full"
                    />
                  </motion.div>

                  {/* Status Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${performance.bgColor} ${performance.color}`}
                  >
                    <StatusIcon className="h-5 w-5" />
                    <span className="font-semibold">{performance.status}</span>
                  </motion.div>
                </div>

                {/* Insights Section */}
                <div className="mb-8">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Personalized Insights
                  </h2>
                  <div className="space-y-3">
                    {insights.map((insight, index) => (
                      <motion.div
                        key={insight.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="rounded-xl border border-border/50 bg-muted/30 p-4"
                      >
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <insight.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">
                              {insight.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || isSaved}
                    className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : isSaved ? (
                      <>
                        <Award className="h-4 w-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Prediction
                      </>
                    )}
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full gap-2 bg-transparent">
                      <Home className="h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                </motion.div>

                {/* New Prediction Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-4 text-center"
                >
                  <Link
                    href="/predict"
                    className="text-sm text-primary hover:underline"
                  >
                    Start a new prediction
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
