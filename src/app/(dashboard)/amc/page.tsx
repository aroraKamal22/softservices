"use client";

import { useState } from "react";
import { Shield, Plus, Search, MoreHorizontal, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const amcContracts = [
  { id: "AMC-001", equipment: "HVAC System - Floor 1", vendor: "TechFix Services", startDate: "2024-01-01", endDate: "2024-12-31", value: "₹1,20,000", status: "active", daysLeft: 320 },
  { id: "AMC-002", equipment: "Elevator Maintenance", vendor: "LiftPro India", startDate: "2024-03-01", endDate: "2025-02-28", value: "₹2,50,000", status: "active", daysLeft: 380 },
  { id: "AMC-003", equipment: "Fire Safety Equipment", vendor: "SafeGuard Security", startDate: "2023-06-01", endDate: "2024-05-31", value: "₹80,000", status: "expiring", daysLeft: 15 },
  { id: "AMC-004", equipment: "Generator Service", vendor: "PowerGen Services", startDate: "2023-01-01", endDate: "2023-12-31", value: "₹60,000", status: "expired", daysLeft: 0 },
  { id: "AMC-005", equipment: "CCTV System", vendor: "SecureTech", startDate: "2024-02-01", endDate: "2025-01-31", value: "₹45,000", status: "active", daysLeft: 350 },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  active: { label: "Active", variant: "success" },
  expiring: { label: "Expiring Soon", variant: "warning" },
  expired: { label: "Expired", variant: "destructive" },
};

export default function AMCPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const stats = {
    total: amcContracts.length,
    active: amcContracts.filter(a => a.status === "active").length,
    expiring: amcContracts.filter(a => a.status === "expiring").length,
    expired: amcContracts.filter(a => a.status === "expired").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AMC Management</h1>
          <p className="text-muted-foreground">Annual Maintenance Contracts</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add AMC</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New AMC</DialogTitle>
              <DialogDescription>Register a new maintenance contract</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Equipment/Service</Label><Input placeholder="Equipment name" /></div>
              <div className="space-y-2"><Label>Vendor</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="techfix">TechFix Services</SelectItem>
                    <SelectItem value="safeguard">SafeGuard Security</SelectItem>
                    <SelectItem value="powergen">PowerGen Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="date" /></div>
              </div>
              <div className="space-y-2"><Label>Contract Value</Label><Input placeholder="₹0" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast({ title: "AMC added" }); setIsAddDialogOpen(false); }}>Add AMC</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Contracts</p><p className="text-2xl font-bold">{stats.total}</p></div><Shield className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-green-600">{stats.active}</p></div><CheckCircle2 className="h-8 w-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Expiring Soon</p><p className="text-2xl font-bold text-yellow-600">{stats.expiring}</p></div><AlertCircle className="h-8 w-8 text-yellow-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Expired</p><p className="text-2xl font-bold text-red-600">{stats.expired}</p></div><Calendar className="h-8 w-8 text-red-600" /></div></CardContent></Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search AMC..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <Select defaultValue="all"><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="expiring">Expiring</SelectItem><SelectItem value="expired">Expired</SelectItem></SelectContent></Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Contract</TableHead><TableHead>Equipment</TableHead><TableHead>Vendor</TableHead><TableHead>Duration</TableHead><TableHead>Value</TableHead><TableHead>Status</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
            <TableBody>
              {amcContracts.map((amc) => (
                <TableRow key={amc.id}>
                  <TableCell><p className="font-medium">{amc.id}</p></TableCell>
                  <TableCell>{amc.equipment}</TableCell>
                  <TableCell>{amc.vendor}</TableCell>
                  <TableCell><div><p className="text-sm">{amc.startDate} - {amc.endDate}</p>{amc.status !== "expired" && <div className="flex items-center gap-2 mt-1"><Progress value={amc.status === "active" ? 80 : 95} className="h-1 w-20" /><span className="text-xs text-muted-foreground">{amc.daysLeft} days left</span></div>}</div></TableCell>
                  <TableCell>{amc.value}</TableCell>
                  <TableCell><Badge variant={statusConfig[amc.status].variant}>{statusConfig[amc.status].label}</Badge></TableCell>
                  <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>View Details</DropdownMenuItem><DropdownMenuItem>Renew</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
