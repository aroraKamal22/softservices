"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brush,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitials } from "@/lib/utils";

// Mock data
const tasks = [
  {
    id: "1",
    area: "Main Lobby",
    task: "General Cleaning",
    assignee: "Rajesh Kumar",
    scheduledTime: "09:00",
    status: "completed",
    completedTime: "09:15",
  },
  {
    id: "2",
    area: "Conference Room A",
    task: "Deep Cleaning",
    assignee: "Priya Sharma",
    scheduledTime: "10:00",
    status: "in-progress",
    completedTime: null,
  },
  {
    id: "3",
    area: "Restroom - Floor 1",
    task: "Routine Cleaning",
    assignee: "Amit Singh",
    scheduledTime: "11:00",
    status: "pending",
    completedTime: null,
  },
  {
    id: "4",
    area: "Pantry Area",
    task: "Kitchen Cleaning",
    assignee: "Neha Patel",
    scheduledTime: "08:00",
    status: "missed",
    completedTime: null,
  },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  completed: { label: "Completed", variant: "success" },
  "in-progress": { label: "In Progress", variant: "default" },
  pending: { label: "Pending", variant: "warning" },
  missed: { label: "Missed", variant: "destructive" },
};

export default function HousekeepingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const stats = {
    total: 48,
    completed: 32,
    inProgress: 8,
    pending: 6,
    missed: 2,
  };

  const completionRate = Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Housekeeping</h1>
          <p className="text-muted-foreground">
            Manage cleaning schedules and tasks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/housekeeping/schedules">
              <Calendar className="mr-2 h-4 w-4" />
              Schedules
            </Link>
          </Button>
          <Button asChild>
            <Link href="/housekeeping/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Brush className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Missed</p>
                <p className="text-2xl font-bold text-red-600">{stats.missed}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Today's Completion Rate</span>
            <span className="text-2xl font-bold">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Today's Tasks</TabsTrigger>
          <TabsTrigger value="areas">By Area</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="lobby">Lobby</SelectItem>
                <SelectItem value="restroom">Restrooms</SelectItem>
                <SelectItem value="conference">Conference Rooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tasks Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.area}</TableCell>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(task.assignee)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.assignee}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{task.scheduledTime}</TableCell>
                      <TableCell className="font-mono">
                        {task.completedTime || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[task.status].variant}>
                          {statusConfig[task.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { area: "Main Lobby", total: 8, completed: 6, inProgress: 1, pending: 1 },
              { area: "Conference Rooms", total: 6, completed: 4, inProgress: 2, pending: 0 },
              { area: "Restrooms", total: 12, completed: 10, inProgress: 1, pending: 1 },
              { area: "Pantry Area", total: 4, completed: 2, inProgress: 1, pending: 1 },
              { area: "Office Space", total: 10, completed: 8, inProgress: 1, pending: 1 },
              { area: "Parking", total: 2, completed: 2, inProgress: 0, pending: 0 },
            ].map((areaData) => (
              <Card key={areaData.area}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{areaData.area}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {Math.round((areaData.completed / areaData.total) * 100)}%
                      </span>
                    </div>
                    <Progress value={(areaData.completed / areaData.total) * 100} className="h-2" />
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded bg-green-100 dark:bg-green-900">
                        <p className="font-bold text-green-600">{areaData.completed}</p>
                        <p className="text-muted-foreground">Done</p>
                      </div>
                      <div className="p-2 rounded bg-blue-100 dark:bg-blue-900">
                        <p className="font-bold text-blue-600">{areaData.inProgress}</p>
                        <p className="text-muted-foreground">Active</p>
                      </div>
                      <div className="p-2 rounded bg-yellow-100 dark:bg-yellow-900">
                        <p className="font-bold text-yellow-600">{areaData.pending}</p>
                        <p className="text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checklists" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Checklist
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "Daily General Cleaning", items: 12, areas: ["Lobby", "Office Space", "Conference Rooms"] },
              { name: "Restroom Cleaning", items: 8, areas: ["All Restrooms"] },
              { name: "Deep Cleaning", items: 18, areas: ["All Areas"] },
              { name: "Pantry Cleaning", items: 10, areas: ["Pantry", "Kitchen"] },
              { name: "Night Shift Tasks", items: 6, areas: ["Lobby", "Parking"] },
              { name: "Weekly Floor Polish", items: 5, areas: ["Lobby", "Conference Rooms"] },
            ].map((checklist) => (
              <Card key={checklist.name}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{checklist.name}</CardTitle>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{checklist.items} items</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {checklist.areas.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Assign
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
