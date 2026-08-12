// User & Auth Types
export interface UserSession {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  siteAccess: SiteAccess[];
  currentSiteId?: string;
}

export interface SiteAccess {
  siteId: string;
  siteName: string;
  isDefault: boolean;
}

// Permission Types
export type PermissionAction = "create" | "read" | "update" | "delete" | "manage";

export interface Permission {
  module: string;
  action: PermissionAction;
}

// Common Types
export interface SelectOption {
  label: string;
  value: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Status Types
export type ComplaintStatus =
  | "open"
  | "assigned"
  | "in-progress"
  | "pending"
  | "resolved"
  | "closed"
  | "reopened";

export type Priority = "low" | "medium" | "high" | "critical";

export type AttendanceStatus =
  | "present"
  | "absent"
  | "half-day"
  | "late"
  | "leave";

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export type WorkOrderStatus =
  | "draft"
  | "issued"
  | "accepted"
  | "in-progress"
  | "completed"
  | "cancelled";

export type IncidentSeverity = "minor" | "moderate" | "major" | "critical";

// Form Types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: FormFieldError[];
}

// Dashboard Types
export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  openComplaints: number;
  pendingTasks: number;
  inspectionScore: number;
  upcomingAMCs: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Module-specific Types
export interface SiteInfo {
  id: string;
  name: string;
  code: string;
  companyName: string;
  address?: string;
  city?: string;
}

export interface EmployeeInfo {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  department: string;
  designation: string;
  phone: string;
  photo?: string;
}

export interface ComplaintInfo {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  priority: Priority;
  status: ComplaintStatus;
  createdAt: Date;
  slaDueDate?: Date;
  slaBreached: boolean;
}
