"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  Repeat,
  Edit,
  Trash2,
  MoreHorizontal,
  Play,
  Pause,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const schedules = [
  {
    id: "1",
    name: "Morning Lobby Cleaning",
    area: "Main Lobby",
    taskType: "General Cleaning",
    frequency: "Daily",
    time: "06:00",
    duration: "30 min",
    assignee: "Rajesh Kumar",
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "2",
    name: "Restroom Hourly Check",
    area: "All Restrooms",
    taskType: "Routine Cleaning",
    frequency: "Hourly",
    time: "Every Hour",
    duration: "15 min",
    assignee: "Priya Sharma",
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    id: "3",
    name: "Conference Room Prep",
    area: "Conference Rooms",
    taskType: "General Cleaning",
    frequency: "Daily",
    time: "08:00",
    duration: "20 min",
    assignee: "Amit Singh",
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: "4",
    name: "Pantry Deep Clean",
    area: "Pantry Area",
    taskType: "Deep Cleaning",
    frequency: "Weekly",
    time: "14:00",
    duration: "60 min",
    assignee: "Neha Patel",
    isActive: true,
    days: ["Sat"],
  },
  {
    id: "5",
    name: "Parking Area Sweep",
    area: "Parking",
    taskType: "Floor Sweeping",
    frequency: "Daily",
    time: "07:00",
    duration: "45 min",
    assignee: "Suresh Reddy",
    isActive: false,
    days: ["Mon", "Wed", "Fri"],
  },
  {
    id: "6",
    name: "Night Floor Mopping",
    area: "All Floors",
    taskType: "Floor Mopping",
    frequency: "Daily",
    time: "22:00",
    duration: "90 min",
    assignee: "Night Shift Team",
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
];

const areas = [
  "Main Lobby",
  "Conference Rooms",
  "All Restrooms",
  "Pantry Area",
  "Parking",
  "All Floors",
  "Office Space",
];

const taskTypes = [
  "General Cleaning",
  "Deep Cleaning",
  "Routine Cleaning",
  "Floor Mopping",
  "Floor Sweeping",
  "Sanitization",
];

const frequencies = ["Hourly", "Daily", "Weekly", "Bi-weekly", "Monthly"];

const employees = [
  "Rajesh Kumar",
  "Priya Sharma",
  "Amit Singh",
  "Neha Patel",
  "Suresh Reddy",
  "Night Shift Team",
];

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SchedulesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [scheduleList, setScheduleList] = useState(schedules);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    area: "",
    taskType: "",
    frequency: "",
    time: "",
    duration: "",
    assignee: "",
    days: [] as string[],
  });

  const toggleSchedule = (id: string) => {
    setScheduleList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    const schedule = scheduleList.find((s) => s.id === id);
    toast({
      title: schedule?.isActive ? "Schedule paused" : "Schedule activated",
      description: `${schedule?.name} has been ${schedule?.isActive ? "paused" : "activated"}`,
    });
  };

  const deleteSchedule = (id: string) => {
    const schedule = scheduleList.find((s) => s.id === id);
    setScheduleList((prev) => prev.filter((s) => s.id !== id));
    toast({
      title: "Schedule deleted",
      description: `${schedule?.name} has been deleted`,
    });
  };

  const addSchedule = () => {
    if (!newSchedule.name || !newSchedule.area || !newSchedule.taskType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const schedule = {
      id: Date.now().toString(),
      ...newSchedule,
      isActive: true,
    };

    setScheduleList((prev) => [...prev, schedule]);
    toast({
      title: "Schedule created",
      description: `${newSchedule.name} has been created successfully`,
    });
    setIsAddDialogOpen(false);
    setNewSchedule({
      name: "",
      area: "",
      taskType: "",
      frequency: "",
      time: "",
      duration: "",
      assignee: "",
      days: [],
    });
  };

  const toggleDay = (day: string) => {
    setNewSchedule((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const activeCount = scheduleList.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/housekeeping">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cleaning Schedules</h1>
            <p className="text-muted-foreground">
              Manage recurring cleaning schedules
            </p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Schedule</DialogTitle>
              <DialogDescription>
                Set up a recurring cleaning schedule
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Schedule Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Lobby Cleaning"
                  value={newSchedule.name}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, name: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label>Area *</Label>
                  <Select
                    value={newSchedule.area}
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, area: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Task Type *</Label>
                  <Select
                    value={newSchedule.taskType}
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, taskType: value })
                    }
                  >
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
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={newSchedule.frequency}
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, frequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select
                    value={newSchedule.duration}
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, duration: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15 min">15 minutes</SelectItem>
                      <SelectItem value="30 min">30 minutes</SelectItem>
                      <SelectItem value="45 min">45 minutes</SelectItem>
                      <SelectItem value="60 min">1 hour</SelectItem>
                      <SelectItem value="90 min">1.5 hours</SelectItem>
                      <SelectItem value="120 min">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <Select
                    value={newSchedule.assignee}
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, assignee: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp} value={emp}>
                          {emp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Active Days</Label>
                <div className="flex flex-wrap gap-2">
                  {allDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={newSchedule.days.includes(day)}
                        onCheckedChange={() => toggleDay(day)}
                      />
                      <label htmlFor={day} className="text-sm">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addSchedule}>Create Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Schedules</p>
                <p className="text-2xl font-bold">{scheduleList.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paused</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {scheduleList.length - activeCount}
                </p>
              </div>
              <Pause className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Tasks</p>
                <p className="text-2xl font-bold">
                  {scheduleList.filter((s) => s.frequency === "Daily" && s.isActive).length}
                </p>
              </div>
              <Repeat className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Schedules</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Schedule</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleList.map((schedule) => (
                <TableRow key={schedule.id} className={!schedule.isActive ? "opacity-50" : ""}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{schedule.name}</p>
                      <p className="text-xs text-muted-foreground">{schedule.taskType}</p>
                    </div>
                  </TableCell>
                  <TableCell>{schedule.area}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Repeat className="mr-1 h-3 w-3" />
                      {schedule.frequency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{schedule.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{schedule.duration}</span>
                  </TableCell>
                  <TableCell>{schedule.assignee}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {schedule.days.map((day) => (
                        <Badge key={day} variant="secondary" className="text-xs px-1">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={schedule.isActive}
                      onCheckedChange={() => toggleSchedule(schedule.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteSchedule(schedule.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
