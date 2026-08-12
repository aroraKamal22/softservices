"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Upload,
  X,
  MapPin,
} from "lucide-react";
import { z } from "zod";

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

const qrComplaintSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  reporterName: z.string().min(1, "Name is required"),
  reporterPhone: z.string().min(10, "Valid phone number required"),
  reporterEmail: z.string().email("Invalid email").optional().or(z.literal("")),
});

type QRComplaintInput = z.infer<typeof qrComplaintSchema>;

const categories = [
  "Housekeeping",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Civil",
  "Security",
  "IT Support",
  "Other",
];

// Mock QR code data
const qrData = {
  code: "QR-LOBBY-001",
  site: "Main Office",
  area: "Main Lobby",
  building: "Building A",
  floor: "Ground Floor",
  isActive: true,
};

export default function QRComplaintPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QRComplaintInput>({
    resolver: zodResolver(qrComplaintSchema),
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 3));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: QRComplaintInput) => {
    setIsLoading(true);
    try {
      // API call would go here
      console.log("QR Complaint:", { ...data, qrCode: params.code, photos });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock ticket number
      setTicketNumber("TKT-2024-123");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting complaint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full dark:bg-green-900">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Complaint Submitted</h2>
            <p className="text-muted-foreground mb-4">
              Your complaint has been registered successfully.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">Ticket Number</p>
              <p className="text-2xl font-mono font-bold text-primary">
                {ticketNumber}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Please save this ticket number for future reference. Our team will
              address your complaint shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Report an Issue</h1>
          <p className="text-muted-foreground text-sm">
            Quick complaint submission
          </p>
        </div>

        {/* Location Card */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{qrData.area}</p>
                <p className="text-sm text-muted-foreground">
                  {qrData.building}, {qrData.floor} | {qrData.site}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaint Form */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Complaint Details</CardTitle>
            <CardDescription>
              Please provide details about the issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
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
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
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
                  placeholder="Please describe the issue in detail..."
                  rows={3}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Photos (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-0.5 right-0.5 p-0.5 bg-destructive text-white rounded-full"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 3 && (
                    <label className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="font-medium mb-3 text-sm">Your Contact Details</p>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="reporterName">Name *</Label>
                    <Input
                      id="reporterName"
                      placeholder="Your name"
                      {...register("reporterName")}
                    />
                    {errors.reporterName && (
                      <p className="text-sm text-destructive">
                        {errors.reporterName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="reporterPhone">Phone *</Label>
                      <Input
                        id="reporterPhone"
                        type="tel"
                        placeholder="9876543210"
                        {...register("reporterPhone")}
                      />
                      {errors.reporterPhone && (
                        <p className="text-sm text-destructive">
                          {errors.reporterPhone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reporterEmail">Email</Label>
                      <Input
                        id="reporterEmail"
                        type="email"
                        placeholder="email@example.com"
                        {...register("reporterEmail")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground py-4">
          Soft Services Facility Management
        </p>
      </div>
    </div>
  );
}
