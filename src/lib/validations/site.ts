import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required").max(100),
  code: z.string().min(1, "Company code is required").max(20).toUpperCase(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const siteSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  name: z.string().min(1, "Site name is required").max(100),
  code: z.string().min(1, "Site code is required").max(20).toUpperCase(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().default("Asia/Kolkata"),
  isActive: z.boolean().default(true),
});

export const buildingSchema = z.object({
  siteId: z.string().min(1, "Site is required"),
  name: z.string().min(1, "Building name is required").max(100),
  code: z.string().min(1, "Building code is required").max(20).toUpperCase(),
  address: z.string().optional(),
  floors: z.number().int().min(1).default(1),
  isActive: z.boolean().default(true),
});

export const floorSchema = z.object({
  buildingId: z.string().min(1, "Building is required"),
  name: z.string().min(1, "Floor name is required").max(100),
  code: z.string().min(1, "Floor code is required").max(20).toUpperCase(),
  level: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const zoneSchema = z.object({
  floorId: z.string().min(1, "Floor is required"),
  name: z.string().min(1, "Zone name is required").max(100),
  code: z.string().min(1, "Zone code is required").max(20).toUpperCase(),
  isActive: z.boolean().default(true),
});

export const areaSchema = z.object({
  zoneId: z.string().min(1, "Zone is required"),
  areaTypeId: z.string().min(1, "Area type is required"),
  name: z.string().min(1, "Area name is required").max(100),
  code: z.string().min(1, "Area code is required").max(20).toUpperCase(),
  sqft: z.number().min(0).optional(),
  capacity: z.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
});

export const areaTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  defaultFrequency: z.enum(["hourly", "daily", "weekly", "monthly"]).optional(),
  defaultCleaningTime: z.number().int().min(1).optional(),
  isActive: z.boolean().default(true),
});

export type CompanyInput = z.infer<typeof companySchema>;
export type SiteInput = z.infer<typeof siteSchema>;
export type BuildingInput = z.infer<typeof buildingSchema>;
export type FloorInput = z.infer<typeof floorSchema>;
export type ZoneInput = z.infer<typeof zoneSchema>;
export type AreaInput = z.infer<typeof areaSchema>;
export type AreaTypeInput = z.infer<typeof areaTypeSchema>;
