"use client";

import { useState } from "react";
import { CalendarClock, Plus, Clock, Users, CheckCircle2, Edit, Trash2, Settings, ChevronLeft, ChevronRight, X, Repeat, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  amenities: string[];
  status: "available" | "occupied" | "maintenance";
}

interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
  purpose: string;
  attendees: number;
  isRecurring: boolean;
  recurringPattern?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

const initialRooms: MeetingRoom[] = [
  { id: "1", name: "Board Room", capacity: 20, floor: "Floor 3", amenities: ["Projector", "Video Conf", "Whiteboard"], status: "available" },
  { id: "2", name: "Conference Room A", capacity: 10, floor: "Floor 1", amenities: ["TV", "Whiteboard"], status: "occupied" },
  { id: "3", name: "Conference Room B", capacity: 10, floor: "Floor 1", amenities: ["TV", "Whiteboard"], status: "available" },
  { id: "4", name: "Meeting Room 1", capacity: 6, floor: "Floor 2", amenities: ["TV"], status: "occupied" },
  { id: "5", name: "Meeting Room 2", capacity: 6, floor: "Floor 2", amenities: ["TV"], status: "available" },
  { id: "6", name: "Training Room", capacity: 30, floor: "Floor 3", amenities: ["Projector", "Mic System", "Recording"], status: "maintenance" },
];

const initialBookings: Booking[] = [
  { id: "1", roomId: "1", roomName: "Board Room", date: "2024-01-15", startTime: "10:00", endTime: "11:30", bookedBy: "Management Team", purpose: "Monthly Review Meeting", attendees: 15, isRecurring: true, recurringPattern: "Monthly", status: "upcoming" },
  { id: "2", roomId: "2", roomName: "Conference Room A", date: "2024-01-15", startTime: "09:00", endTime: "10:00", bookedBy: "HR Team", purpose: "Candidate Interview", attendees: 4, isRecurring: false, status: "ongoing" },
  { id: "3", roomId: "2", roomName: "Conference Room A", date: "2024-01-15", startTime: "14:00", endTime: "15:00", bookedBy: "Sales Team", purpose: "Client Presentation", attendees: 8, isRecurring: false, status: "upcoming" },
  { id: "4", roomId: "4", roomName: "Meeting Room 1", date: "2024-01-15", startTime: "11:00", endTime: "12:00", bookedBy: "IT Team", purpose: "Sprint Planning", attendees: 6, isRecurring: true, recurringPattern: "Weekly", status: "upcoming" },
  { id: "5", roomId: "1", roomName: "Board Room", date: "2024-01-16", startTime: "14:00", endTime: "16:00", bookedBy: "Finance Team", purpose: "Budget Review", attendees: 10, isRecurring: false, status: "upcoming" },
  { id: "6", roomId: "3", roomName: "Conference Room B", date: "2024-01-17", startTime: "10:00", endTime: "11:00", bookedBy: "Marketing Team", purpose: "Campaign Planning", attendees: 6, isRecurring: false, status: "upcoming" },
];

const amenitiesOptions = ["Projector", "TV", "Whiteboard", "Video Conf", "Mic System", "Recording", "Phone", "Air Conditioning"];
const floorOptions = ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Basement"];

export default function MeetingRoomsPage() {
  const [rooms, setRooms] = useState<MeetingRoom[]>(initialRooms);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // Form states
  const [bookingForm, setBookingForm] = useState({
    roomId: "",
    date: "",
    startTime: "",
    duration: "60",
    attendees: "",
    purpose: "",
    bookedBy: "",
    isRecurring: false,
    recurringPattern: "Weekly"
  });

  const [roomForm, setRoomForm] = useState({
    name: "",
    capacity: "",
    floor: "Floor 1",
    amenities: [] as string[],
    status: "available" as "available" | "occupied" | "maintenance"
  });

  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === "available").length,
    occupied: rooms.filter(r => r.status === "occupied").length,
    todayBookings: bookings.filter(b => b.date === "2024-01-15" && b.status !== "cancelled").length,
  };

  // Get week dates
  const getWeekDates = () => {
    const dates = [];
    const start = new Date(currentWeekStart);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
  };

  const getBookingsForDateAndRoom = (date: Date, roomId: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.date === dateStr && b.roomId === roomId && b.status !== "cancelled");
  };

  // Room management
  const openAddRoom = () => {
    setSelectedRoom(null);
    setRoomForm({ name: "", capacity: "", floor: "Floor 1", amenities: [], status: "available" });
    setIsRoomDialogOpen(true);
  };

  const openEditRoom = (room: MeetingRoom) => {
    setSelectedRoom(room);
    setRoomForm({
      name: room.name,
      capacity: room.capacity.toString(),
      floor: room.floor,
      amenities: room.amenities,
      status: room.status
    });
    setIsRoomDialogOpen(true);
  };

  const saveRoom = () => {
    if (!roomForm.name || !roomForm.capacity) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (selectedRoom) {
      setRooms(prev => prev.map(r => r.id === selectedRoom.id ? {
        ...r,
        name: roomForm.name,
        capacity: parseInt(roomForm.capacity),
        floor: roomForm.floor,
        amenities: roomForm.amenities,
        status: roomForm.status
      } : r));
      toast({ title: "Room updated successfully" });
    } else {
      const newRoom: MeetingRoom = {
        id: Date.now().toString(),
        name: roomForm.name,
        capacity: parseInt(roomForm.capacity),
        floor: roomForm.floor,
        amenities: roomForm.amenities,
        status: roomForm.status
      };
      setRooms(prev => [...prev, newRoom]);
      toast({ title: "Room added successfully" });
    }
    setIsRoomDialogOpen(false);
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
    toast({ title: "Room deleted" });
  };

  const toggleRoomStatus = (roomId: string, status: "available" | "maintenance") => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
    toast({ title: `Room marked as ${status}` });
  };

  // Booking management
  const openBookDialog = (roomId?: string) => {
    setBookingForm({
      roomId: roomId || "",
      date: "",
      startTime: "",
      duration: "60",
      attendees: "",
      purpose: "",
      bookedBy: "",
      isRecurring: false,
      recurringPattern: "Weekly"
    });
    setIsBookDialogOpen(true);
  };

  const calculateEndTime = (startTime: string, duration: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(duration);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const saveBooking = () => {
    if (!bookingForm.roomId || !bookingForm.date || !bookingForm.startTime || !bookingForm.purpose || !bookingForm.bookedBy) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const room = rooms.find(r => r.id === bookingForm.roomId);
    const endTime = calculateEndTime(bookingForm.startTime, bookingForm.duration);

    const newBooking: Booking = {
      id: Date.now().toString(),
      roomId: bookingForm.roomId,
      roomName: room?.name || "",
      date: bookingForm.date,
      startTime: bookingForm.startTime,
      endTime: endTime,
      bookedBy: bookingForm.bookedBy,
      purpose: bookingForm.purpose,
      attendees: parseInt(bookingForm.attendees) || 1,
      isRecurring: bookingForm.isRecurring,
      recurringPattern: bookingForm.isRecurring ? bookingForm.recurringPattern : undefined,
      status: "upcoming"
    };

    setBookings(prev => [...prev, newBooking]);
    toast({ title: "Room booked successfully" });
    setIsBookDialogOpen(false);
  };

  const openEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    const duration = ((parseInt(booking.endTime.split(':')[0]) * 60 + parseInt(booking.endTime.split(':')[1])) -
      (parseInt(booking.startTime.split(':')[0]) * 60 + parseInt(booking.startTime.split(':')[1]))).toString();

    setBookingForm({
      roomId: booking.roomId,
      date: booking.date,
      startTime: booking.startTime,
      duration: duration,
      attendees: booking.attendees.toString(),
      purpose: booking.purpose,
      bookedBy: booking.bookedBy,
      isRecurring: booking.isRecurring,
      recurringPattern: booking.recurringPattern || "Weekly"
    });
    setIsEditBookingOpen(true);
  };

  const updateBooking = () => {
    if (!selectedBooking) return;

    const room = rooms.find(r => r.id === bookingForm.roomId);
    const endTime = calculateEndTime(bookingForm.startTime, bookingForm.duration);

    setBookings(prev => prev.map(b => b.id === selectedBooking.id ? {
      ...b,
      roomId: bookingForm.roomId,
      roomName: room?.name || "",
      date: bookingForm.date,
      startTime: bookingForm.startTime,
      endTime: endTime,
      bookedBy: bookingForm.bookedBy,
      purpose: bookingForm.purpose,
      attendees: parseInt(bookingForm.attendees) || 1,
      isRecurring: bookingForm.isRecurring,
      recurringPattern: bookingForm.isRecurring ? bookingForm.recurringPattern : undefined,
    } : b));

    toast({ title: "Booking updated successfully" });
    setIsEditBookingOpen(false);
    setSelectedBooking(null);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" as const } : b));
    toast({ title: "Booking cancelled" });
  };

  const deleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    toast({ title: "Booking deleted" });
  };

  const toggleAmenity = (amenity: string) => {
    setRoomForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meeting Rooms</h1>
          <p className="text-muted-foreground">Book and manage meeting rooms</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openAddRoom}>
            <Settings className="mr-2 h-4 w-4" />Manage Rooms
          </Button>
          <Button onClick={() => openBookDialog()}>
            <Plus className="mr-2 h-4 w-4" />Book Room
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Rooms</p><p className="text-2xl font-bold">{stats.total}</p></div><CalendarClock className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Available</p><p className="text-2xl font-bold text-green-600">{stats.available}</p></div><CheckCircle2 className="h-8 w-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Occupied</p><p className="text-2xl font-bold text-red-600">{stats.occupied}</p></div><Users className="h-8 w-8 text-red-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Today's Bookings</p><p className="text-2xl font-bold">{stats.todayBookings}</p></div><Clock className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
      </div>

      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
        </TabsList>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <Badge variant={room.status === "available" ? "default" : room.status === "occupied" ? "destructive" : "secondary"}>
                      {room.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" /><span>{room.capacity} people</span>
                      <span>•</span>
                      <MapPin className="h-4 w-4" /><span>{room.floor}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((a) => (
                        <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      {room.status === "available" && (
                        <Button className="flex-1" size="sm" onClick={() => openBookDialog(room.id)}>
                          Book Now
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => openEditRoom(room)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {room.status === "available" ? (
                        <Button variant="outline" size="sm" onClick={() => toggleRoomStatus(room.id, "maintenance")}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      ) : room.status === "maintenance" && (
                        <Button variant="outline" size="sm" onClick={() => toggleRoomStatus(room.id, "available")}>
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Schedule</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateWeek(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[200px] text-center">
                    {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => navigateWeek(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Room</TableHead>
                      {weekDates.map((date, idx) => (
                        <TableHead key={idx} className="text-center min-w-[120px]">
                          <div>{dayNames[idx]}</div>
                          <div className="text-xs text-muted-foreground">{date.getDate()}</div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.filter(r => r.status !== "maintenance").map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        {weekDates.map((date, idx) => {
                          const dayBookings = getBookingsForDateAndRoom(date, room.id);
                          return (
                            <TableCell key={idx} className="p-1">
                              {dayBookings.length > 0 ? (
                                <div className="space-y-1">
                                  {dayBookings.map((booking) => (
                                    <div
                                      key={booking.id}
                                      className="text-xs p-1 bg-primary/10 rounded cursor-pointer hover:bg-primary/20"
                                      onClick={() => openEditBooking(booking)}
                                    >
                                      <div className="font-medium truncate">{booking.startTime}-{booking.endTime}</div>
                                      <div className="truncate text-muted-foreground">{booking.purpose}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full h-8 text-xs"
                                  onClick={() => {
                                    setBookingForm(prev => ({ ...prev, roomId: room.id, date: date.toISOString().split('T')[0] }));
                                    setIsBookDialogOpen(true);
                                  }}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Booked By</TableHead>
                    <TableHead>Recurring</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.roomName}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>{booking.startTime} - {booking.endTime}</TableCell>
                      <TableCell>{booking.purpose}</TableCell>
                      <TableCell>{booking.bookedBy}</TableCell>
                      <TableCell>
                        {booking.isRecurring ? (
                          <Badge variant="outline">
                            <Repeat className="h-3 w-3 mr-1" />
                            {booking.recurringPattern}
                          </Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          booking.status === "upcoming" ? "default" :
                          booking.status === "ongoing" ? "secondary" :
                          booking.status === "completed" ? "outline" : "destructive"
                        }>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {booking.status === "upcoming" && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => openEditBooking(booking)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => cancelBooking(booking.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteBooking(booking.id)}>
                            <Trash2 className="h-4 w-4" />
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
      </Tabs>

      {/* Book Room Dialog */}
      <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Meeting Room</DialogTitle>
            <DialogDescription>Reserve a meeting room for your meeting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Room *</Label>
              <Select value={bookingForm.roomId} onValueChange={(v) => setBookingForm(prev => ({ ...prev, roomId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                <SelectContent>
                  {rooms.filter(r => r.status === "available").map(room => (
                    <SelectItem key={room.id} value={room.id}>{room.name} ({room.capacity} people)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" value={bookingForm.date} onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Start Time *</Label>
                <Input type="time" value={bookingForm.startTime} onChange={(e) => setBookingForm(prev => ({ ...prev, startTime: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={bookingForm.duration} onValueChange={(v) => setBookingForm(prev => ({ ...prev, duration: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Attendees</Label>
                <Input type="number" placeholder="Number" value={bookingForm.attendees} onChange={(e) => setBookingForm(prev => ({ ...prev, attendees: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Booked By *</Label>
              <Input placeholder="Team or person name" value={bookingForm.bookedBy} onChange={(e) => setBookingForm(prev => ({ ...prev, bookedBy: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Purpose *</Label>
              <Input placeholder="Meeting purpose" value={bookingForm.purpose} onChange={(e) => setBookingForm(prev => ({ ...prev, purpose: e.target.value }))} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={bookingForm.isRecurring}
                onCheckedChange={(checked) => setBookingForm(prev => ({ ...prev, isRecurring: checked as boolean }))}
              />
              <Label htmlFor="recurring" className="cursor-pointer">Recurring booking</Label>
            </div>
            {bookingForm.isRecurring && (
              <div className="space-y-2">
                <Label>Repeat Pattern</Label>
                <Select value={bookingForm.recurringPattern} onValueChange={(v) => setBookingForm(prev => ({ ...prev, recurringPattern: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveBooking}>Book Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditBookingOpen} onOpenChange={setIsEditBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>Update booking details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Room</Label>
              <Select value={bookingForm.roomId} onValueChange={(v) => setBookingForm(prev => ({ ...prev, roomId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                <SelectContent>
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>{room.name} ({room.capacity} people)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={bookingForm.date} onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" value={bookingForm.startTime} onChange={(e) => setBookingForm(prev => ({ ...prev, startTime: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={bookingForm.duration} onValueChange={(v) => setBookingForm(prev => ({ ...prev, duration: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Attendees</Label>
                <Input type="number" value={bookingForm.attendees} onChange={(e) => setBookingForm(prev => ({ ...prev, attendees: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Booked By</Label>
              <Input value={bookingForm.bookedBy} onChange={(e) => setBookingForm(prev => ({ ...prev, bookedBy: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Input value={bookingForm.purpose} onChange={(e) => setBookingForm(prev => ({ ...prev, purpose: e.target.value }))} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring-edit"
                checked={bookingForm.isRecurring}
                onCheckedChange={(checked) => setBookingForm(prev => ({ ...prev, isRecurring: checked as boolean }))}
              />
              <Label htmlFor="recurring-edit" className="cursor-pointer">Recurring booking</Label>
            </div>
            {bookingForm.isRecurring && (
              <div className="space-y-2">
                <Label>Repeat Pattern</Label>
                <Select value={bookingForm.recurringPattern} onValueChange={(v) => setBookingForm(prev => ({ ...prev, recurringPattern: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBookingOpen(false)}>Cancel</Button>
            <Button onClick={updateBooking}>Update Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Room Management Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
            <DialogDescription>
              {selectedRoom ? "Update room details" : "Add a new meeting room"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Room Name *</Label>
              <Input placeholder="e.g., Conference Room C" value={roomForm.name} onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Capacity *</Label>
                <Input type="number" placeholder="e.g., 10" value={roomForm.capacity} onChange={(e) => setRoomForm(prev => ({ ...prev, capacity: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Floor</Label>
                <Select value={roomForm.floor} onValueChange={(v) => setRoomForm(prev => ({ ...prev, floor: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {floorOptions.map(floor => (
                      <SelectItem key={floor} value={floor}>{floor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={roomForm.status} onValueChange={(v: "available" | "maintenance") => setRoomForm(prev => ({ ...prev, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={roomForm.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-sm cursor-pointer">{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {selectedRoom && (
              <Button variant="destructive" onClick={() => { deleteRoom(selectedRoom.id); setIsRoomDialogOpen(false); }}>
                Delete Room
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsRoomDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveRoom}>{selectedRoom ? "Update" : "Add"} Room</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
