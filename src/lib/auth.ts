import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { log } from "@/lib/logger";
import type { UserRole } from "@prisma/client";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      employeeId: string | null;
      nik?: string;
      department?: string;
      position?: string;
      profilePhoto?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    employeeId: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    employeeId: string | null;
    nik?: string;
    department?: string;
    position?: string;
    profilePhoto?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user with employee relations
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            employee: {
              select: {
                nik: true,
                firstName: true,
                lastName: true,
                department: { select: { name: true } },
                position: { select: { name: true } },
                profilePhoto: true,
              },
            },
          },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated. Please contact HR.");
        }

        // Verify password
        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // Return user object with all required fields
        return {
          id: user.id,
          email: user.email,
          name: user.employee
            ? `${user.employee.firstName} ${user.employee.lastName}`
            : user.email.split("@")[0],
          role: user.role,
          employeeId: user.employeeId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.employeeId = user.employeeId;

        // Get additional employee data on sign in
        if (user.employeeId) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
              employee: {
                select: {
                  nik: true,
                  department: { select: { name: true } },
                  position: { select: { name: true } },
                  profilePhoto: true,
                },
              },
            },
          });

          if (dbUser?.employee) {
            token.nik = dbUser.employee.nik ?? undefined;
            token.department = dbUser.employee.department?.name;
            token.position = dbUser.employee.position?.name;
            token.profilePhoto = dbUser.employee.profilePhoto ?? undefined;
          }
        }
      }

      // Handle session update
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.role) token.role = session.role;
      }

      return token;
    },
    async session({ session, token }) {
      // Return session with user data from token
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as UserRole,
          employeeId: token.employeeId as string | null,
          nik: token.nik as string | undefined,
          department: token.department as string | undefined,
          position: token.position as string | undefined,
          profilePhoto: token.profilePhoto as string | null | undefined,
        },
      };
    },
  },
  events: {
    async signIn({ user }) {
      log.audit("User signed in", {
        action: "SIGN_IN",
        userId: user.id,
      });
    },
    async signOut() {
      log.audit("User signed out", {
        action: "SIGN_OUT",
      });
    },
  },
});

// Role checking utilities
export const isAdmin = (role?: UserRole) => {
  return role === "ADMIN" || role === "SUPER_ADMIN";
};

export const isManager = (role?: UserRole) => {
  return role === "MANAGER" || isAdmin(role);
};

export const isEmployee = (role?: UserRole) => {
  return role === "EMPLOYEE";
};

export const canAccessHCService = (role?: UserRole) => {
  return isAdmin(role);
};

export const canApproveLeave = (role?: UserRole) => {
  return isManager(role) || isAdmin(role);
};

export const canManageEmployees = (role?: UserRole) => {
  return isAdmin(role);
};