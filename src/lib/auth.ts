import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      roles: string[];
      permissions: string[];
      siteAccess: Array<{ siteId: string; siteName: string; isDefault: boolean }>;
      currentSiteId?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    roles: string[];
    permissions: string[];
    siteAccess: Array<{ siteId: string; siteName: string; isDefault: boolean }>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    permissions: string[];
    siteAccess: Array<{ siteId: string; siteName: string; isDefault: boolean }>;
    currentSiteId?: string;
  }
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Demo user for testing without database
const DEMO_USER = {
  id: "demo-user-001",
  email: "admin@softservices.com",
  name: "Admin User",
  password: "admin123",
  roles: ["Super Admin"],
  permissions: [
    "dashboard:read",
    "users:manage",
    "roles:manage",
    "sites:manage",
    "employees:manage",
    "attendance:manage",
    "housekeeping:manage",
    "inspections:manage",
    "complaints:manage",
    "clients:manage",
    "vendors:manage",
    "inventory:manage",
    "reports:read",
    "settings:read",
  ],
  siteAccess: [
    { siteId: "site-001", siteName: "Main Office", isDefault: true },
    { siteId: "site-002", siteName: "Branch Office", isDefault: false },
  ],
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);

          const trimmedEmail = email.trim().toLowerCase();
          const trimmedPassword = password.trim();

          // Demo mode: check against hardcoded demo user
          if (trimmedEmail === DEMO_USER.email.toLowerCase() && trimmedPassword === DEMO_USER.password) {
            return {
              id: DEMO_USER.id,
              email: DEMO_USER.email,
              name: DEMO_USER.name,
              roles: DEMO_USER.roles,
              permissions: DEMO_USER.permissions,
              siteAccess: DEMO_USER.siteAccess,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.siteAccess = user.siteAccess;
        token.currentSiteId =
          user.siteAccess.find((s) => s.isDefault)?.siteId ||
          user.siteAccess[0]?.siteId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as string[];
        session.user.permissions = token.permissions as string[];
        session.user.siteAccess = token.siteAccess as Array<{
          siteId: string;
          siteName: string;
          isDefault: boolean;
        }>;
        session.user.currentSiteId = token.currentSiteId as string;
      }
      return session;
    },
  },
};

// Helper function to check permissions
export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  return userPermissions.includes(requiredPermission);
}

// Helper function to check roles
export function hasRole(userRoles: string[], requiredRole: string): boolean {
  return userRoles.includes(requiredRole);
}

// Helper function to check if user is admin
export function isAdmin(userRoles: string[]): boolean {
  return userRoles.some((role) =>
    ["Super Admin", "Admin"].includes(role)
  );
}
