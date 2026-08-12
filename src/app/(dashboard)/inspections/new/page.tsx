"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const inspectionSchema = z.object({
  area: z.string().min(1, "Please select an area"),
  template: z.string().min(1, "Please select a template"),
  inspector: z.string().min(1, "Please select an inspector"),
  date: z.string().min(1, "Please select date"),
  time: z.string().min(1, "Please select time"),
  notes: z.string().optional(),
});

type InspectionInput = z.infer<typeof inspectionSchema>;

const areas = [
  { id: "1", name: "Main Lobby" },
  { id: "2", name: "Conference Room A" },
  { id: "3", name: "Conference Room B" },
  { id: "4", name: "Restroom - Floor 1" },
  { id: "5", name: "Restroom - Floor 2" },
  { id: "6", name: "Pantry Area" },
  { id: "7", name: "Office Space - Floor 1" },
  { id: "8", name: "Reception Area" },
];

const templates = [
  { id: "1", name: "Daily Inspection", items: 10 },
  { id: "2", name: "Hourly Check", items: 5 },
  { id: "3", name: "Deep Clean Verification", items: 15 },
  { id: "4", name: "Restroom Inspection", items: 8 },
  { id: "5", name: "Kitchen/Pantry Audit", items: 12 },
];

const inspectors = [
  { id: "1", name: "Priya Sharma" },
  { id: "2", name: "Rajesh Kumar" },
  { id: "3", name: "Amit Singh" },
  { id: "4", name: "Neha Patel" },
];

const inspectionCriteria = [
  { id: "1", name: "Cleanliness", description: "Overall cleanliness of the area" },
  { id: "2", name: "Odor", description: "No unpleasant smell" },
  { id: "3", name: "Dust Level", description: "Surfaces free from dust" },
  { id: "4", name: "Floor Condition", description: "Floor clean and dry" },
  { id: "5", name: "Waste Disposal", description: "Bins emptied and clean" },
  { id: "6", name: "Supplies", description: "Adequate supplies available" },
  { id: "7", name: "Equipment", description: "Equipment properly stored" },
  { id: "8", name: "Safety", description: "No safety hazards present" },
];

export default function NewInspectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(inspectionCriteria.map((c) => [c.id, 80]))
  );
  const [issues, setIssues] = useState<Array<{ area: string; description: string }>>([]);
  const [newIssue, setNewIssue] = useState({ area: "", description: "" });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InspectionInput>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
    },
  });

  const averageScore = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
  );

  const onSubmit = async (data: InspectionInput) => {
    setIsLoading(true);
    try {
      // API call would go here
      console.log("Creating inspection:", { ...data, scores, issues });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Inspection completed",
        description: `Inspection recorded with score: ${averageScore}%`,
      });

      router.push("/inspections");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save inspection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addIssue = () => {
    if (newIssue.area && newIssue.description) {
      setIssues([...issues, newIssue]);
      setNewIssue({ area: "", description: "" });
    }
  };

  const removeIssue = (index: number) => {
    setIssues(issues.filter((_, i) => i !== index));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Satisfactory";
    if (score >= 60) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/inspections">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New Inspection</h1>
            <p className="text-muted-foreground">
              Conduct a quality inspection
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Overall Score</p>
          <p className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
            {averageScore}%
          </p>
          <Badge
            variant={
              averageScore >= 90
                ? "success"
                : averageScore >= 70
                ? "warning"
                : "destructive"
            }
          >
            {getScoreLabel(averageScore)}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Inspection Details */}
        <Card>
          <CardHeader>
            <CardTitle>Inspection Details</CardTitle>
            <CardDescription>
              Select the area and template for inspection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="area">Area *</Label>
                <Select onValueChange={(value) => setValue("area", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.area && (
                  <p className="text-sm text-destructive">{errors.area.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Inspection Template *</Label>
                <Select onValueChange={(value) => setValue("template", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.items} items)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.template && (
                  <p className="text-sm text-destructive">{errors.template.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="inspector">Inspector *</Label>
                <Select onValueChange={(value) => setValue("inspector", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inspector" />
                  </SelectTrigger>
                  <SelectContent>
                    {inspectors.map((inspector) => (
                      <SelectItem key={inspector.id} value={inspector.id}>
                        {inspector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.inspector && (
                  <p className="text-sm text-destructive">{errors.inspector.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  {...register("time")}
                />
                {errors.time && (
                  <p className="text-sm text-destructive">{errors.time.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scoring */}
        <Card>
          <CardHeader>
            <CardTitle>Inspection Scores</CardTitle>
            <CardDescription>
              Rate each criterion from 0 to 100
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {inspectionCriteria.map((criterion) => (
              <div key={criterion.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{criterion.name}</Label>
                    <p className="text-sm text-muted-foreground">
                      {criterion.description}
                    </p>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(scores[criterion.id])}`}>
                    {scores[criterion.id]}%
                  </span>
                </div>
                <Slider
                  value={[scores[criterion.id]]}
                  onValueChange={([value]) =>
                    setScores({ ...scores, [criterion.id]: value })
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Issues Found */}
        <Card>
          <CardHeader>
            <CardTitle>Issues Found</CardTitle>
            <CardDescription>
              Record any issues that need attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Issue location"
                  value={newIssue.area}
                  onChange={(e) => setNewIssue({ ...newIssue, area: e.target.value })}
                />
              </div>
              <div className="flex-[2]">
                <Input
                  placeholder="Issue description"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                />
              </div>
              <Button type="button" onClick={addIssue} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {issues.length > 0 && (
              <div className="space-y-2">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{issue.area}</p>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIssue(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {issues.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No issues recorded
              </p>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter any additional observations or comments..."
              {...register("notes")}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/inspections">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Inspection"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
