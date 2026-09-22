/**
 * Authentication configuration and role management for Paithan Municipal Council Admin CMS
 * Follows rules.md §9 (role-based access) with demo credentials for municipal operators.
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

export const DEMO_ADMIN_USERS: Record<string, AdminUser> = {
  superadmin: {
    id: "usr-co-01",
    name: "Santosh Dagdu Agle",
    email: "chief.officer@paithan.gov.in",
    role: "SUPER_ADMIN",
    roleTitle: "Chief Officer (मुख्याधिकारी)",
    department: "Executive Directorate",
  },
  editor: {
    id: "usr-ed-01",
    name: "Rameshwar Jadhav",
    email: "tenders@paithan.gov.in",
    role: "EDITOR",
    roleTitle: "Municipal Circular & Tender Editor",
    department: "Administration & Procurement",
  },
  wardofficer: {
    id: "usr-wo-01",
    name: "Pravin Kulkarni",
    email: "ward.works@paithan.gov.in",
    role: "WARD_EDITOR",
    roleTitle: "Ward Works Field Officer",
    department: "Civil Engineering & Water Supply",
    ward: 1,
  },
};

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {},
};
