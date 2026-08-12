"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Plus,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, formatDate } from "@/lib/utils";

// Mock data
const inspections = [
  {
    id: "1",
    area: "Main Lobby",
    template: "Daily Inspection",
    inspector: "Priya Sharma",
    date: "2024-01-15",
    score: 92,
    status: "passed",
  },
  {
    id: "2",
    area: "Conference Room A",
    template: "Daily Inspection",
    inspector: "Rajesh Kumar",
    date: "2024-01-15",
    score: 78,
    status: "requires-action",
  },
  {
    id: "3",
    area: "Restroom - Floor 1",
    template: "Hourly Check",
    inspector: "Amit Singh",
    date: "2024-01-15",
    score: 95,
    status: "passed",
  },
  {
    id: "4",
    area: "Pantry Area",
    template: "Daily Inspection",
    inspector: "Neha Patel",
    date: "2024-01-15",
    score: 65,
    status: "failed",
  },
];

const areaScores = [
  { area: "Lobby & Reception", score: 92, change: 3 },
  { area: "Restrooms", score: 88, change: -2 },
  { area: "Conference Rooms", score: 95, change: 5 },
  { area: "Pantry Areas", score: 78, change: -5 },
  { area: "Workstations", score: 85, change: 1 },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  passed: { label: "Passed", variant: "success" },
  "requires-action": { label: "Needs Action", variant: "warning" },
  failed: { label: "Failed", variant: "destructive" },
  pending: { label: "Pending", variant: "secondary" },
};

export default function InspectionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inspections</h1>
          <p className="text-muted-foreground">
            Quality inspections and scoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/inspections/templates">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Templates
            </Link>
          </Button>
          <Button asChild>
            <Link href="/inspections/new">
              <Plus className="mr-2 h-4 w-4" />
              New Inspection
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inspections Today</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold text-green-600">83%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Actions</p>
                <p className="text-2xl font-bold text-yellow-600">5</p>
              </div>
              <Badge variant="warning">Action</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Area-wise Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {areaScores.map((area) => (
              <div key={area.area} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{area.area}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        area.score >= 90
                          ? "text-green-600"
                          : area.score >= 70
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {area.score}%
                    </span>
                    <span
                      className={`text-xs flex items-center ${
                        area.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {area.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(area.change)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={area.score}
                  className={`h-2 ${
                    area.score >= 90
                      ? "[&>div]:bg-green-600"
                      : area.score >= 70
                      ? "[&>div]:bg-yellow-600"
                      : "[&>div]:bg-red-600"
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Inspections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Inspections</CardTitle>
          <Select defaultValue="today">
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">{inspection.area}</TableCell>
                  <TableCell>{inspection.template}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(inspection.inspector)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{inspection.inspector}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(inspection.date)}</TableCell>
                  <TableCell>
                    <span
                      className={`font-bold ${
                        inspection.score >= 90
                          ? "text-green-600"
                          : inspection.score >= 70
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {inspection.score}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[inspection.status].variant}>
                      {statusConfig[inspection.status].label}
                    </Badge>
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
