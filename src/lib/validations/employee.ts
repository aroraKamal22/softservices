import { z } from "zod";

export const employeeSchema = z.object({
  siteId: z.string().min(1, "Site is required"),
  departmentId: z.string().min(1, "Department is required"),
  designationId: z.string().min(1, "Designation is required"),
  employeeCode: z.string().min(1, "Employee code is required").max(20),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  dateOfJoining: z.date({ required_error: "Date of joining is required" }),
  gender: z.enum(["male", "female", "other"]).optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  aadharNumber: z.string().optional(),
  panNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  ifscCode: z.string().optional(),
  pfNumber: z.string().optional(),
  esiNumber: z.string().optional(),
  status: z.enum(["active", "inactive", "terminated"]).default("active"),
});

export const employeeDocumentSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  documentType: z.string().min(1, "Document type is required"),
  documentNumber: z.string().optional(),
  expiryDate: z.date().optional(),
});

export const leaveSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  leaveType: z.enum(["casual", "sick", "earned", "unpaid"]),
  fromDate: z.date({ required_error: "From date is required" }),
  toDate: z.date({ required_error: "To date is required" }),
  reason: z.string().optional(),
}).refine((data) => data.toDate >= data.fromDate, {
  message: "To date must be after from date",
  path: ["toDate"],
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeDocumentInput = z.infer<typeof employeeDocumentSchema>;
export type LeaveInput = z.infer<typeof leaveSchema>;
