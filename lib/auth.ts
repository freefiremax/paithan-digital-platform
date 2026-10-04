/**
 * Authentication configuration and role management for Paithan Municipal Council Admin CMS
 * Follows rules.md §9 (role-based access).
 */

export type AdminRole = "SUPER_ADMIN" | "EDITOR" | "WARD_EDITOR";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleTitle: string;
  department: string;
  ward?: number;
}

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {},
};
