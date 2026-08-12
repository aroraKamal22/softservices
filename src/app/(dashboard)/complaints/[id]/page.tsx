"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Clock,
  AlertTriangle,
  CheckCircle2,
  User,
  MessageSquare,
  Send,
  UserPlus,
  MoreHorizontal,
  MapPin,
  Calendar,
  Tag,
  FileImage,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime, getInitials } from "@/lib/utils";

// Mock data
const complaint = {
  id: "1",
  ticketNumber: "TKT-2024-001",
  title: "AC not working in Conference Room A",
  description:
    "The air conditioning unit in Conference Room A on the 2nd floor is not cooling properly. The temperature display shows 28C but it should be at 22C. This is causing discomfort during meetings.",
  category: "HVAC",
  priority: "high",
  status: "in-progress",
  source: "manual",
  site: "Main Office",
  area: "Conference Room A, Floor 2",
  reporterName: "John Doe",
  reporterEmail: "john.doe@company.com",
  reporterPhone: "+91 9876543210",
  assignedTo: {
    id: "1",
    name: "Amit Singh",
    designation: "Technician",
    avatar: null,
  },
  createdBy: {
    id: "2",
    name: "Priya Sharma",
    avatar: null,
  },
  createdAt: "2024-01-15T10:30:00",
  slaDueDate: "2024-01-15T14:30:00",
  slaBreached: false,
  responseTime: "2024-01-15T10:45:00",
  photos: [],
};

const history = [
  {
    id: "1",
    action: "created",
    user: "Priya Sharma",
    timestamp: "2024-01-15T10:30:00",
    details: "Complaint created",
  },
  {
    id: "2",
    action: "assigned",
    user: "Priya Sharma",
    timestamp: "2024-01-15T10:45:00",
    details: "Assigned to Amit Singh",
  },
  {
    id: "3",
    action: "status_change",
    user: "Amit Singh",
    timestamp: "2024-01-15T11:00:00",
    details: "Status changed from Assigned to In Progress",
  },
  {
    id: "4",
    action: "comment",
    user: "Amit Singh",
    timestamp: "2024-01-15T11:30:00",
    details:
      "Inspected the AC unit. Found that the compressor needs servicing. Parts have been ordered.",
  },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  open: { label: "Open", variant: "warning" },
  assigned: { label: "Assigned", variant: "default" },
  "in-progress": { label: "In Progress", variant: "default" },
  pending: { label: "Pending", variant: "secondary" },
  resolved: { label: "Resolved", variant: "success" },
  closed: { label: "Closed", variant: "outline" },
  reopened: { label: "Reopened", variant: "destructive" },
};

const priorityConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  low: { label: "Low", variant: "secondary" },
  medium: { label: "Medium", variant: "default" },
  high: { label: "High", variant: "warning" },
  critical: { label: "Critical", variant: "destructive" },
};

export default function ComplaintDetailPage() {
  const params = useParams();
  const [comment, setComment] = useState("");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleAddComment = () => {
    if (comment.trim()) {
      // API call to add comment
      console.log("Adding comment:", comment);
      setComment("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/complaints">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight font-mono">
                {complaint.ticketNumber}
              </h1>
              <Badge variant={statusConfig[complaint.status].variant}>
                {statusConfig[complaint.status].label}
              </Badge>
              <Badge variant={priorityConfig[complaint.priority].variant}>
                {priorityConfig[complaint.priority].label}
              </Badge>
              {complaint.slaBreached && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  SLA Breached
                </Badge>
              )}
            </div>
            <p className="text-lg font-medium mt-1">{complaint.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsAssignDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark Resolved
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{complaint.description}</p>
              {complaint.photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Attachments</p>
                  <div className="flex gap-2">
                    {complaint.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center"
                      >
                        <FileImage className="h-6 w-6 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity & Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Comment */}
              <div className="flex gap-3 mb-6">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    PS
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                  />
                  <Button size="sm" onClick={handleAddComment}>
                    <Send className="mr-2 h-4 w-4" />
                    Add Comment
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Timeline */}
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-xs">
                          {getInitials(item.user)}
                        </AvatarFallback>
                      </Avatar>
                      {index < history.length - 1 && (
                        <div className="w-px h-full bg-border my-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{item.user}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(item.timestamp)}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          item.action === "comment"
                            ? "bg-muted p-3 rounded-lg"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select defaultValue={complaint.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">{complaint.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{complaint.area}</p>
                  <p className="text-xs text-muted-foreground">{complaint.site}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
                    {formatDateTime(complaint.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">SLA Due</p>
                  <p className="text-sm font-medium">
                    {formatDateTime(complaint.slaDueDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned To */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Assigned To</CardTitle>
            </CardHeader>
            <CardContent>
              {complaint.assignedTo ? (
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={complaint.assignedTo.avatar || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(complaint.assignedTo.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{complaint.assignedTo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {complaint.assignedTo.designation}
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsAssignDialogOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Reporter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Reporter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-muted">
                    {getInitials(complaint.reporterName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{complaint.reporterName}</p>
                </div>
              </div>
              {complaint.reporterEmail && (
                <p className="text-sm text-muted-foreground">
                  {complaint.reporterEmail}
                </p>
              )}
              {complaint.reporterPhone && (
                <p className="text-sm text-muted-foreground">
                  {complaint.reporterPhone}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Complaint</DialogTitle>
            <DialogDescription>
              Select a team member to assign this complaint to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Amit Singh (Technician)</SelectItem>
                <SelectItem value="2">Suresh Reddy (Technician)</SelectItem>
                <SelectItem value="3">Priya Sharma (Executive)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAssignDialogOpen(false)}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
