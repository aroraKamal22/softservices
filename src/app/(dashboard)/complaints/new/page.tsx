"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { complaintSchema, ComplaintInput } from "@/lib/validations/complaint";
import { toast } from "@/hooks/use-toast";

const sites = [
  { id: "1", name: "Main Office" },
  { id: "2", name: "Tech Hub" },
];

const categories = [
  { id: "1", name: "Housekeeping", code: "HK" },
  { id: "2", name: "Electrical", code: "ELEC" },
  { id: "3", name: "Plumbing", code: "PLMB" },
  { id: "4", name: "HVAC", code: "HVAC" },
  { id: "5", name: "Civil", code: "CIVIL" },
  { id: "6", name: "Security", code: "SEC" },
  { id: "7", name: "IT Support", code: "IT" },
  { id: "8", name: "Other", code: "OTHER" },
];

const areas = [
  { id: "1", name: "Main Lobby", building: "Building A" },
  { id: "2", name: "Conference Room A", building: "Building A" },
  { id: "3", name: "Conference Room B", building: "Building A" },
  { id: "4", name: "Open Office - Floor 1", building: "Building A" },
  { id: "5", name: "Cafeteria", building: "Building B" },
];

const assignees = [
  { id: "1", name: "Amit Singh", department: "Technical" },
  { id: "2", name: "Suresh Reddy", department: "Technical" },
  { id: "3", name: "Priya Sharma", department: "Housekeeping" },
  { id: "4", name: "Rajesh Kumar", department: "Housekeeping" },
];

export default function NewComplaintPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ComplaintInput>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      priority: "medium",
      source: "manual",
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ComplaintInput) => {
    setIsLoading(true);
    try {
      // API call would go here
      console.log("Creating complaint:", data, photos);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Complaint created",
        description: "The complaint has been logged successfully.",
      });

      router.push("/complaints");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/complaints">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Complaint</h1>
          <p className="text-muted-foreground">
            Log a new service request or complaint
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Complaint Details</CardTitle>
            <CardDescription>
              Describe the issue that needs attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteId">Site *</Label>
                <Select onValueChange={(value) => setValue("siteId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.siteId && (
                  <p className="text-sm text-destructive">{errors.siteId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select onValueChange={(value) => setValue("categoryId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="areaId">Area/Location</Label>
                <Select onValueChange={(value) => setValue("areaId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name} ({area.building})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  defaultValue="medium"
                  onValueChange={(value: "low" | "medium" | "high" | "critical") =>
                    setValue("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the problem..."
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Photos (Optional)</Label>
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload up to 5 photos (optional)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reporter Info */}
        <Card>
          <CardHeader>
            <CardTitle>Reporter Information</CardTitle>
            <CardDescription>
              Contact details of the person reporting (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="reporterName">Name</Label>
                <Input
                  id="reporterName"
                  placeholder="Reporter name"
                  {...register("reporterName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporterEmail">Email</Label>
                <Input
                  id="reporterEmail"
                  type="email"
                  placeholder="email@company.com"
                  {...register("reporterEmail")}
                />
                {errors.reporterEmail && (
                  <p className="text-sm text-destructive">
                    {errors.reporterEmail.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporterPhone">Phone</Label>
                <Input
                  id="reporterPhone"
                  placeholder="+91 9876543210"
                  {...register("reporterPhone")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
            <CardDescription>
              Optionally assign this complaint to a team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="assignedToId">Assign To</Label>
              <Select onValueChange={(value) => setValue("assignedToId", value)}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select team member (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/complaints">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Complaint"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
