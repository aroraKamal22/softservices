import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  Brush,
  ClipboardCheck,
  MessageSquare,
  Briefcase,
  Warehouse,
  Wrench,
  AlertTriangle,
  GraduationCap,
  FileText,
  Bell,
  BarChart3,
  Settings,
  HandshakeIcon,
  Package,
  CalendarClock,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Sites",
        href: "/sites",
        icon: Building2,
        permission: "sites:read",
      },
      {
        title: "Employees",
        href: "/employees",
        icon: Users,
        permission: "employees:read",
      },
      {
        title: "Attendance",
        href: "/attendance",
        icon: Calendar,
        permission: "attendance:read",
      },
      {
        title: "Housekeeping",
        href: "/housekeeping",
        icon: Brush,
        permission: "housekeeping:read",
      },
      {
        title: "Inspections",
        href: "/inspections",
        icon: ClipboardCheck,
        permission: "inspections:read",
      },
    ],
  },
  {
    title: "Service Desk",
    items: [
      {
        title: "Complaints",
        href: "/complaints",
        icon: MessageSquare,
        permission: "complaints:read",
      },
      {
        title: "Work Orders",
        href: "/work-orders",
        icon: Wrench,
        permission: "work-orders:read",
      },
      {
        title: "Incidents",
        href: "/incidents",
        icon: AlertTriangle,
        permission: "incidents:read",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Clients",
        href: "/clients",
        icon: Briefcase,
        permission: "clients:read",
      },
      {
        title: "Vendors",
        href: "/vendors",
        icon: HandshakeIcon,
        permission: "vendors:read",
      },
      {
        title: "AMC",
        href: "/amc",
        icon: Shield,
        permission: "amc:read",
      },
      {
        title: "Inventory",
        href: "/inventory",
        icon: Package,
        permission: "inventory:read",
      },
    ],
  },
  {
    title: "Front Desk",
    items: [
      {
        title: "Meeting Rooms",
        href: "/meeting-rooms",
        icon: CalendarClock,
        permission: "meeting-rooms:read",
      },
      {
        title: "Events",
        href: "/events",
        icon: CalendarClock,
        permission: "events:read",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Training",
        href: "/training",
        icon: GraduationCap,
        permission: "training:read",
      },
      {
        title: "Documents",
        href: "/documents",
        icon: FileText,
        permission: "documents:read",
      },
      {
        title: "Shift Handover",
        href: "/handover",
        icon: HandshakeIcon,
        permission: "handover:read",
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
        permission: "reports:read",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        permission: "settings:read",
      },
    ],
  },
];
