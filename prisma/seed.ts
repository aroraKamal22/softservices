import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create Permissions
  const permissions = [
    // Users
    { name: "users:create", module: "users", action: "create", description: "Create users" },
    { name: "users:read", module: "users", action: "read", description: "View users" },
    { name: "users:update", module: "users", action: "update", description: "Update users" },
    { name: "users:delete", module: "users", action: "delete", description: "Delete users" },
    { name: "users:manage", module: "users", action: "manage", description: "Manage all user settings" },

    // Sites
    { name: "sites:create", module: "sites", action: "create", description: "Create sites" },
    { name: "sites:read", module: "sites", action: "read", description: "View sites" },
    { name: "sites:update", module: "sites", action: "update", description: "Update sites" },
    { name: "sites:delete", module: "sites", action: "delete", description: "Delete sites" },

    // Employees
    { name: "employees:create", module: "employees", action: "create", description: "Create employees" },
    { name: "employees:read", module: "employees", action: "read", description: "View employees" },
    { name: "employees:update", module: "employees", action: "update", description: "Update employees" },
    { name: "employees:delete", module: "employees", action: "delete", description: "Delete employees" },

    // Attendance
    { name: "attendance:create", module: "attendance", action: "create", description: "Mark attendance" },
    { name: "attendance:read", module: "attendance", action: "read", description: "View attendance" },
    { name: "attendance:update", module: "attendance", action: "update", description: "Update attendance" },
    { name: "attendance:delete", module: "attendance", action: "delete", description: "Delete attendance" },

    // Housekeeping
    { name: "housekeeping:create", module: "housekeeping", action: "create", description: "Create tasks" },
    { name: "housekeeping:read", module: "housekeeping", action: "read", description: "View tasks" },
    { name: "housekeeping:update", module: "housekeeping", action: "update", description: "Update tasks" },
    { name: "housekeeping:delete", module: "housekeeping", action: "delete", description: "Delete tasks" },

    // Inspections
    { name: "inspections:create", module: "inspections", action: "create", description: "Create inspections" },
    { name: "inspections:read", module: "inspections", action: "read", description: "View inspections" },
    { name: "inspections:update", module: "inspections", action: "update", description: "Update inspections" },
    { name: "inspections:delete", module: "inspections", action: "delete", description: "Delete inspections" },

    // Complaints
    { name: "complaints:create", module: "complaints", action: "create", description: "Create complaints" },
    { name: "complaints:read", module: "complaints", action: "read", description: "View complaints" },
    { name: "complaints:update", module: "complaints", action: "update", description: "Update complaints" },
    { name: "complaints:delete", module: "complaints", action: "delete", description: "Delete complaints" },

    // Clients
    { name: "clients:create", module: "clients", action: "create", description: "Create clients" },
    { name: "clients:read", module: "clients", action: "read", description: "View clients" },
    { name: "clients:update", module: "clients", action: "update", description: "Update clients" },
    { name: "clients:delete", module: "clients", action: "delete", description: "Delete clients" },

    // Vendors
    { name: "vendors:create", module: "vendors", action: "create", description: "Create vendors" },
    { name: "vendors:read", module: "vendors", action: "read", description: "View vendors" },
    { name: "vendors:update", module: "vendors", action: "update", description: "Update vendors" },
    { name: "vendors:delete", module: "vendors", action: "delete", description: "Delete vendors" },

    // AMC
    { name: "amc:create", module: "amc", action: "create", description: "Create AMC" },
    { name: "amc:read", module: "amc", action: "read", description: "View AMC" },
    { name: "amc:update", module: "amc", action: "update", description: "Update AMC" },
    { name: "amc:delete", module: "amc", action: "delete", description: "Delete AMC" },

    // Inventory
    { name: "inventory:create", module: "inventory", action: "create", description: "Create inventory" },
    { name: "inventory:read", module: "inventory", action: "read", description: "View inventory" },
    { name: "inventory:update", module: "inventory", action: "update", description: "Update inventory" },
    { name: "inventory:delete", module: "inventory", action: "delete", description: "Delete inventory" },

    // Work Orders
    { name: "work-orders:create", module: "work-orders", action: "create", description: "Create work orders" },
    { name: "work-orders:read", module: "work-orders", action: "read", description: "View work orders" },
    { name: "work-orders:update", module: "work-orders", action: "update", description: "Update work orders" },
    { name: "work-orders:delete", module: "work-orders", action: "delete", description: "Delete work orders" },

    // Incidents
    { name: "incidents:create", module: "incidents", action: "create", description: "Create incidents" },
    { name: "incidents:read", module: "incidents", action: "read", description: "View incidents" },
    { name: "incidents:update", module: "incidents", action: "update", description: "Update incidents" },
    { name: "incidents:delete", module: "incidents", action: "delete", description: "Delete incidents" },

    // Training
    { name: "training:create", module: "training", action: "create", description: "Create training" },
    { name: "training:read", module: "training", action: "read", description: "View training" },
    { name: "training:update", module: "training", action: "update", description: "Update training" },
    { name: "training:delete", module: "training", action: "delete", description: "Delete training" },

    // Documents
    { name: "documents:create", module: "documents", action: "create", description: "Create documents" },
    { name: "documents:read", module: "documents", action: "read", description: "View documents" },
    { name: "documents:update", module: "documents", action: "update", description: "Update documents" },
    { name: "documents:delete", module: "documents", action: "delete", description: "Delete documents" },

    // Reports
    { name: "reports:create", module: "reports", action: "create", description: "Create reports" },
    { name: "reports:read", module: "reports", action: "read", description: "View reports" },

    // Settings
    { name: "settings:read", module: "settings", action: "read", description: "View settings" },
    { name: "settings:update", module: "settings", action: "update", description: "Update settings" },

    // Roles
    { name: "roles:manage", module: "roles", action: "manage", description: "Manage roles" },

    // Meeting Rooms
    { name: "meeting-rooms:create", module: "meeting-rooms", action: "create", description: "Create meeting rooms" },
    { name: "meeting-rooms:read", module: "meeting-rooms", action: "read", description: "View meeting rooms" },
    { name: "meeting-rooms:update", module: "meeting-rooms", action: "update", description: "Update meeting rooms" },
    { name: "meeting-rooms:delete", module: "meeting-rooms", action: "delete", description: "Delete meeting rooms" },

    // Events
    { name: "events:create", module: "events", action: "create", description: "Create events" },
    { name: "events:read", module: "events", action: "read", description: "View events" },
    { name: "events:update", module: "events", action: "update", description: "Update events" },
    { name: "events:delete", module: "events", action: "delete", description: "Delete events" },

    // Handover
    { name: "handover:create", module: "handover", action: "create", description: "Create handover" },
    { name: "handover:read", module: "handover", action: "read", description: "View handover" },
    { name: "handover:update", module: "handover", action: "update", description: "Update handover" },
  ];

  console.log("Creating permissions...");
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }
  console.log(`Created ${permissions.length} permissions`);

  // Create Roles
  const roles = [
    {
      name: "Super Admin",
      description: "Full system access with all permissions",
      isSystem: true,
    },
    {
      name: "Admin",
      description: "Administrative access with most permissions",
      isSystem: true,
    },
    {
      name: "Facility Manager",
      description: "Facility management access",
      isSystem: true,
    },
    {
      name: "Assistant Facility Manager",
      description: "Assistant facility management access",
      isSystem: true,
    },
    {
      name: "Executive",
      description: "Executive level access",
      isSystem: true,
    },
    {
      name: "Supervisor",
      description: "Supervisory access",
      isSystem: true,
    },
    {
      name: "Staff",
      description: "Staff level access",
      isSystem: true,
    },
    {
      name: "Client",
      description: "Client portal access",
      isSystem: true,
    },
  ];

  console.log("Creating roles...");
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log(`Created ${roles.length} roles`);

  // Assign all permissions to Super Admin
  console.log("Assigning permissions to Super Admin...");
  const superAdminRole = await prisma.role.findUnique({
    where: { name: "Super Admin" },
  });

  if (superAdminRole) {
    const allPermissions = await prisma.permission.findMany();
    for (const perm of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: superAdminRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: superAdminRole.id,
          permissionId: perm.id,
        },
      });
    }
    console.log(`Assigned ${allPermissions.length} permissions to Super Admin`);
  }

  // Create default Company
  console.log("Creating default company...");
  const company = await prisma.company.upsert({
    where: { code: "DEMO" },
    update: {},
    create: {
      name: "Demo Company",
      code: "DEMO",
      address: "123 Business Park, Tech City",
      phone: "+91 9876543210",
      email: "info@democompany.com",
    },
  });

  // Create default Site
  console.log("Creating default site...");
  const site = await prisma.site.upsert({
    where: { code: "SITE001" },
    update: {},
    create: {
      companyId: company.id,
      name: "Main Office",
      code: "SITE001",
      address: "123 Business Park",
      city: "Tech City",
      state: "Maharashtra",
      country: "India",
      pincode: "400001",
      phone: "+91 9876543210",
      email: "mainoffice@democompany.com",
    },
  });

  // Create Building, Floor, Zone, Area
  console.log("Creating building structure...");
  const building = await prisma.building.upsert({
    where: {
      siteId_code: {
        siteId: site.id,
        code: "BLDG-A",
      },
    },
    update: {},
    create: {
      siteId: site.id,
      name: "Building A",
      code: "BLDG-A",
      floors: 5,
    },
  });

  const floor = await prisma.floor.upsert({
    where: {
      buildingId_code: {
        buildingId: building.id,
        code: "GF",
      },
    },
    update: {},
    create: {
      buildingId: building.id,
      name: "Ground Floor",
      code: "GF",
      level: 0,
    },
  });

  const zone = await prisma.zone.upsert({
    where: {
      floorId_code: {
        floorId: floor.id,
        code: "LOBBY",
      },
    },
    update: {},
    create: {
      floorId: floor.id,
      name: "Lobby Area",
      code: "LOBBY",
    },
  });

  // Create Area Types
  console.log("Creating area types...");
  const areaTypes = [
    { name: "Reception", description: "Reception and lobby areas", defaultFrequency: "hourly", defaultCleaningTime: 15 },
    { name: "Office Space", description: "General office areas", defaultFrequency: "daily", defaultCleaningTime: 30 },
    { name: "Conference Room", description: "Meeting and conference rooms", defaultFrequency: "daily", defaultCleaningTime: 20 },
    { name: "Restroom", description: "Washrooms and toilets", defaultFrequency: "hourly", defaultCleaningTime: 15 },
    { name: "Pantry", description: "Kitchen and pantry areas", defaultFrequency: "daily", defaultCleaningTime: 25 },
    { name: "Parking", description: "Parking areas", defaultFrequency: "weekly", defaultCleaningTime: 60 },
    { name: "Common Area", description: "Common and circulation areas", defaultFrequency: "daily", defaultCleaningTime: 20 },
    { name: "Server Room", description: "IT and server rooms", defaultFrequency: "weekly", defaultCleaningTime: 30 },
  ];

  for (const areaType of areaTypes) {
    await prisma.areaType.upsert({
      where: { name: areaType.name },
      update: {},
      create: areaType,
    });
  }
  console.log(`Created ${areaTypes.length} area types`);

  // Create an Area
  const receptionType = await prisma.areaType.findUnique({
    where: { name: "Reception" },
  });

  if (receptionType) {
    await prisma.area.upsert({
      where: {
        zoneId_code: {
          zoneId: zone.id,
          code: "MAIN-LOBBY",
        },
      },
      update: {},
      create: {
        zoneId: zone.id,
        areaTypeId: receptionType.id,
        name: "Main Lobby",
        code: "MAIN-LOBBY",
        sqft: 500,
      },
    });
  }

  // Create Departments
  console.log("Creating departments...");
  const departments = [
    { name: "Housekeeping", code: "HK" },
    { name: "Technical", code: "TECH" },
    { name: "Security", code: "SEC" },
    { name: "Front Desk", code: "FD" },
    { name: "Administration", code: "ADMIN" },
    { name: "Management", code: "MGMT" },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
  }
  console.log(`Created ${departments.length} departments`);

  // Create Designations
  console.log("Creating designations...");
  const designations = [
    { name: "Facility Manager", code: "FM", level: 5 },
    { name: "Assistant Facility Manager", code: "AFM", level: 4 },
    { name: "Supervisor", code: "SUP", level: 3 },
    { name: "Team Lead", code: "TL", level: 2 },
    { name: "Executive", code: "EXEC", level: 2 },
    { name: "Technician", code: "TECH", level: 1 },
    { name: "Housekeeping Staff", code: "HKS", level: 1 },
    { name: "Security Guard", code: "SG", level: 1 },
  ];

  for (const desig of designations) {
    await prisma.designation.upsert({
      where: { code: desig.code },
      update: {},
      create: desig,
    });
  }
  console.log(`Created ${designations.length} designations`);

  // Create Shifts
  console.log("Creating shifts...");
  const shifts = [
    { name: "Morning Shift", code: "MORNING", startTime: "06:00", endTime: "14:00" },
    { name: "General Shift", code: "GENERAL", startTime: "09:00", endTime: "18:00" },
    { name: "Evening Shift", code: "EVENING", startTime: "14:00", endTime: "22:00" },
    { name: "Night Shift", code: "NIGHT", startTime: "22:00", endTime: "06:00" },
  ];

  for (const shift of shifts) {
    await prisma.shift.upsert({
      where: {
        siteId_code: {
          siteId: site.id,
          code: shift.code,
        },
      },
      update: {},
      create: {
        siteId: site.id,
        ...shift,
      },
    });
  }
  console.log(`Created ${shifts.length} shifts`);

  // Create Complaint Categories
  console.log("Creating complaint categories...");
  const complaintCategories = [
    { name: "Housekeeping", code: "HK", slaHours: 4, priority: "medium" },
    { name: "Electrical", code: "ELEC", slaHours: 2, priority: "high" },
    { name: "Plumbing", code: "PLMB", slaHours: 2, priority: "high" },
    { name: "HVAC", code: "HVAC", slaHours: 4, priority: "high" },
    { name: "Civil", code: "CIVIL", slaHours: 24, priority: "medium" },
    { name: "Carpentry", code: "CARP", slaHours: 24, priority: "low" },
    { name: "Pest Control", code: "PEST", slaHours: 8, priority: "medium" },
    { name: "Security", code: "SEC", slaHours: 1, priority: "critical" },
    { name: "IT Support", code: "IT", slaHours: 4, priority: "medium" },
    { name: "Other", code: "OTHER", slaHours: 24, priority: "low" },
  ];

  for (const cat of complaintCategories) {
    await prisma.complaintCategory.upsert({
      where: { code: cat.code },
      update: {},
      create: cat,
    });
  }
  console.log(`Created ${complaintCategories.length} complaint categories`);

  // Create Inventory Categories
  console.log("Creating inventory categories...");
  const inventoryCategories = [
    { name: "Cleaning Supplies", code: "CLEAN" },
    { name: "Electrical Items", code: "ELEC" },
    { name: "Plumbing Items", code: "PLMB" },
    { name: "Stationery", code: "STAT" },
    { name: "Safety Equipment", code: "SAFETY" },
    { name: "PPE", code: "PPE" },
    { name: "Tools", code: "TOOLS" },
    { name: "Consumables", code: "CONS" },
  ];

  for (const cat of inventoryCategories) {
    await prisma.inventoryCategory.upsert({
      where: { code: cat.code },
      update: {},
      create: cat,
    });
  }
  console.log(`Created ${inventoryCategories.length} inventory categories`);

  // Create Admin User
  console.log("Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@softservices.com" },
    update: {},
    create: {
      email: "admin@softservices.com",
      password: hashedPassword,
      name: "System Administrator",
      phone: "+91 9876543210",
      isActive: true,
    },
  });

  // Assign Super Admin role to admin user
  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    });
  }

  // Give admin access to the site
  await prisma.userSiteAccess.upsert({
    where: {
      userId_siteId: {
        userId: adminUser.id,
        siteId: site.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      siteId: site.id,
      isDefault: true,
    },
  });

  console.log("Admin user created:");
  console.log("  Email: admin@softservices.com");
  console.log("  Password: admin123");

  // Create Notification Templates
  console.log("Creating notification templates...");
  const notificationTemplates = [
    {
      name: "complaint_created",
      type: "in-app",
      subject: "New Complaint Created",
      body: "A new complaint {{ticketNumber}} has been created: {{title}}",
      variables: JSON.parse('["ticketNumber", "title", "category", "priority"]'),
    },
    {
      name: "complaint_assigned",
      type: "in-app",
      subject: "Complaint Assigned",
      body: "Complaint {{ticketNumber}} has been assigned to you",
      variables: JSON.parse('["ticketNumber", "title", "assignedBy"]'),
    },
    {
      name: "complaint_resolved",
      type: "in-app",
      subject: "Complaint Resolved",
      body: "Complaint {{ticketNumber}} has been resolved",
      variables: JSON.parse('["ticketNumber", "title", "resolvedBy"]'),
    },
    {
      name: "sla_breach_warning",
      type: "in-app",
      subject: "SLA Breach Warning",
      body: "Complaint {{ticketNumber}} is approaching SLA deadline",
      variables: JSON.parse('["ticketNumber", "title", "slaDueDate"]'),
    },
    {
      name: "amc_expiry_warning",
      type: "in-app",
      subject: "AMC Expiry Warning",
      body: "AMC {{contractNumber}} for {{equipment}} expires on {{expiryDate}}",
      variables: JSON.parse('["contractNumber", "equipment", "expiryDate"]'),
    },
    {
      name: "low_stock_alert",
      type: "in-app",
      subject: "Low Stock Alert",
      body: "Item {{itemName}} is running low. Current stock: {{currentStock}}, Min stock: {{minStock}}",
      variables: JSON.parse('["itemName", "currentStock", "minStock"]'),
    },
  ];

  for (const template of notificationTemplates) {
    await prisma.notificationTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    });
  }
  console.log(`Created ${notificationTemplates.length} notification templates`);

  console.log("\nSeed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
