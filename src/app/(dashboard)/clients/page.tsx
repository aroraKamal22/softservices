"use client";

import { useState } from "react";
import { Briefcase, Plus, Search, MoreHorizontal, Building2, Phone, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

const clients = [
  { id: "1", name: "ABC Corporation", contact: "John Smith", email: "john@abc.com", phone: "+91 9876543210", sites: 3, status: "active" },
  { id: "2", name: "XYZ Industries", contact: "Sarah Johnson", email: "sarah@xyz.com", phone: "+91 9876543211", sites: 2, status: "active" },
  { id: "3", name: "Tech Solutions Ltd", contact: "Mike Brown", email: "mike@techsol.com", phone: "+91 9876543212", sites: 1, status: "active" },
  { id: "4", name: "Global Services", contact: "Emily Davis", email: "emily@global.com", phone: "+91 9876543213", sites: 4, status: "inactive" },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>Add a new client to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Company Name</Label><Input placeholder="Company name" /></div>
              <div className="space-y-2"><Label>Contact Person</Label><Input placeholder="Contact name" /></div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input placeholder="Phone" /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast({ title: "Client added" }); setIsAddDialogOpen(false); }}>Add Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Clients</p><p className="text-2xl font-bold">{clients.length}</p></div><Briefcase className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-green-600">{clients.filter(c => c.status === "active").length}</p></div><Badge variant="success">Active</Badge></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Sites</p><p className="text-2xl font-bold">{clients.reduce((a, c) => a + c.sites, 0)}</p></div><Building2 className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search clients..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Contact</TableHead><TableHead>Sites</TableHead><TableHead>Status</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarFallback>{getInitials(client.name)}</AvatarFallback></Avatar>
                      <div><p className="font-medium">{client.name}</p></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div><p className="text-sm">{client.contact}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{client.email}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{client.phone}</p></div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{client.sites} sites</Badge></TableCell>
                  <TableCell><Badge variant={client.status === "active" ? "success" : "secondary"}>{client.status}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>View Details</DropdownMenuItem><DropdownMenuItem>Edit</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
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
