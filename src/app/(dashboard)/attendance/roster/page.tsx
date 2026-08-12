"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Save,
  RotateCcw,
  Copy,
  Users,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

const shifts = [
  { id: "G", name: "General", time: "9AM-6PM", color: "default" },
  { id: "M", name: "Morning", time: "6AM-2PM", color: "success" },
  { id: "E", name: "Evening", time: "2PM-10PM", color: "warning" },
  { id: "N", name: "Night", time: "10PM-6AM", color: "secondary" },
  { id: "OFF", name: "Day Off", time: "-", color: "outline" },
];

const initialEmployees = [
  { id: "1", name: "Rajesh Kumar", code: "EMP001", department: "Housekeeping", shifts: ["G", "G", "G", "G", "G", "M", "OFF"] },
  { id: "2", name: "Priya Sharma", code: "EMP002", department: "Front Desk", shifts: ["M", "M", "M", "M", "M", "OFF", "OFF"] },
  { id: "3", name: "Amit Singh", code: "EMP003", department: "Technical", shifts: ["G", "G", "G", "G", "G", "G", "OFF"] },
  { id: "4", name: "Neha Patel", code: "EMP004", department: "Housekeeping", shifts: ["M", "M", "OFF", "M", "M", "M", "OFF"] },
  { id: "5", name: "Suresh Reddy", code: "EMP005", department: "Security", shifts: ["N", "N", "N", "N", "N", "OFF", "OFF"] },
  { id: "6", name: "Kavita Joshi", code: "EMP006", department: "Administration", shifts: ["G", "G", "G", "G", "G", "OFF", "OFF"] },
  { id: "7", name: "Mohan Das", code: "EMP007", department: "Security", shifts: ["N", "N", "N", "N", "N", "N", "OFF"] },
  { id: "8", name: "Anita Verma", code: "EMP008", department: "Housekeeping", shifts: ["M", "M", "M", "M", "M", "OFF", "OFF"] },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RosterEditPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [weekOffset, setWeekOffset] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + (weekOffset * 7));

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const weekStart = weekDates[0].toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  const weekEnd = weekDates[6].toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });

  const updateShift = (employeeId: string, dayIndex: number, newShift: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          const newShifts = [...emp.shifts];
          newShifts[dayIndex] = newShift;
          return { ...emp, shifts: newShifts };
        }
        return emp;
      })
    );
    setHasChanges(true);
  };

  const copyPreviousWeek = () => {
    toast({
      title: "Roster copied",
      description: "Previous week's roster has been copied to this week",
    });
    setHasChanges(true);
  };

  const resetChanges = () => {
    setEmployees(initialEmployees);
    setHasChanges(false);
    toast({
      title: "Changes reset",
      description: "All changes have been discarded",
    });
  };

  const saveRoster = () => {
    // API call would go here
    console.log("Saving roster:", employees);
    toast({
      title: "Roster saved",
      description: "Weekly roster has been saved successfully",
    });
    setHasChanges(false);
  };

  const filteredEmployees = employees.filter(
    (emp) => selectedDepartment === "all" || emp.department === selectedDepartment
  );

  const getShiftVariant = (shiftId: string) => {
    const shift = shifts.find((s) => s.id === shiftId);
    return shift?.color as "default" | "success" | "warning" | "secondary" | "outline" || "outline";
  };

  const departments = [...new Set(employees.map((e) => e.department))];

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
            <h1 className="text-2xl font-bold tracking-tight">Edit Roster</h1>
            <p className="text-muted-foreground">
              Manage weekly shift assignments
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyPreviousWeek}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Previous Week
          </Button>
          {hasChanges && (
            <Button variant="outline" onClick={resetChanges}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
          <Button onClick={saveRoster} disabled={!hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Roster
          </Button>
        </div>
      </div>

      {/* Week Navigation & Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 border rounded-md min-w-[200px] text-center">
            <span className="font-medium">{weekStart} - {weekEnd}</span>
          </div>
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {weekOffset !== 0 && (
            <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>
              Today
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Roster Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Employee</TableHead>
                {days.map((day, idx) => (
                  <TableHead key={day} className="text-center min-w-[100px]">
                    <div>{day}</div>
                    <div className="text-xs font-normal text-muted-foreground">
                      {weekDates[idx].toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </div>
                  </TableHead>
                ))}
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
                        <p className="font-medium text-sm">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {employee.code} • {employee.department}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {employee.shifts.map((shift, dayIndex) => (
                    <TableCell key={dayIndex} className="text-center p-1">
                      <Select
                        value={shift}
                        onValueChange={(value) => updateShift(employee.id, dayIndex, value)}
                      >
                        <SelectTrigger className="w-[80px] h-8 mx-auto">
                          <Badge variant={getShiftVariant(shift)} className="w-full justify-center">
                            {shift}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {shifts.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              <div className="flex items-center gap-2">
                                <Badge variant={s.color as any} className="w-10 justify-center">
                                  {s.id}
                                </Badge>
                                <span className="text-xs">{s.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Shift Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {shifts.map((shift) => (
              <div key={shift.id} className="flex items-center gap-2">
                <Badge variant={shift.color as any} className="w-10 justify-center">
                  {shift.id}
                </Badge>
                <div className="text-sm">
                  <span className="font-medium">{shift.name}</span>
                  <span className="text-muted-foreground ml-1">({shift.time})</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {shifts.filter(s => s.id !== "OFF").map((shift) => {
          const count = filteredEmployees.reduce(
            (acc, emp) => acc + emp.shifts.filter((s) => s === shift.id).length,
            0
          );
          return (
            <Card key={shift.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{shift.name} Shifts</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <Badge variant={shift.color as any} className="h-8 w-12 justify-center text-lg">
                    {shift.id}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
