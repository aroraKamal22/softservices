"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Shield,
  Edit,
  Trash2,
  Users,
  Check,
  X,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Mock data
const roles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access",
    users: 1,
    isSystem: true,
    permissions: {
      sites: ["create", "read", "update", "delete", "manage"],
      employees: ["create", "read", "update", "delete", "manage"],
      attendance: ["create", "read", "update", "delete", "manage"],
      housekeeping: ["create", "read", "update", "delete", "manage"],
      inspections: ["create", "read", "update", "delete", "manage"],
      complaints: ["create", "read", "update", "delete", "manage"],
      users: ["create", "read", "update", "delete", "manage"],
      roles: ["create", "read", "update", "delete", "manage"],
      settings: ["read", "update", "manage"],
    },
  },
  {
    id: "2",
    name: "Site Manager",
    description: "Manage assigned sites",
    users: 3,
    isSystem: false,
    permissions: {
      sites: ["read"],
      employees: ["create", "read", "update"],
      attendance: ["create", "read", "update", "manage"],
      housekeeping: ["create", "read", "update", "delete", "manage"],
      inspections: ["create", "read", "update", "manage"],
      complaints: ["create", "read", "update", "manage"],
      users: ["read"],
      roles: [],
      settings: ["read"],
    },
  },
  {
    id: "3",
    name: "Supervisor",
    description: "Supervise housekeeping and staff",
    users: 5,
    isSystem: false,
    permissions: {
      sites: ["read"],
      employees: ["read"],
      attendance: ["create", "read", "update"],
      housekeeping: ["create", "read", "update"],
      inspections: ["create", "read"],
      complaints: ["create", "read", "update"],
      users: [],
      roles: [],
      settings: [],
    },
  },
  {
    id: "4",
    name: "Inspector",
    description: "Conduct inspections",
    users: 4,
    isSystem: false,
    permissions: {
      sites: ["read"],
      employees: ["read"],
      attendance: ["read"],
      housekeeping: ["read"],
      inspections: ["create", "read", "update"],
      complaints: ["create", "read"],
      users: [],
      roles: [],
      settings: [],
    },
  },
  {
    id: "5",
    name: "Front Desk",
    description: "Reception and visitor management",
    users: 2,
    isSystem: false,
    permissions: {
      sites: ["read"],
      employees: ["read"],
      attendance: ["read"],
      housekeeping: ["read"],
      inspections: ["read"],
      complaints: ["create", "read"],
      users: [],
      roles: [],
      settings: [],
    },
  },
];

const modules = [
  { id: "sites", name: "Sites", description: "Manage sites and locations" },
  { id: "employees", name: "Employees", description: "Employee management" },
  { id: "attendance", name: "Attendance", description: "Attendance tracking" },
  { id: "housekeeping", name: "Housekeeping", description: "Cleaning tasks" },
  { id: "inspections", name: "Inspections", description: "Quality inspections" },
  { id: "complaints", name: "Complaints", description: "Complaint handling" },
  { id: "users", name: "Users", description: "User management" },
  { id: "roles", name: "Roles", description: "Role management" },
  { id: "settings", name: "Settings", description: "System settings" },
];

const actions = ["create", "read", "update", "delete", "manage"];

export default function RolesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<typeof roles[0] | null>(null);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: {} as Record<string, string[]>,
  });

  const handleAddRole = () => {
    if (!newRole.name) {
      toast({
        title: "Error",
        description: "Please enter a role name",
        variant: "destructive",
      });
      return;
    }

    console.log("Adding role:", newRole);
    toast({
      title: "Role created",
      description: `${newRole.name} role has been created successfully`,
    });
    setIsAddDialogOpen(false);
    setNewRole({ name: "", description: "", permissions: {} });
  };

  const togglePermission = (module: string, action: string) => {
    setNewRole((prev) => {
      const modulePermissions = prev.permissions[module] || [];
      const hasPermission = modulePermissions.includes(action);

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [module]: hasPermission
            ? modulePermissions.filter((p) => p !== action)
            : [...modulePermissions, action],
        },
      };
    });
  };

  const deleteRole = (roleId: string, roleName: string) => {
    toast({
      title: "Role deleted",
      description: `${roleName} role has been deleted`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
            <p className="text-muted-foreground">
              Configure roles and permissions
            </p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Name *</Label>
                  <Input
                    id="roleName"
                    placeholder="e.g., Team Lead"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDescription">Description</Label>
                  <Input
                    id="roleDescription"
                    placeholder="Brief description"
                    value={newRole.description}
                    onChange={(e) =>
                      setNewRole({ ...newRole, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Module</TableHead>
                          {actions.map((action) => (
                            <TableHead key={action} className="text-center capitalize">
                              {action}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {modules.map((module) => (
                          <TableRow key={module.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{module.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {module.description}
                                </p>
                              </div>
                            </TableCell>
                            {actions.map((action) => (
                              <TableCell key={action} className="text-center">
                                <Checkbox
                                  checked={
                                    newRole.permissions[module.id]?.includes(action) ||
                                    false
                                  }
                                  onCheckedChange={() =>
                                    togglePermission(module.id, action)
                                  }
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id} className="relative">
            {role.isSystem && (
              <Badge className="absolute top-4 right-4" variant="secondary">
                System
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{role.name}</CardTitle>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{role.users} users</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRole(role)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!role.isSystem && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteRole(role.id, role.name)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Permission summary */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(role.permissions)
                    .filter(([_, perms]) => perms.length > 0)
                    .slice(0, 4)
                    .map(([module, perms]) => (
                      <Badge key={module} variant="outline" className="text-xs">
                        {module}: {perms.length}
                      </Badge>
                    ))}
                  {Object.entries(role.permissions).filter(([_, perms]) => perms.length > 0)
                    .length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +
                      {Object.entries(role.permissions).filter(
                        ([_, perms]) => perms.length > 0
                      ).length - 4}{" "}
                      more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Details Dialog */}
      {selectedRole && (
        <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {selectedRole.name}
                {selectedRole.isSystem && (
                  <Badge variant="secondary">System Role</Badge>
                )}
              </DialogTitle>
              <DialogDescription>{selectedRole.description}</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Permission Matrix</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        {actions.map((action) => (
                          <TableHead key={action} className="text-center capitalize">
                            {action}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map((module) => (
                        <TableRow key={module.id}>
                          <TableCell className="font-medium">{module.name}</TableCell>
                          {actions.map((action) => (
                            <TableCell key={action} className="text-center">
                              {selectedRole.permissions[module.id]?.includes(action) ? (
                                <Check className="h-4 w-4 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-gray-300 mx-auto" />
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRole(null)}>
                Close
              </Button>
              {!selectedRole.isSystem && (
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Permissions
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
