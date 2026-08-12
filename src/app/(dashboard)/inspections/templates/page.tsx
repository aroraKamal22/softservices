"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  ClipboardCheck,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  GripVertical,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const initialTemplates = [
  {
    id: "1",
    name: "Daily Inspection",
    description: "Standard daily inspection checklist",
    category: "General",
    items: [
      "Floor cleanliness",
      "Dust on surfaces",
      "Trash bins emptied",
      "Glass and mirrors clean",
      "Air freshener present",
      "Supplies stocked",
      "Equipment stored properly",
      "No safety hazards",
      "Lighting working",
      "Temperature comfortable",
    ],
    isActive: true,
    usageCount: 156,
  },
  {
    id: "2",
    name: "Hourly Restroom Check",
    description: "Quick restroom inspection every hour",
    category: "Restroom",
    items: [
      "Floor dry and clean",
      "Toilets flushed and clean",
      "Sinks clean",
      "Soap dispensers filled",
      "Paper towels stocked",
      "Toilet paper stocked",
      "Trash emptied",
      "No odor",
    ],
    isActive: true,
    usageCount: 892,
  },
  {
    id: "3",
    name: "Deep Clean Verification",
    description: "Comprehensive deep cleaning verification",
    category: "Deep Cleaning",
    items: [
      "Floors scrubbed and polished",
      "Walls cleaned",
      "Ceiling vents cleaned",
      "Light fixtures cleaned",
      "Windows cleaned inside",
      "Furniture polished",
      "Carpet shampooed",
      "Behind furniture cleaned",
      "Baseboards wiped",
      "Air ducts checked",
      "Sanitization completed",
      "Disinfection of high-touch areas",
      "Upholstery cleaned",
      "Curtains/blinds cleaned",
      "Equipment deep cleaned",
    ],
    isActive: true,
    usageCount: 45,
  },
  {
    id: "4",
    name: "Kitchen/Pantry Audit",
    description: "Food area hygiene inspection",
    category: "Kitchen",
    items: [
      "Counters sanitized",
      "Appliances clean",
      "Refrigerator clean and organized",
      "Microwave clean",
      "Sink clean and draining",
      "Floor clean and dry",
      "Trash emptied",
      "No expired food",
      "Hand soap available",
      "Paper towels stocked",
      "No pest signs",
      "Food storage proper",
    ],
    isActive: true,
    usageCount: 78,
  },
  {
    id: "5",
    name: "Conference Room Setup",
    description: "Pre-meeting room inspection",
    category: "Conference Room",
    items: [
      "Table clean and dust-free",
      "Chairs arranged properly",
      "Whiteboard clean",
      "Markers available",
      "AV equipment working",
      "Trash emptied",
      "Floor clean",
      "Glass surfaces clean",
    ],
    isActive: false,
    usageCount: 234,
  },
];

const categories = ["General", "Restroom", "Deep Cleaning", "Kitchen", "Conference Room", "Office", "Lobby"];

export default function InspectionTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<typeof initialTemplates[0] | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "",
    items: [""],
  });

  const addItem = () => {
    setNewTemplate((prev) => ({
      ...prev,
      items: [...prev.items, ""],
    }));
  };

  const updateItem = (index: number, value: string) => {
    setNewTemplate((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeItem = (index: number) => {
    setNewTemplate((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const saveTemplate = () => {
    if (!newTemplate.name || !newTemplate.category) {
      toast({
        title: "Error",
        description: "Please fill in template name and category",
        variant: "destructive",
      });
      return;
    }

    const validItems = newTemplate.items.filter((item) => item.trim() !== "");
    if (validItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one inspection item",
        variant: "destructive",
      });
      return;
    }

    const template = {
      id: Date.now().toString(),
      ...newTemplate,
      items: validItems,
      isActive: true,
      usageCount: 0,
    };

    setTemplates((prev) => [...prev, template]);
    toast({
      title: "Template created",
      description: `${newTemplate.name} has been created successfully`,
    });
    setIsAddDialogOpen(false);
    setNewTemplate({
      name: "",
      description: "",
      category: "",
      items: [""],
    });
  };

  const toggleTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
    const template = templates.find((t) => t.id === id);
    toast({
      title: template?.isActive ? "Template deactivated" : "Template activated",
      description: `${template?.name} has been ${template?.isActive ? "deactivated" : "activated"}`,
    });
  };

  const duplicateTemplate = (template: typeof initialTemplates[0]) => {
    const newT = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      usageCount: 0,
    };
    setTemplates((prev) => [...prev, newT]);
    toast({
      title: "Template duplicated",
      description: `${template.name} has been duplicated`,
    });
  };

  const deleteTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: "Template deleted",
      description: `${template?.name} has been deleted`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/inspections">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inspection Templates</h1>
            <p className="text-muted-foreground">
              Manage inspection checklists and templates
            </p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Inspection Template</DialogTitle>
              <DialogDescription>
                Define a new inspection checklist template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Daily Inspection"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this template..."
                  value={newTemplate.description}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) =>
                    setNewTemplate({ ...newTemplate, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Inspection Items *</Label>
                <div className="space-y-2">
                  {newTemplate.items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex items-center">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        placeholder={`Item ${index + 1}`}
                        value={item}
                        onChange={(e) => updateItem(index, e.target.value)}
                      />
                      {newTemplate.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveTemplate}>Create Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {templates.filter((t) => t.isActive).length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">
                  {templates.reduce((acc, t) => acc + t.items.length, 0)}
                </p>
              </div>
              <Badge className="h-8 px-3">Items</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">
                  {templates.reduce((acc, t) => acc + t.usageCount, 0)}
                </p>
              </div>
              <Badge variant="secondary" className="h-8 px-3">Uses</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className={!template.isActive ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingTemplate(template)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicateTemplate(template)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{template.category}</Badge>
                  <Switch
                    checked={template.isActive}
                    onCheckedChange={() => toggleTemplate(template.id)}
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{template.items.length}</span> inspection items
                </div>

                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {template.items.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                  {template.items.length > 5 && (
                    <p className="text-xs text-muted-foreground pl-5">
                      +{template.items.length - 5} more items
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t flex justify-between text-sm">
                  <span className="text-muted-foreground">Used {template.usageCount} times</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/inspections/new?template=${template.id}`}>
                      Use Template
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
