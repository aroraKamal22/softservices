"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  QrCode,
  Fingerprint,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

// Mock data
const employees = [
  { id: "1", name: "Rajesh Kumar", code: "EMP001", department: "Housekeeping", shift: "General", status: null },
  { id: "2", name: "Priya Sharma", code: "EMP002", department: "Front Desk", shift: "Morning", status: null },
  { id: "3", name: "Amit Singh", code: "EMP003", department: "Technical", shift: "General", status: null },
  { id: "4", name: "Neha Patel", code: "EMP004", department: "Housekeeping", shift: "Morning", status: null },
  { id: "5", name: "Suresh Reddy", code: "EMP005", department: "Security", shift: "Night", status: null },
  { id: "6", name: "Kavita Joshi", code: "EMP006", department: "Administration", shift: "General", status: null },
];

type AttendanceStatus = "present" | "absent" | "late" | "half-day" | "leave" | null;

interface EmployeeAttendance {
  id: string;
  name: string;
  code: string;
  department: string;
  shift: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
}

export default function MarkAttendancePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  const [attendanceData, setAttendanceData] = useState<EmployeeAttendance[]>(
    employees.map((emp) => ({ ...emp, status: null }))
  );

  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const markAttendance = (employeeId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              status,
              checkIn: status === "present" || status === "late" ? currentTime : undefined,
            }
          : emp
      )
    );
    toast({
      title: "Attendance marked",
      description: `Attendance marked as ${status}`,
    });
  };

  const markAllPresent = () => {
    setAttendanceData((prev) =>
      prev.map((emp) => ({
        ...emp,
        status: "present" as AttendanceStatus,
        checkIn: currentTime,
      }))
    );
    toast({
      title: "All marked present",
      description: "All employees marked as present",
    });
  };

  const saveAttendance = () => {
    const unmarked = attendanceData.filter((emp) => emp.status === null);
    if (unmarked.length > 0) {
      toast({
        title: "Warning",
        description: `${unmarked.length} employees have unmarked attendance`,
        variant: "destructive",
      });
      return;
    }

    // API call would go here
    console.log("Saving attendance:", attendanceData);
    toast({
      title: "Attendance saved",
      description: "Today's attendance has been saved successfully",
    });
    router.push("/attendance");
  };

  const filteredEmployees = attendanceData.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDepartment === "all" || emp.department === selectedDepartment;
    const matchesShift =
      selectedShift === "all" || emp.shift === selectedShift;
    return matchesSearch && matchesDept && matchesShift;
  });

  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter((e) => e.status === "present").length,
    absent: attendanceData.filter((e) => e.status === "absent").length,
    late: attendanceData.filter((e) => e.status === "late").length,
    unmarked: attendanceData.filter((e) => e.status === null).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/attendance">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mark Attendance</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllPresent}>
            <UserCheck className="mr-2 h-4 w-4" />
            Mark All Present
          </Button>
          <Button onClick={saveAttendance}>
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Unmarked</p>
              <p className="text-2xl font-bold text-gray-600">{stats.unmarked}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="manual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manual">
            <UserCheck className="mr-2 h-4 w-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="qr">
            <QrCode className="mr-2 h-4 w-4" />
            QR Scan
          </TabsTrigger>
          <TabsTrigger value="biometric">
            <Fingerprint className="mr-2 h-4 w-4" />
            Biometric
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or code..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Front Desk">Front Desk</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
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
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {employee.code}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.shift}</TableCell>
                      <TableCell>
                        {employee.checkIn ? (
                          <span className="font-mono">{employee.checkIn}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.status ? (
                          <Badge
                            variant={
                              employee.status === "present"
                                ? "success"
                                : employee.status === "absent"
                                ? "destructive"
                                : employee.status === "late"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {employee.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Unmarked</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant={employee.status === "present" ? "default" : "outline"}
                            onClick={() => markAttendance(employee.id, "present")}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={employee.status === "late" ? "default" : "outline"}
                            onClick={() => markAttendance(employee.id, "late")}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={employee.status === "absent" ? "destructive" : "outline"}
                            onClick={() => markAttendance(employee.id, "absent")}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={employee.status === "leave" ? "secondary" : "outline"}
                            onClick={() => markAttendance(employee.id, "leave")}
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Scanning</CardTitle>
              <CardDescription>
                Scan employee QR codes for attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <QrCode className="h-24 w-24 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Position the QR code in front of the camera to scan
              </p>
              <Button className="mt-4">
                <QrCode className="mr-2 h-4 w-4" />
                Start Scanning
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biometric">
          <Card>
            <CardHeader>
              <CardTitle>Biometric Attendance</CardTitle>
              <CardDescription>
                Use fingerprint or face recognition
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Fingerprint className="h-24 w-24 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Connect your biometric device to start recording attendance
              </p>
              <Button className="mt-4" variant="outline">
                <Fingerprint className="mr-2 h-4 w-4" />
                Connect Device
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
