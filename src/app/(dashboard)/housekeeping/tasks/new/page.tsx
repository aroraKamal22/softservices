"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const taskSchema = z.object({
  title: z.string().min(2, "Task title must be at least 2 characters"),
  description: z.string().optional(),
  area: z.string().min(1, "Please select an area"),
  taskType: z.string().min(1, "Please select task type"),
  priority: z.string().min(1, "Please select priority"),
  assignee: z.string().min(1, "Please select assignee"),
  scheduledDate: z.string().min(1, "Please select date"),
  scheduledTime: z.string().min(1, "Please select time"),
  estimatedDuration: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),
});

type TaskInput = z.infer<typeof taskSchema>;

const areas = [
  { id: "1", name: "Main Lobby" },
  { id: "2", name: "Conference Room A" },
  { id: "3", name: "Conference Room B" },
  { id: "4", name: "Restroom - Floor 1" },
  { id: "5", name: "Restroom - Floor 2" },
  { id: "6", name: "Pantry Area" },
  { id: "7", name: "Parking Area" },
  { id: "8", name: "Office Space - Floor 1" },
  { id: "9", name: "Office Space - Floor 2" },
  { id: "10", name: "Reception Area" },
];

const taskTypes = [
  "General Cleaning",
  "Deep Cleaning",
  "Routine Cleaning",
  "Floor Mopping",
  "Dusting",
  "Glass Cleaning",
  "Sanitization",
  "Waste Disposal",
  "Kitchen Cleaning",
  "Carpet Cleaning",
];

const employees = [
  { id: "1", name: "Rajesh Kumar" },
  { id: "2", name: "Priya Sharma" },
  { id: "3", name: "Amit Singh" },
  { id: "4", name: "Neha Patel" },
  { id: "5", name: "Suresh Reddy" },
];

const checklistItems = [
  "Floor swept and mopped",
  "Dust removed from surfaces",
  "Glass cleaned",
  "Trash emptied",
  "Sanitizer applied",
  "Air freshener used",
  "Supplies restocked",
  "Equipment stored properly",
];

export default function NewHousekeepingTaskPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      isRecurring: false,
      scheduledDate: new Date().toISOString().split("T")[0],
      priority: "medium",
    },
  });

  const isRecurring = watch("isRecurring");

  const onSubmit = async (data: TaskInput) => {
    setIsLoading(true);
    try {
      // API call would go here
      console.log("Creating task:", { ...data, checklist: selectedChecklist });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Task created",
        description: "The housekeeping task has been created successfully.",
      });

      router.push("/housekeeping");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChecklistItem = (item: string) => {
    setSelectedChecklist((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/housekeeping">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Housekeeping Task</h1>
          <p className="text-muted-foreground">
            Create a new cleaning task
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Task Details */}
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              Enter the details of the cleaning task
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Morning Lobby Cleaning"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description and special instructions..."
                {...register("description")}
              />
            </div>

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
                <Label htmlFor="taskType">Task Type *</Label>
                <Select onValueChange={(value) => setValue("taskType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.taskType && (
                  <p className="text-sm text-destructive">{errors.taskType.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  defaultValue="medium"
                  onValueChange={(value) => setValue("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-sm text-destructive">{errors.priority.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Assign To *</Label>
                <Select onValueChange={(value) => setValue("assignee", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignee && (
                  <p className="text-sm text-destructive">{errors.assignee.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>
              When should this task be performed?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  {...register("scheduledDate")}
                />
                {errors.scheduledDate && (
                  <p className="text-sm text-destructive">{errors.scheduledDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Time *</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  {...register("scheduledTime")}
                />
                {errors.scheduledTime && (
                  <p className="text-sm text-destructive">{errors.scheduledTime.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                <Select onValueChange={(value) => setValue("estimatedDuration", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5">
                <Label>Recurring Task</Label>
                <p className="text-sm text-muted-foreground">
                  Repeat this task automatically
                </p>
              </div>
              <Switch
                checked={isRecurring}
                onCheckedChange={(checked) => setValue("isRecurring", checked)}
              />
            </div>

            {isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="recurringPattern">Repeat Pattern</Label>
                <Select onValueChange={(value) => setValue("recurringPattern", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekdays">Weekdays Only</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Checklist</CardTitle>
            <CardDescription>
              Select items to include in the task checklist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {checklistItems.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={item}
                    checked={selectedChecklist.includes(item)}
                    onCheckedChange={() => toggleChecklistItem(item)}
                  />
                  <label
                    htmlFor={item}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/housekeeping">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
