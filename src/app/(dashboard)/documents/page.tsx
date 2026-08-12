"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Search,
  Folder,
  Download,
  Eye,
  MoreHorizontal,
  Upload,
  Trash2,
  Edit,
  Share2,
  FolderPlus,
  File,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Filter,
  Grid,
  List,
  Clock,
  User,
  HardDrive,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}

const initialDocuments: Document[] = [
  { id: "1", name: "Employee Handbook 2024", category: "HR", type: "PDF", size: "2.5 MB", uploadedBy: "Admin", uploadedAt: "2024-01-10", description: "Complete employee guidelines and policies" },
  { id: "2", name: "Safety Guidelines", category: "Safety", type: "PDF", size: "1.2 MB", uploadedBy: "Safety Officer", uploadedAt: "2024-01-08", description: "Workplace safety procedures" },
  { id: "3", name: "Cleaning SOP", category: "Operations", type: "PDF", size: "856 KB", uploadedBy: "Operations", uploadedAt: "2024-01-05", description: "Standard operating procedures for cleaning" },
  { id: "4", name: "Vendor Contracts", category: "Legal", type: "PDF", size: "3.1 MB", uploadedBy: "Admin", uploadedAt: "2024-01-02", description: "Active vendor agreements" },
  { id: "5", name: "Training Materials", category: "Training", type: "ZIP", size: "15.4 MB", uploadedBy: "HR", uploadedAt: "2024-01-01", description: "Training videos and documents" },
  { id: "6", name: "Emergency Procedures", category: "Safety", type: "PDF", size: "1.8 MB", uploadedBy: "Safety Officer", uploadedAt: "2023-12-28", description: "Emergency response guidelines" },
  { id: "7", name: "Floor Plans", category: "Operations", type: "PNG", size: "4.2 MB", uploadedBy: "Facilities", uploadedAt: "2023-12-20", description: "Building floor layouts" },
  { id: "8", name: "Inventory List", category: "Operations", type: "XLSX", size: "245 KB", uploadedBy: "Stores", uploadedAt: "2023-12-15", description: "Current inventory spreadsheet" },
  { id: "9", name: "Leave Policy", category: "HR", type: "PDF", size: "320 KB", uploadedBy: "HR", uploadedAt: "2023-12-10", description: "Leave rules and procedures" },
  { id: "10", name: "Client Presentations", category: "Marketing", type: "PPTX", size: "8.5 MB", uploadedBy: "Sales", uploadedAt: "2023-12-05", description: "Sales presentations" },
];

const categories = [
  { name: "All", icon: Folder },
  { name: "HR", icon: Folder },
  { name: "Safety", icon: Folder },
  { name: "Operations", icon: Folder },
  { name: "Legal", icon: Folder },
  { name: "Training", icon: Folder },
  { name: "Marketing", icon: Folder },
];

const getFileIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case "PDF":
      return <FileText className="h-8 w-8 text-red-500" />;
    case "PNG":
    case "JPG":
    case "JPEG":
      return <FileImage className="h-8 w-8 text-blue-500" />;
    case "XLSX":
    case "XLS":
    case "CSV":
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    case "ZIP":
    case "RAR":
      return <FileArchive className="h-8 w-8 text-yellow-600" />;
    default:
      return <File className="h-8 w-8 text-gray-500" />;
  }
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadForm, setUploadForm] = useState({ name: "", category: "", description: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryCounts = () => {
    const counts: Record<string, number> = { All: documents.length };
    documents.forEach((doc) => {
      counts[doc.category] = (counts[doc.category] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadForm((prev) => ({
        ...prev,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
      }));
    }
  };

  const handleUpload = () => {
    if (!uploadForm.name || !uploadForm.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      name: uploadForm.name,
      category: uploadForm.category,
      type: selectedFile?.name.split(".").pop()?.toUpperCase() || "PDF",
      size: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "0 KB",
      uploadedBy: "Current User",
      uploadedAt: new Date().toISOString().split("T")[0],
      description: uploadForm.description,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setIsUploadDialogOpen(false);
    setUploadForm({ name: "", category: "", description: "" });
    setSelectedFile(null);

    toast({
      title: "Document Uploaded",
      description: `${newDoc.name} has been uploaded successfully`,
    });
  };

  const handleDownload = (doc: Document) => {
    // Create a demo file content
    const content = `This is a demo download for: ${doc.name}\n\nCategory: ${doc.category}\nType: ${doc.type}\nSize: ${doc.size}\nUploaded by: ${doc.uploadedBy}\nDate: ${doc.uploadedAt}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.name}.${doc.type.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `${doc.name} is being downloaded`,
    });
  };

  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
    setIsPreviewDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedDocument) {
      setDocuments((prev) => prev.filter((d) => d.id !== selectedDocument.id));
      toast({
        title: "Document Deleted",
        description: `${selectedDocument.name} has been deleted`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedDocument(null);
    }
  };

  const handleEdit = () => {
    if (selectedDocument) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === selectedDocument.id
            ? { ...d, name: uploadForm.name || d.name, description: uploadForm.description || d.description }
            : d
        )
      );
      toast({
        title: "Document Updated",
        description: "Changes have been saved",
      });
      setIsEditDialogOpen(false);
      setSelectedDocument(null);
      setUploadForm({ name: "", category: "", description: "" });
    }
  };

  const handleShare = (doc: Document) => {
    navigator.clipboard.writeText(`Document: ${doc.name} - Shared from Soft Services ERP`);
    toast({
      title: "Link Copied",
      description: "Document link has been copied to clipboard",
    });
  };

  const openEditDialog = (doc: Document) => {
    setSelectedDocument(doc);
    setUploadForm({ name: doc.name, category: doc.category, description: doc.description || "" });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDeleteDialogOpen(true);
  };

  const totalSize = documents.reduce((acc, doc) => {
    const size = parseFloat(doc.size);
    const unit = doc.size.includes("MB") ? 1 : 0.001;
    return acc + size * unit;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Document management system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
              </div>
              <Folder className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{totalSize.toFixed(1)} MB</p>
              </div>
              <HardDrive className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {documents.filter((d) => d.uploadedAt.startsWith("2024-01")).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        {/* Sidebar - Categories */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <Button
                  key={cat.name}
                  variant={isSelected ? "secondary" : "ghost"}
                  className="w-full justify-between"
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {cat.name}
                  </span>
                  <Badge variant="outline">{categoryCounts[cat.name] || 0}</Badge>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-5 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="zip">Archives</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Documents */}
          {viewMode === "list" ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.type)}
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.category}</Badge>
                        </TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {doc.uploadedBy}
                          </div>
                        </TableCell>
                        <TableCell>{doc.uploadedAt}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleView(doc)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleShare(doc)}>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(doc)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => openDeleteDialog(doc)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      {getFileIcon(doc.type)}
                      <p className="font-medium mt-3 line-clamp-1">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size} • {doc.type}</p>
                      <Badge variant="outline" className="mt-2">{doc.category}</Badge>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleView(doc)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openDeleteDialog(doc)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a new document to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
              />
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              {selectedFile ? (
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PDF, DOC, XLS, Images up to 50MB</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Document Name *</Label>
              <Input
                placeholder="Document name"
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Brief description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                {getFileIcon(selectedDocument.type)}
                <div className="flex-1">
                  <p className="font-medium text-lg">{selectedDocument.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedDocument.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 border rounded">
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedDocument.category}</p>
                </div>
                <div className="p-3 border rounded">
                  <p className="text-muted-foreground">File Type</p>
                  <p className="font-medium">{selectedDocument.type}</p>
                </div>
                <div className="p-3 border rounded">
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{selectedDocument.size}</p>
                </div>
                <div className="p-3 border rounded">
                  <p className="text-muted-foreground">Uploaded</p>
                  <p className="font-medium">{selectedDocument.uploadedAt}</p>
                </div>
              </div>
              <div className="p-3 border rounded">
                <p className="text-muted-foreground text-sm">Uploaded By</p>
                <p className="font-medium">{selectedDocument.uploadedBy}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedDocument && handleDownload(selectedDocument)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDocument?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
