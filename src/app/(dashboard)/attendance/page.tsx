"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Users,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitials } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Mock data
const attendanceData = [
  {
    id: "1",
    employee: { name: "Rajesh Kumar", code: "EMP001", department: "Housekeeping" },
    shift: "General",
    checkIn: "09:02",
    checkOut: "18:15",
    workHours: 8.5,
    status: "present",
  },
  {
    id: "2",
    employee: { name: "Priya Sharma", code: "EMP002", department: "Front Desk" },
    shift: "Morning",
    checkIn: "06:05",
    checkOut: "14:10",
    workHours: 8.1,
    status: "present",
  },
  {
    id: "3",
    employee: { name: "Amit Singh", code: "EMP003", department: "Technical" },
    shift: "General",
    checkIn: "09:45",
    checkOut: null,
    workHours: null,
    status: "late",
  },
  {
    id: "4",
    employee: { name: "Neha Patel", code: "EMP004", department: "Housekeeping" },
    shift: "Morning",
    checkIn: null,
    checkOut: null,
    workHours: null,
    status: "absent",
  },
  {
    id: "5",
    employee: { name: "Suresh Reddy", code: "EMP005", department: "Security" },
    shift: "Night",
    checkIn: null,
    checkOut: null,
    workHours: null,
    status: "leave",
  },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  present: { label: "Present", variant: "success" },
  late: { label: "Late", variant: "warning" },
  absent: { label: "Absent", variant: "destructive" },
  leave: { label: "Leave", variant: "secondary" },
  "half-day": { label: "Half Day", variant: "outline" },
};

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const stats = {
    total: 156,
    present: 140,
    absent: 8,
    leave: 5,
    late: 3,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track and manage employee attendance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            const headers = ["Employee", "Code", "Department", "Shift", "Check In", "Check Out", "Work Hours", "Status"];
            const csvData = attendanceData.map(att => [
              att.employee.name,
              att.employee.code,
              att.employee.department,
              att.shift,
              att.checkIn || "-",
              att.checkOut || "-",
              att.workHours ? `${att.workHours}h` : "-",
              att.status
            ]);

            const csvContent = [
              headers.join(","),
              ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `attendance_${selectedDate}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/attendance/mark">
              <UserCheck className="mr-2 h-4 w-4" />
              Mark Attendance
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
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-2xl font-bold text-blue-600">{stats.leave}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[180px]"
              />
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="housekeeping">Housekeeping</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="front-desk">Front Desk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Attendance Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Work Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((att) => (
                    <TableRow key={att.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(att.employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{att.employee.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {att.employee.code}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{att.employee.department}</TableCell>
                      <TableCell>{att.shift}</TableCell>
                      <TableCell>
                        {att.checkIn ? (
                          <span className="font-mono">{att.checkIn}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {att.checkOut ? (
                          <span className="font-mono">{att.checkOut}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {att.workHours ? (
                          <span>{att.workHours}h</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[att.status].variant}>
                          {statusConfig[att.status].label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roster" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">Week of Jan 15 - Jan 21, 2024</span>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button asChild>
              <Link href="/attendance/roster">
                <Calendar className="mr-2 h-4 w-4" />
                Edit Roster
              </Link>
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-center">Mon</TableHead>
                    <TableHead className="text-center">Tue</TableHead>
                    <TableHead className="text-center">Wed</TableHead>
                    <TableHead className="text-center">Thu</TableHead>
                    <TableHead className="text-center">Fri</TableHead>
                    <TableHead className="text-center">Sat</TableHead>
                    <TableHead className="text-center">Sun</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Rajesh Kumar", code: "EMP001", shifts: ["G", "G", "G", "G", "G", "M", "OFF"] },
                    { name: "Priya Sharma", code: "EMP002", shifts: ["M", "M", "M", "M", "M", "OFF", "OFF"] },
                    { name: "Amit Singh", code: "EMP003", shifts: ["G", "G", "G", "G", "G", "G", "OFF"] },
                    { name: "Neha Patel", code: "EMP004", shifts: ["M", "M", "OFF", "M", "M", "M", "OFF"] },
                    { name: "Suresh Reddy", code: "EMP005", shifts: ["N", "N", "N", "N", "N", "OFF", "OFF"] },
                  ].map((emp) => (
                    <TableRow key={emp.code}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(emp.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      {emp.shifts.map((shift, idx) => (
                        <TableCell key={idx} className="text-center">
                          <Badge
                            variant={
                              shift === "G" ? "default" :
                              shift === "M" ? "success" :
                              shift === "N" ? "secondary" :
                              "outline"
                            }
                            className="w-10"
                          >
                            {shift}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge>G</Badge>
              <span>General (9AM-6PM)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">M</Badge>
              <span>Morning (6AM-2PM)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">N</Badge>
              <span>Night (10PM-6AM)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">OFF</Badge>
              <span>Day Off</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaves">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">SR</AvatarFallback>
                        </Avatar>
                        <span>Suresh Reddy</span>
                      </div>
                    </TableCell>
                    <TableCell>Casual Leave</TableCell>
                    <TableCell>Jan 16, 2024</TableCell>
                    <TableCell>Jan 17, 2024</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>Personal work</TableCell>
                    <TableCell>
                      <Badge variant="warning">Pending</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          toast({
                            title: "Leave Approved",
                            description: "Leave request has been approved successfully",
                          });
                        }}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          toast({
                            title: "Leave Rejected",
                            description: "Leave request has been rejected",
                            variant: "destructive",
                          });
                        }}>
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
