"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/page-transition";
import {
  PredictionFormData,
  initialFormData,
  formOptions,
  stepTitles,
  stepDescriptions,
} from "@/lib/prediction-schema";
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  User,
  Users,
  BookOpen,
  Heart,
  FileText,
} from "lucide-react";

const stepIcons = [User, Users, BookOpen, Heart, FileText];

export default function PredictPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PredictionFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const updateField = <K extends keyof PredictionFormData>(
    field: K,
    value: PredictionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!formData.sex) newErrors.sex = "This field is required.";
        if (
          Number.isNaN(formData.age) ||
          formData.age === null ||
          formData.age === undefined
        )
          newErrors.age = "This field is required.";
        else if (formData.age < 1 || formData.age > 120)
          newErrors.age = "Age must be between 1 and 120.";
        if (!formData.address) newErrors.address = "This field is required.";
        if (!formData.famsize) newErrors.famsize = "This field is required.";
        if (!formData.pstatus) newErrors.pstatus = "This field is required.";
        break;
      case 1:
        if (formData.medu === undefined || formData.medu < 0)
          newErrors.medu = "This field is required.";
        if (formData.fedu === undefined || formData.fedu < 0)
          newErrors.fedu = "This field is required.";
        if (!formData.mjob) newErrors.mjob = "This field is required.";
        if (!formData.fjob) newErrors.fjob = "This field is required.";
        if (!formData.guardian) newErrors.guardian = "This field is required.";
        if (formData.famrel === 0) newErrors.famrel = "This field is required.";
        if (!formData.famsup) newErrors.famsup = "This field is required.";
        break;
      case 2:
        if (!formData.reason) newErrors.reason = "This field is required.";
        if (formData.traveltime === 0)
          newErrors.traveltime = "This field is required.";
        if (formData.studytime === 0)
          newErrors.studytime = "This field is required.";
        if (formData.failures < 0) newErrors.failures = "This field is required.";
        if (!formData.schoolsup)
          newErrors.schoolsup = "This field is required.";
        if (!formData.paid) newErrors.paid = "This field is required.";
        break;
      case 3:
        if (!formData.activities)
          newErrors.activities = "This field is required.";
        if (!formData.nursery) newErrors.nursery = "This field is required.";
        if (!formData.higher) newErrors.higher = "This field is required.";
        if (!formData.internet) newErrors.internet = "This field is required.";
        if (!formData.romantic) newErrors.romantic = "This field is required.";
        if (formData.freetime < 0)
          newErrors.freetime = "This field is required.";
        if (formData.goout === 0) newErrors.goout = "This field is required.";
        if (formData.dalc < 0) newErrors.dalc = "This field is required.";
        if (formData.walc < 0) newErrors.walc = "This field is required.";
        if (formData.health < 0) newErrors.health = "This field is required.";
        break;
      case 4:
        if (Number.isNaN(formData.absences) || formData.absences < 0)
          newErrors.absences = "This field is required.";
        if (Number.isNaN(formData.G1))
          newErrors.G1 = "This field is required.";
        else if (formData.G1 < 0 || formData.G1 > 100)
          newErrors.G1 = "Marks must be between 0 and 100.";
        if (Number.isNaN(formData.G2))
          newErrors.G2 = "This field is required.";
        else if (formData.G2 < 0 || formData.G2 > 100)
          newErrors.G2 = "Marks must be between 0 and 100.";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Store form data in sessionStorage for the result page
      sessionStorage.setItem("predictionFormData", JSON.stringify(formData));

      // Simulate API call - in production, this would POST to your FastAPI backend
      // const response = await fetch('YOUR_FASTAPI_BACKEND_URL/predict', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulate prediction result based on G1 and G2 scores
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const result = await response.json();

      const predictedG3 = result.predicted_marks;


      // Store result
      sessionStorage.setItem(
        "predictionResult",
        JSON.stringify({
          predictedMarks: predictedG3,
          formData,
        })
      );

      router.push("/result");
    } catch (error) {
      console.error("[v0] Prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: "Unable to get prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            {/* Sex */}
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select
                value={formData.sex}
                onValueChange={(v) => updateField("sex", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.sex ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.sex.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sex && (
                <p className="text-sm text-destructive">{errors.sex}</p>
              )}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={
                  Number.isNaN(formData.age) || formData.age === 0
                    ? ""
                    : formData.age
                }
                onChange={(e) => {
                  const val = e.target.value;
                  updateField("age", val === "" ? Number.NaN : parseInt(val));
                }}
                className={`rounded-xl ${errors.age ? "border-destructive" : ""}`}
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address Type</Label>
              <Select
                value={formData.address}
                onValueChange={(v) => updateField("address", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.address ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.address.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            {/* Family Size */}
            <div className="space-y-2">
              <Label htmlFor="famsize">Family Size</Label>
              <Select
                value={formData.famsize}
                onValueChange={(v) => updateField("famsize", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.famsize ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select family size" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.famsize.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.famsize && (
                <p className="text-sm text-destructive">{errors.famsize}</p>
              )}
            </div>

            {/* Parent Status */}
            <div className="space-y-2">
              <Label htmlFor="pstatus">{"Parent's Cohabitation Status"}</Label>
              <Select
                value={formData.pstatus}
                onValueChange={(v) => updateField("pstatus", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.pstatus ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.pstatus.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pstatus && (
                <p className="text-sm text-destructive">{errors.pstatus}</p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            {/* Mother's Education */}
            <div className="space-y-2">
              <Label htmlFor="medu">{"Mother's Education"}</Label>
              <Select
                value={formData.medu >= 0 ? formData.medu.toString() : ""}
                onValueChange={(v) => updateField("medu", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.medu ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.education.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.medu && (
                <p className="text-sm text-destructive">{errors.medu}</p>
              )}
            </div>

            {/* Father's Education */}
            <div className="space-y-2">
              <Label htmlFor="fedu">{"Father's Education"}</Label>
              <Select
                value={formData.fedu >= 0 ? formData.fedu.toString() : ""}
                onValueChange={(v) => updateField("fedu", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.fedu ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.education.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fedu && (
                <p className="text-sm text-destructive">{errors.fedu}</p>
              )}
            </div>

            {/* Mother's Job */}
            <div className="space-y-2">
              <Label htmlFor="mjob">{"Mother's Job"}</Label>
              <Select
                value={formData.mjob}
                onValueChange={(v) => updateField("mjob", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.mjob ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.job.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mjob && (
                <p className="text-sm text-destructive">{errors.mjob}</p>
              )}
            </div>

            {/* Father's Job */}
            <div className="space-y-2">
              <Label htmlFor="fjob">{"Father's Job"}</Label>
              <Select
                value={formData.fjob}
                onValueChange={(v) => updateField("fjob", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.fjob ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.job.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fjob && (
                <p className="text-sm text-destructive">{errors.fjob}</p>
              )}
            </div>

            {/* Guardian */}
            <div className="space-y-2">
              <Label htmlFor="guardian">Guardian</Label>
              <Select
                value={formData.guardian}
                onValueChange={(v) => updateField("guardian", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.guardian ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select guardian" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.guardian.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.guardian && (
                <p className="text-sm text-destructive">{errors.guardian}</p>
              )}
            </div>

            {/* Family Relationship Quality */}
            <div className="space-y-2">
              <Label htmlFor="famrel">Family Relationship Quality</Label>
              <Select
                value={formData.famrel > 0 ? formData.famrel.toString() : ""}
                onValueChange={(v) => updateField("famrel", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.famrel ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select quality (1-5)" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.scale1to5.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.famrel && (
                <p className="text-sm text-destructive">{errors.famrel}</p>
              )}
            </div>

            {/* Family Support */}
            <div className="space-y-2">
              <Label htmlFor="famsup">Family Educational Support</Label>
              <Select
                value={formData.famsup}
                onValueChange={(v) => updateField("famsup", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.famsup ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.yesNo.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.famsup && (
                <p className="text-sm text-destructive">{errors.famsup}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason to Choose This School</Label>
              <Select
                value={formData.reason}
                onValueChange={(v) => updateField("reason", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.reason ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.reason.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.reason && (
                <p className="text-sm text-destructive">{errors.reason}</p>
              )}
            </div>

            {/* Travel Time */}
            <div className="space-y-2">
              <Label htmlFor="traveltime">Home to School Travel Time</Label>
              <Select
                value={formData.traveltime > 0 ? formData.traveltime.toString() : ""}
                onValueChange={(v) => updateField("traveltime", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.traveltime ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select travel time" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.traveltime.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.traveltime && (
                <p className="text-sm text-destructive">{errors.traveltime}</p>
              )}
            </div>

            {/* Study Time */}
            <div className="space-y-2">
              <Label htmlFor="studytime">Weekly Study Time</Label>
              <Select
                value={formData.studytime > 0 ? formData.studytime.toString() : ""}
                onValueChange={(v) => updateField("studytime", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.studytime ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select study time" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.studytime.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studytime && (
                <p className="text-sm text-destructive">{errors.studytime}</p>
              )}
            </div>

            {/* Failures */}
            <div className="space-y-2">
              <Label htmlFor="failures">Number of Past Class Failures</Label>
              <Select
                value={formData.failures >= 0 ? formData.failures.toString() : ""}
                onValueChange={(v) => updateField("failures", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.failures ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select number of failures" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num === 0 ? "None" : num === 4 ? "4 or more" : num.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.failures && (
                <p className="text-sm text-destructive">{errors.failures}</p>
              )}
            </div>

            {/* School Support */}
            <div className="space-y-2">
              <Label htmlFor="schoolsup">Extra Educational Support from School</Label>
              <Select
                value={formData.schoolsup}
                onValueChange={(v) => updateField("schoolsup", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.schoolsup ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.yesNo.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.schoolsup && (
                <p className="text-sm text-destructive">{errors.schoolsup}</p>
              )}
            </div>

            {/* Paid Classes */}
            <div className="space-y-2">
              <Label htmlFor="paid">Extra Paid Classes</Label>
              <Select
                value={formData.paid}
                onValueChange={(v) => updateField("paid", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.paid ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.yesNo.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paid && (
                <p className="text-sm text-destructive">{errors.paid}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {/* Activities */}
            <div className="space-y-2">
              <Label htmlFor="activities">Extra-curricular Activities</Label>
              <Select
                value={formData.activities}
                onValueChange={(v) => updateField("activities", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.activities ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.yesNo.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.activities && (
                <p className="text-sm text-destructive">{errors.activities}</p>
              )}
            </div>

            {/* Nursery */}
            <div className="space-y-2">
              <Label htmlFor="nursery">Attended Nursery School</Label>
              <Select
                value={formData.nursery}
                onValueChange={(v) => updateField("nursery", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.nursery ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.yesNo.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nursery && (
                <p className="text-sm text-destructive">{errors.nursery}</p>
              )}
            </div>

            {/* Higher Education */}
            <div className="space-y-2">
              <Label htmlFor="higher">Wants to Take Higher Education</Label>
              <Select
                value={formData.higher}
                onValueChange={(v) => updateField("higher", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.higher ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.yesNo.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.higher && (
                <p className="text-sm text-destructive">{errors.higher}</p>
              )}
            </div>

            {/* Internet */}
            <div className="space-y-2">
              <Label htmlFor="internet">Internet Access at Home</Label>
              <Select
                value={formData.internet}
                onValueChange={(v) => updateField("internet", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.internet ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.yesNo.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.internet && (
                <p className="text-sm text-destructive">{errors.internet}</p>
              )}
            </div>

            {/* Romantic */}
            <div className="space-y-2">
              <Label htmlFor="romantic">In a Romantic Relationship</Label>
              <Select
                value={formData.romantic}
                onValueChange={(v) => updateField("romantic", v)}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.romantic ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.yesNo.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.romantic && (
                <p className="text-sm text-destructive">{errors.romantic}</p>
              )}
            </div>

            {/* Free Time */}
            <div className="space-y-2">
              <Label htmlFor="freetime">Free Time After School</Label>
              <Select
                value={formData.freetime >= 0 ? formData.freetime.toString() : ""}
                onValueChange={(v) => updateField("freetime", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.freetime ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select amount (0-5)" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.scale0to5.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.freetime && (
                <p className="text-sm text-destructive">{errors.freetime}</p>
              )}
            </div>

            {/* Going Out */}
            <div className="space-y-2">
              <Label htmlFor="goout">Going Out with Friends</Label>
              <Select
                value={formData.goout > 0 ? formData.goout.toString() : ""}
                onValueChange={(v) => updateField("goout", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.goout ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select frequency (1-5)" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.scale1to5.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.goout && (
                <p className="text-sm text-destructive">{errors.goout}</p>
              )}
            </div>

            {/* Workday Alcohol */}
            <div className="space-y-2">
              <Label htmlFor="dalc">Workday Alcohol Consumption</Label>
              <Select
                value={formData.dalc >= 0 ? formData.dalc.toString() : ""}
                onValueChange={(v) => updateField("dalc", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.dalc ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select level (0-5)" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.scale0to5.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dalc && (
                <p className="text-sm text-destructive">{errors.dalc}</p>
              )}
            </div>

            {/* Weekend Alcohol */}
            <div className="space-y-2">
              <Label htmlFor="walc">Weekend Alcohol Consumption</Label>
              <Select
                value={formData.walc >= 0 ? formData.walc.toString() : ""}
                onValueChange={(v) => updateField("walc", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.walc ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select level (0-5)" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.scale0to5.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.walc && (
                <p className="text-sm text-destructive">{errors.walc}</p>
              )}
            </div>

            {/* Health */}
            <div className="space-y-2">
              <Label htmlFor="health">Current Health Status</Label>
              <Select
                value={formData.health >= 0 ? formData.health.toString() : ""}
                onValueChange={(v) => updateField("health", parseInt(v))}
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.health ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select status (0-5)" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.scale0to5.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.health && (
                <p className="text-sm text-destructive">{errors.health}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {/* Absences */}
            <div className="space-y-2">
              <Label htmlFor="absences">Number of School Absences</Label>
              <Input
                id="absences"
                type="number"
                min={0}
                max={93}
                value={Number.isNaN(formData.absences) ? "" : formData.absences}
                onChange={(e) => {
                  const val = e.target.value;
                  updateField(
                    "absences",
                    val === "" ? Number.NaN : parseInt(val)
                  );
                }}
                className={`rounded-xl ${errors.absences ? "border-destructive" : ""}`}
              />
              {errors.absences && (
                <p className="text-sm text-destructive">{errors.absences}</p>
              )}
            </div>

            {/* G1 */}
            <div className="space-y-2">
              <Label htmlFor="G1">Term 1 Marks (G1) - Out of 100</Label>
              <Input
                id="G1"
                type="number"
                min={0}
                max={100}
                value={Number.isNaN(formData.G1) ? "" : formData.G1}
                onChange={(e) => {
                  const val = e.target.value;
                  updateField("G1", val === "" ? Number.NaN : parseInt(val));
                }}
                className={`rounded-xl ${errors.G1 ? "border-destructive" : ""}`}
              />
              {errors.G1 && (
                <p className="text-sm text-destructive">{errors.G1}</p>
              )}
            </div>

            {/* G2 */}
            <div className="space-y-2">
              <Label htmlFor="G2">Term 2 Marks (G2) - Out of 100</Label>
              <Input
                id="G2"
                type="number"
                min={0}
                max={100}
                value={Number.isNaN(formData.G2) ? "" : formData.G2}
                onChange={(e) => {
                  const val = e.target.value;
                  updateField("G2", val === "" ? Number.NaN : parseInt(val));
                }}
                className={`rounded-xl ${errors.G2 ? "border-destructive" : ""}`}
              />
              {errors.G2 && (
                <p className="text-sm text-destructive">{errors.G2}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const StepIcon = stepIcons[currentStep];

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
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {stepTitles.map((title, index) => {
                const Icon = stepIcons[index];
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div key={title} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                          isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : isActive
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={`mt-2 hidden text-xs sm:block ${
                          isActive ? "font-medium text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {title}
                      </span>
                    </div>
                    {index < stepTitles.length - 1 && (
                      <div
                        className={`mx-2 h-0.5 flex-1 ${
                          index < currentStep ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-lg sm:p-8"
          >
            {/* Step Header */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <StepIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                  {stepTitles[currentStep]}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {stepDescriptions[currentStep]}
                </p>
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      Get Prediction
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
