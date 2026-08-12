"use client";

import { useState } from "react";
import { Handshake, Plus, Clock, CheckCircle2, AlertCircle, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

const handovers = [
  { id: "1", from: "Rajesh Kumar", to: "Amit Singh", shift: "Morning to General", date: "2024-01-15", time: "14:00", status: "completed", pendingTasks: 0 },
  { id: "2", from: "Amit Singh", to: "Suresh Reddy", shift: "General to Night", date: "2024-01-15", time: "22:00", status: "pending", pendingTasks: 3 },
  { id: "3", from: "Suresh Reddy", to: "Rajesh Kumar", shift: "Night to Morning", date: "2024-01-15", time: "06:00", status: "completed", pendingTasks: 0 },
  { id: "4", from: "Priya Sharma", to: "Neha Patel", shift: "Morning to Morning", date: "2024-01-15", time: "06:00", status: "completed", pendingTasks: 1 },
];

const pendingItems = [
  { id: "1", task: "Deep cleaning of Conference Room B", priority: "high", assignedBy: "Supervisor" },
  { id: "2", task: "Restock cleaning supplies in Floor 2", priority: "medium", assignedBy: "Manager" },
  { id: "3", task: "Report elevator malfunction to maintenance", priority: "high", assignedBy: "Security" },
];

export default function HandoverPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const stats = {
    total: handovers.length,
    completed: handovers.filter(h => h.status === "completed").length,
    pending: handovers.filter(h => h.status === "pending").length,
    pendingTasks: handovers.reduce((a, h) => a + h.pendingTasks, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shift Handover</h1>
          <p className="text-muted-foreground">Manage shift transitions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />New Handover</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Shift Handover</DialogTitle>
              <DialogDescription>Document shift handover</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2"><Label>Handing Over From</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                      <SelectItem value="amit">Amit Singh</SelectItem>
                      <SelectItem value="suresh">Suresh Reddy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Handing Over To</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                      <SelectItem value="amit">Amit Singh</SelectItem>
                      <SelectItem value="suresh">Suresh Reddy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Shift Transition</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning-general">Morning to General</SelectItem>
                    <SelectItem value="general-night">General to Night</SelectItem>
                    <SelectItem value="night-morning">Night to Morning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Handover Notes</Label><Textarea placeholder="Important points to handover..." /></div>
              <div className="space-y-2">
                <Label>Pending Tasks</Label>
                <div className="space-y-2">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox id={item.id} />
                      <label htmlFor={item.id} className="text-sm">{item.task}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast({ title: "Handover created" }); setIsAddDialogOpen(false); }}>Complete Handover</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Today's Handovers</p><p className="text-2xl font-bold">{stats.total}</p></div><Handshake className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-green-600">{stats.completed}</p></div><CheckCircle2 className="h-8 w-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></div><Clock className="h-8 w-8 text-yellow-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending Tasks</p><p className="text-2xl font-bold text-red-600">{stats.pendingTasks}</p></div><AlertCircle className="h-8 w-8 text-red-600" /></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Today's Handovers</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Shift</TableHead><TableHead>Time</TableHead><TableHead>Pending Tasks</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {handovers.map((handover) => (
                <TableRow key={handover.id}>
                  <TableCell><div className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{getInitials(handover.from)}</AvatarFallback></Avatar><span>{handover.from}</span></div></TableCell>
                  <TableCell><div className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{getInitials(handover.to)}</AvatarFallback></Avatar><span>{handover.to}</span></div></TableCell>
                  <TableCell>{handover.shift}</TableCell>
                  <TableCell>{handover.time}</TableCell>
                  <TableCell>{handover.pendingTasks > 0 ? <Badge variant="destructive">{handover.pendingTasks}</Badge> : <Badge variant="outline">0</Badge>}</TableCell>
                  <TableCell><Badge variant={handover.status === "completed" ? "success" : "warning"}>{handover.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Pending Tasks to Handover</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.task}</p>
                  <p className="text-sm text-muted-foreground">Assigned by: {item.assignedBy}</p>
                </div>
                <Badge variant={item.priority === "high" ? "destructive" : "warning"}>{item.priority}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
