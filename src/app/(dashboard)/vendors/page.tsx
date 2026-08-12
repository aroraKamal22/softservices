"use client";

import { useState } from "react";
import { Handshake, Plus, Search, MoreHorizontal, Phone, Mail, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

const vendors = [
  { id: "1", name: "CleanPro Supplies", category: "Cleaning Supplies", contact: "Raj Patel", email: "raj@cleanpro.com", phone: "+91 9876543210", rating: 4.5, status: "active" },
  { id: "2", name: "TechFix Services", category: "Equipment Maintenance", contact: "Anil Kumar", email: "anil@techfix.com", phone: "+91 9876543211", rating: 4.2, status: "active" },
  { id: "3", name: "SafeGuard Security", category: "Security Services", contact: "Priya Singh", email: "priya@safeguard.com", phone: "+91 9876543212", rating: 4.8, status: "active" },
  { id: "4", name: "GreenCare Gardens", category: "Landscaping", contact: "Mohan Das", email: "mohan@greencare.com", phone: "+91 9876543213", rating: 3.9, status: "inactive" },
];

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Manage vendor relationships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Vendor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>Register a new vendor</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Vendor Name</Label><Input placeholder="Vendor name" /></div>
              <div className="space-y-2"><Label>Category</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplies">Cleaning Supplies</SelectItem>
                    <SelectItem value="maintenance">Equipment Maintenance</SelectItem>
                    <SelectItem value="security">Security Services</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Contact Person</Label><Input placeholder="Contact name" /></div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input placeholder="Phone" /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast({ title: "Vendor added" }); setIsAddDialogOpen(false); }}>Add Vendor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Vendors</p><p className="text-2xl font-bold">{vendors.length}</p></div><Handshake className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-green-600">{vendors.filter(v => v.status === "active").length}</p></div><Badge variant="success">Active</Badge></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Avg Rating</p><p className="text-2xl font-bold">{(vendors.reduce((a, v) => a + v.rating, 0) / vendors.length).toFixed(1)}</p></div><Star className="h-8 w-8 text-yellow-500" /></div></CardContent></Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search vendors..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Vendor</TableHead><TableHead>Category</TableHead><TableHead>Contact</TableHead><TableHead>Rating</TableHead><TableHead>Status</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell><div className="flex items-center gap-3"><Avatar><AvatarFallback>{getInitials(vendor.name)}</AvatarFallback></Avatar><div><p className="font-medium">{vendor.name}</p></div></div></TableCell>
                  <TableCell><Badge variant="outline">{vendor.category}</Badge></TableCell>
                  <TableCell><div><p className="text-sm">{vendor.contact}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{vendor.email}</p></div></TableCell>
                  <TableCell><div className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /><span>{vendor.rating}</span></div></TableCell>
                  <TableCell><Badge variant={vendor.status === "active" ? "success" : "secondary"}>{vendor.status}</Badge></TableCell>
                  <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>View Details</DropdownMenuItem><DropdownMenuItem>Edit</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
