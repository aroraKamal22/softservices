import { z } from "zod";

export const complaintSchema = z.object({
  siteId: z.string().min(1, "Site is required"),
  categoryId: z.string().min(1, "Category is required"),
  areaId: z.string().optional(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  source: z.enum(["manual", "qr", "email", "phone", "portal"]).default("manual"),
  reporterName: z.string().optional(),
  reporterEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  reporterPhone: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const complaintUpdateSchema = z.object({
  status: z.enum([
    "open",
    "assigned",
    "in-progress",
    "pending",
    "resolved",
    "closed",
    "reopened",
  ]).optional(),
  assignedToId: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  resolution: z.string().optional(),
});

export const complaintCommentSchema = z.object({
  complaintId: z.string().min(1, "Complaint is required"),
  comment: z.string().min(1, "Comment is required"),
});

export const complaintCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  code: z.string().min(1, "Code is required").max(20).toUpperCase(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  slaHours: z.number().int().min(1).default(24),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  isActive: z.boolean().default(true),
});

export const slaConfigSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  responseTime: z.number().int().min(1),
  resolutionTime: z.number().int().min(1),
  escalationLevel1: z.number().int().min(1),
  escalationLevel2: z.number().int().min(1),
  escalationLevel3: z.number().int().min(1),
});

export type ComplaintInput = z.infer<typeof complaintSchema>;
export type ComplaintUpdateInput = z.infer<typeof complaintUpdateSchema>;
export type ComplaintCommentInput = z.infer<typeof complaintCommentSchema>;
export type ComplaintCategoryInput = z.infer<typeof complaintCategorySchema>;
export type SLAConfigInput = z.infer<typeof slaConfigSchema>;
