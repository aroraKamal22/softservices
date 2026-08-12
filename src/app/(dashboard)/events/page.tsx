"use client";

import { useState } from "react";
import { CalendarDays, Plus, Clock, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const events = [
  { id: "1", title: "Annual General Meeting", date: "2024-01-20", time: "10:00 AM", location: "Board Room", attendees: 50, status: "upcoming" },
  { id: "2", title: "Safety Training Session", date: "2024-01-18", time: "2:00 PM", location: "Training Room", attendees: 25, status: "upcoming" },
  { id: "3", title: "Client Visit - ABC Corp", date: "2024-01-17", time: "11:00 AM", location: "Conference Room A", attendees: 8, status: "today" },
  { id: "4", title: "Team Building Activity", date: "2024-01-25", time: "4:00 PM", location: "Outdoor Area", attendees: 100, status: "upcoming" },
  { id: "5", title: "Fire Drill", date: "2024-01-15", time: "3:00 PM", location: "All Floors", attendees: 200, status: "completed" },
];

export default function EventsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === "upcoming").length,
    today: events.filter(e => e.status === "today").length,
    completed: events.filter(e => e.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage events and activities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Create Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Schedule a new event</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Event Title</Label><Input placeholder="Event name" /></div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
              </div>
              <div className="space-y-2"><Label>Location</Label><Input placeholder="Location" /></div>
              <div className="space-y-2"><Label>Expected Attendees</Label><Input type="number" placeholder="Number" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Event details..." /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast({ title: "Event created" }); setIsAddDialogOpen(false); }}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Events</p><p className="text-2xl font-bold">{stats.total}</p></div><CalendarDays className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Today</p><p className="text-2xl font-bold text-blue-600">{stats.today}</p></div><Badge>Today</Badge></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Upcoming</p><p className="text-2xl font-bold text-green-600">{stats.upcoming}</p></div><Badge variant="success">Upcoming</Badge></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold">{stats.completed}</p></div><Badge variant="secondary">Done</Badge></div></CardContent></Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge variant={event.status === "today" ? "default" : event.status === "upcoming" ? "success" : "secondary"}>{event.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="h-4 w-4" /><span>{event.date}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /><span>{event.time}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span>{event.location}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /><span>{event.attendees} attendees</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
