"use client";

import { useSession } from "next-auth/react";
import {
  Users,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div
            className={`flex items-center text-xs mt-1 ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp
              className={`h-3 w-3 mr-1 ${!trend.isPositive && "rotate-180"}`}
            />
            {trend.value}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Recent Complaints Component
function RecentComplaints() {
  const complaints = [
    {
      id: "TKT-001",
      title: "AC not working in Conference Room A",
      status: "in-progress",
      priority: "high",
      time: "2 hours ago",
    },
    {
      id: "TKT-002",
      title: "Water leakage in 3rd floor restroom",
      status: "open",
      priority: "critical",
      time: "4 hours ago",
    },
    {
      id: "TKT-003",
      title: "Lights flickering in Lobby",
      status: "assigned",
      priority: "medium",
      time: "5 hours ago",
    },
    {
      id: "TKT-004",
      title: "Elevator maintenance required",
      status: "resolved",
      priority: "high",
      time: "1 day ago",
    },
  ];

  const statusColors: Record<string, string> = {
    open: "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
    "in-progress": "bg-purple-100 text-purple-800",
    resolved: "bg-green-100 text-green-800",
  };

  const priorityColors: Record<string, string> = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Complaints
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {complaint.id}
                  </span>
                  <Badge
                    variant="outline"
                    className={priorityColors[complaint.priority]}
                  >
                    {complaint.priority}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{complaint.title}</p>
                <p className="text-xs text-muted-foreground">{complaint.time}</p>
              </div>
              <Badge
                variant="outline"
                className={statusColors[complaint.status]}
              >
                {complaint.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Today's Schedule Component
function TodaysSchedule() {
  const tasks = [
    { time: "08:00", task: "Morning Inspection - Building A", status: "completed" },
    { time: "09:30", task: "Deep Cleaning - Conference Rooms", status: "in-progress" },
    { time: "11:00", task: "AMC Visit - Fire Equipment", status: "pending" },
    { time: "14:00", task: "Training - New Staff Induction", status: "pending" },
    { time: "16:00", task: "Evening Inspection - All Floors", status: "pending" },
  ];

  const statusIcons: Record<string, React.ReactNode> = {
    completed: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    "in-progress": <Clock className="h-4 w-4 text-blue-600 animate-pulse" />,
    pending: <Clock className="h-4 w-4 text-gray-400" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today&apos;s Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
            >
              {statusIcons[item.status]}
              <div className="flex-1">
                <p className="text-sm font-medium">{item.task}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Inspection Score Component
function InspectionScore() {
  const areas = [
    { name: "Lobby & Reception", score: 92 },
    { name: "Restrooms", score: 88 },
    { name: "Conference Rooms", score: 95 },
    { name: "Pantry Areas", score: 78 },
    { name: "Workstations", score: 85 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          Inspection Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {areas.map((area) => (
            <div key={area.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{area.name}</span>
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
  );
}

// Alerts Component
function Alerts() {
  const alerts = [
    {
      type: "warning",
      message: "AMC for Fire Equipment expires in 7 days",
    },
    {
      type: "danger",
      message: "3 complaints breached SLA today",
    },
    {
      type: "info",
      message: "5 employees on leave tomorrow",
    },
    {
      type: "warning",
      message: "Low stock: Cleaning supplies",
    },
  ];

  const alertStyles: Record<string, string> = {
    warning: "border-yellow-500 bg-yellow-50 text-yellow-800",
    danger: "border-red-500 bg-red-50 text-red-800",
    info: "border-blue-500 bg-blue-50 text-blue-800",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-3 border-l-4 rounded-r-lg text-sm ${
                alertStyles[alert.type]
              }`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session?.user?.name?.split(" ")[0] || "User"}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening at your facility today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value="156"
          description="12 on leave today"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Present Today"
          value="144"
          description="92.3% attendance rate"
          icon={CheckCircle2}
        />
        <StatsCard
          title="Open Complaints"
          value="18"
          description="3 breached SLA"
          icon={MessageSquare}
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard
          title="Inspection Score"
          value="87%"
          description="Average across all areas"
          icon={ClipboardCheck}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentComplaints />
        <TodaysSchedule />
        <InspectionScore />
        <Alerts />
      </div>
    </div>
  );
}
