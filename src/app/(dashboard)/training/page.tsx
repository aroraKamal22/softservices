"use client";

import { useState } from "react";
import {
  GraduationCap,
  Plus,
  Users,
  Clock,
  CheckCircle2,
  PlayCircle,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  UserPlus,
  Award,
  Calendar,
  BookOpen,
  Video,
  FileText,
  Search,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

interface Training {
  id: string;
  title: string;
  category: string;
  duration: string;
  enrolled: number;
  completed: number;
  status: "active" | "completed" | "draft";
  type: "video" | "document" | "live";
  instructor: string;
  description: string;
  startDate: string;
}

interface Participant {
  id: string;
  name: string;
  department: string;
  progress: number;
  status: "completed" | "in-progress" | "not-started";
  completedDate?: string;
}

const initialTrainings: Training[] = [
  { id: "1", title: "Safety Induction Training", category: "Safety", duration: "2 hours", enrolled: 25, completed: 18, status: "active", type: "video", instructor: "Priya Sharma", description: "Comprehensive safety training for new employees", startDate: "2024-01-01" },
  { id: "2", title: "Housekeeping Best Practices", category: "Operations", duration: "1.5 hours", enrolled: 40, completed: 35, status: "active", type: "video", instructor: "Rajesh Kumar", description: "Standard cleaning procedures and techniques", startDate: "2024-01-05" },
  { id: "3", title: "Fire Safety & Evacuation", category: "Safety", duration: "1 hour", enrolled: 100, completed: 95, status: "active", type: "live", instructor: "Fire Officer", description: "Emergency procedures and evacuation drills", startDate: "2024-01-10" },
  { id: "4", title: "Customer Service Excellence", category: "Soft Skills", duration: "3 hours", enrolled: 20, completed: 20, status: "completed", type: "video", instructor: "HR Team", description: "Communication and service skills", startDate: "2023-12-15" },
  { id: "5", title: "Equipment Handling", category: "Technical", duration: "2 hours", enrolled: 15, completed: 8, status: "active", type: "document", instructor: "Technical Lead", description: "Proper use and maintenance of equipment", startDate: "2024-01-08" },
  { id: "6", title: "First Aid Basics", category: "Safety", duration: "4 hours", enrolled: 0, completed: 0, status: "draft", type: "live", instructor: "Medical Officer", description: "Basic first aid and emergency response", startDate: "2024-02-01" },
];

const participants: Participant[] = [
  { id: "1", name: "Amit Singh", department: "Housekeeping", progress: 100, status: "completed", completedDate: "2024-01-12" },
  { id: "2", name: "Neha Patel", department: "Front Desk", progress: 75, status: "in-progress" },
  { id: "3", name: "Suresh Reddy", department: "Security", progress: 50, status: "in-progress" },
  { id: "4", name: "Kavita Joshi", department: "Admin", progress: 0, status: "not-started" },
  { id: "5", name: "Mohan Das", department: "Technical", progress: 100, status: "completed", completedDate: "2024-01-10" },
];

const categories = ["Safety", "Operations", "Technical", "Soft Skills", "Compliance"];
const employees = [
  { id: "1", name: "Amit Singh", department: "Housekeeping" },
  { id: "2", name: "Neha Patel", department: "Front Desk" },
  { id: "3", name: "Suresh Reddy", department: "Security" },
  { id: "4", name: "Kavita Joshi", department: "Admin" },
  { id: "5", name: "Mohan Das", department: "Technical" },
  { id: "6", name: "Rajesh Kumar", department: "Housekeeping" },
  { id: "7", name: "Priya Sharma", department: "Operations" },
];

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>(initialTrainings);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    type: "video",
    instructor: "",
    description: "",
    startDate: "",
  });

  const filteredTrainings = trainings.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: trainings.length,
    active: trainings.filter((t) => t.status === "active").length,
    totalEnrolled: trainings.reduce((a, t) => a + t.enrolled, 0),
    totalCompleted: trainings.reduce((a, t) => a + t.completed, 0),
    avgCompletion: Math.round(
      (trainings.reduce((a, t) => a + (t.enrolled > 0 ? (t.completed / t.enrolled) * 100 : 0), 0) /
        trainings.filter((t) => t.enrolled > 0).length) || 0
    ),
  };

  const resetForm = () => {
    setFormData({ title: "", category: "", duration: "", type: "video", instructor: "", description: "", startDate: "" });
  };

  const handleAdd = () => {
    if (!formData.title || !formData.category) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }

    const newTraining: Training = {
      id: Date.now().toString(),
      ...formData,
      enrolled: 0,
      completed: 0,
      status: "draft",
      type: formData.type as "video" | "document" | "live",
    };

    setTrainings((prev) => [newTraining, ...prev]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({ title: "Training Created", description: `${formData.title} has been created` });
  };

  const handleEdit = () => {
    if (selectedTraining) {
      setTrainings((prev) =>
        prev.map((t) =>
          t.id === selectedTraining.id
            ? { ...t, ...formData, type: formData.type as "video" | "document" | "live" }
            : t
        )
      );
      setIsEditDialogOpen(false);
      resetForm();
      toast({ title: "Training Updated", description: "Changes saved successfully" });
    }
  };

  const handleDelete = () => {
    if (selectedTraining) {
      setTrainings((prev) => prev.filter((t) => t.id !== selectedTraining.id));
      setIsDeleteDialogOpen(false);
      toast({ title: "Training Deleted", description: `${selectedTraining.title} has been deleted` });
    }
  };

  const handleEnroll = () => {
    if (selectedTraining && selectedEmployees.length > 0) {
      setTrainings((prev) =>
        prev.map((t) =>
          t.id === selectedTraining.id
            ? { ...t, enrolled: t.enrolled + selectedEmployees.length, status: "active" }
            : t
        )
      );
      setIsEnrollDialogOpen(false);
      setSelectedEmployees([]);
      toast({
        title: "Employees Enrolled",
        description: `${selectedEmployees.length} employees enrolled in ${selectedTraining.title}`,
      });
    }
  };

  const openEditDialog = (training: Training) => {
    setSelectedTraining(training);
    setFormData({
      title: training.title,
      category: training.category,
      duration: training.duration,
      type: training.type,
      instructor: training.instructor,
      description: training.description,
      startDate: training.startDate,
    });
    setIsEditDialogOpen(true);
  };

  const togglePublish = (training: Training) => {
    setTrainings((prev) =>
      prev.map((t) =>
        t.id === training.id
          ? { ...t, status: t.status === "draft" ? "active" : "draft" }
          : t
      )
    );
    toast({
      title: training.status === "draft" ? "Training Published" : "Training Unpublished",
      description: `${training.title} is now ${training.status === "draft" ? "active" : "draft"}`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "document": return <FileText className="h-4 w-4" />;
      case "live": return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Training</h1>
          <p className="text-muted-foreground">Employee training programs</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Training
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Programs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              </div>
              <PlayCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Enrolled</p>
                <p className="text-2xl font-bold">{stats.totalEnrolled}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalCompleted}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Completion</p>
                <p className="text-2xl font-bold">{stats.avgCompletion}%</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trainings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Trainings</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrainings.map((training) => (
              <Card key={training.id} className={training.status === "draft" ? "opacity-70" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(training.type)}
                      <Badge variant="outline">{training.category}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedTraining(training); setIsViewDialogOpen(true); }}>
                          <Eye className="mr-2 h-4 w-4" />View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(training)}>
                          <Edit className="mr-2 h-4 w-4" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedTraining(training); setIsEnrollDialogOpen(true); }}>
                          <UserPlus className="mr-2 h-4 w-4" />Enroll Employees
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePublish(training)}>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          {training.status === "draft" ? "Publish" : "Unpublish"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedTraining(training); setIsDeleteDialogOpen(true); }}>
                          <Trash2 className="mr-2 h-4 w-4" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-lg mt-2">{training.title}</CardTitle>
                  <CardDescription>{training.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{training.duration}</div>
                      <div className="flex items-center gap-1"><Users className="h-4 w-4" />{training.enrolled} enrolled</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Completion</span>
                      <span className="font-medium">{training.enrolled > 0 ? Math.round((training.completed / training.enrolled) * 100) : 0}%</span>
                    </div>
                    <Progress value={training.enrolled > 0 ? (training.completed / training.enrolled) * 100 : 0} className="h-2" />
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={training.status === "active" ? "success" : training.status === "completed" ? "default" : "secondary"}>
                        {training.status}
                      </Badge>
                      <Button size="sm" onClick={() => { setSelectedTraining(training); setIsEnrollDialogOpen(true); }}>
                        <UserPlus className="mr-2 h-4 w-4" />Enroll
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrainings.filter((t) => t.status === "active").map((training) => (
              <Card key={training.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(training.type)}
                    <Badge variant="outline">{training.category}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{training.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span><Clock className="inline h-4 w-4 mr-1" />{training.duration}</span>
                      <span><Users className="inline h-4 w-4 mr-1" />{training.enrolled}</span>
                    </div>
                    <Progress value={(training.completed / training.enrolled) * 100} className="h-2" />
                    <p className="text-sm text-center">{training.completed}/{training.enrolled} completed</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardContent className="pt-6">
              {filteredTrainings.filter((t) => t.status === "draft").length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No draft trainings</p>
              ) : (
                <div className="space-y-3">
                  {filteredTrainings.filter((t) => t.status === "draft").map((training) => (
                    <div key={training.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{training.title}</p>
                        <p className="text-sm text-muted-foreground">{training.category} • {training.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(training)}>
                          <Edit className="mr-2 h-4 w-4" />Edit
                        </Button>
                        <Button size="sm" onClick={() => togglePublish(training)}>
                          <PlayCircle className="mr-2 h-4 w-4" />Publish
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Training Participants</CardTitle>
              <CardDescription>Track employee training progress</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(p.name)}</AvatarFallback>
                          </Avatar>
                          <span>{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{p.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={p.progress} className="h-2 w-20" />
                          <span className="text-sm">{p.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.status === "completed" ? "success" : p.status === "in-progress" ? "warning" : "secondary"}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{p.completedDate || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(false); setIsEditDialogOpen(false); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? "Edit Training" : "Create Training"}</DialogTitle>
            <DialogDescription>{isEditDialogOpen ? "Update training details" : "Create a new training program"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Training title" />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="live">Live Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 2 hours" />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Instructor</Label>
              <Input value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} placeholder="Instructor name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Training description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setIsEditDialogOpen(false); }}>Cancel</Button>
            <Button onClick={isEditDialogOpen ? handleEdit : handleAdd}>{isEditDialogOpen ? "Save Changes" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTraining?.title}</DialogTitle>
          </DialogHeader>
          {selectedTraining && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded"><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{selectedTraining.category}</p></div>
                <div className="p-3 border rounded"><p className="text-sm text-muted-foreground">Duration</p><p className="font-medium">{selectedTraining.duration}</p></div>
                <div className="p-3 border rounded"><p className="text-sm text-muted-foreground">Type</p><p className="font-medium capitalize">{selectedTraining.type}</p></div>
                <div className="p-3 border rounded"><p className="text-sm text-muted-foreground">Instructor</p><p className="font-medium">{selectedTraining.instructor}</p></div>
              </div>
              <div className="p-3 border rounded"><p className="text-sm text-muted-foreground">Description</p><p>{selectedTraining.description}</p></div>
              <div className="p-3 border rounded">
                <div className="flex justify-between mb-2"><span>Progress</span><span>{Math.round((selectedTraining.completed / selectedTraining.enrolled) * 100 || 0)}%</span></div>
                <Progress value={(selectedTraining.completed / selectedTraining.enrolled) * 100 || 0} />
                <p className="text-sm text-center mt-2">{selectedTraining.completed} of {selectedTraining.enrolled} completed</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enroll Dialog */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Employees</DialogTitle>
            <DialogDescription>Select employees to enroll in {selectedTraining?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[300px] overflow-y-auto">
            {employees.map((emp) => (
              <div key={emp.id} className="flex items-center space-x-3 p-2 border rounded">
                <Checkbox
                  checked={selectedEmployees.includes(emp.id)}
                  onCheckedChange={(checked) => {
                    setSelectedEmployees((prev) =>
                      checked ? [...prev, emp.id] : prev.filter((id) => id !== emp.id)
                    );
                  }}
                />
                <Avatar className="h-8 w-8"><AvatarFallback>{getInitials(emp.name)}</AvatarFallback></Avatar>
                <div><p className="font-medium">{emp.name}</p><p className="text-xs text-muted-foreground">{emp.department}</p></div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEnroll} disabled={selectedEmployees.length === 0}>
              Enroll {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Training?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete "{selectedTraining?.title}". This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
