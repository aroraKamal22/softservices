"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Download,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

// Mock data
const employees = [
  {
    id: "1",
    employeeCode: "EMP001",
    firstName: "Rajesh",
    lastName: "Kumar",
    department: "Housekeeping",
    designation: "Supervisor",
    phone: "+91 9876543210",
    email: "rajesh.kumar@demo.com",
    site: "Main Office",
    status: "active",
    photo: null,
  },
  {
    id: "2",
    employeeCode: "EMP002",
    firstName: "Priya",
    lastName: "Sharma",
    department: "Front Desk",
    designation: "Executive",
    phone: "+91 9876543211",
    email: "priya.sharma@demo.com",
    site: "Main Office",
    status: "active",
    photo: null,
  },
  {
    id: "3",
    employeeCode: "EMP003",
    firstName: "Amit",
    lastName: "Singh",
    department: "Technical",
    designation: "Technician",
    phone: "+91 9876543212",
    email: "amit.singh@demo.com",
    site: "Tech Hub",
    status: "active",
    photo: null,
  },
  {
    id: "4",
    employeeCode: "EMP004",
    firstName: "Neha",
    lastName: "Patel",
    department: "Housekeeping",
    designation: "Team Lead",
    phone: "+91 9876543213",
    email: null,
    site: "Main Office",
    status: "inactive",
    photo: null,
  },
  {
    id: "5",
    employeeCode: "EMP005",
    firstName: "Suresh",
    lastName: "Reddy",
    department: "Security",
    designation: "Security Guard",
    phone: "+91 9876543214",
    email: null,
    site: "Main Office",
    status: "active",
    photo: null,
  },
];

const departments = [
  "All Departments",
  "Housekeeping",
  "Technical",
  "Security",
  "Front Desk",
  "Administration",
];

const sites = ["All Sites", "Main Office", "Tech Hub", "Regional Office"];

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedSite, setSelectedSite] = useState("All Sites");

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDepartment === "All Departments" ||
      emp.department === selectedDepartment;
    const matchesSite =
      selectedSite === "All Sites" || emp.site === selectedSite;
    return matchesSearch && matchesDept && matchesSite;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage employees across all sites
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            // Export to CSV
            const headers = ["Employee Code", "Name", "Department", "Designation", "Phone", "Email", "Site", "Status"];
            const csvData = filteredEmployees.map(emp => [
              emp.employeeCode,
              `${emp.firstName} ${emp.lastName}`,
              emp.department,
              emp.designation,
              emp.phone,
              emp.email || "",
              emp.site,
              emp.status
            ]);

            const csvContent = [
              headers.join(","),
              ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `employees_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/employees/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
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
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">148</p>
              </div>
              <Badge variant="success" className="h-8 px-3">95%</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Leave Today</p>
                <p className="text-2xl font-bold text-yellow-600">8</p>
              </div>
              <Badge variant="warning" className="h-8 px-3">5%</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <Badge className="h-8 px-3">+8%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or employee code..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSite} onValueChange={setSelectedSite}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Site" />
          </SelectTrigger>
          <SelectContent>
            {sites.map((site) => (
              <SelectItem key={site} value={site}>
                {site}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employees Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={employee.photo || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(`${employee.firstName} ${employee.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {employee.employeeCode}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {employee.phone}
                      </div>
                      {employee.email && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {employee.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{employee.site}</TableCell>
                  <TableCell>
                    <Badge
                      variant={employee.status === "active" ? "success" : "secondary"}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/employees/${employee.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/employees/${employee.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
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
