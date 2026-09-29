"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Edit, X, Search, UserPlus, Key } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  EDITOR: "Editor",
  PUBLIC: "Public",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-red-50 text-red-800",
  EDITOR: "bg-amber-50 text-amber-800",
  PUBLIC: "bg-slate-50 text-slate-800",
};

interface User {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  wardId?: string | null;
  ward?: { id: string; number: number; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface Ward {
  id: string;
  number: number;
  name: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "PUBLIC",
    wardId: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, wardsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/wards"),
      ]);
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.data || []);
      }
      if (wardsRes.ok) setWards(await wardsRes.json());
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      await fetchData();
      if (!mounted) return;
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
    const matchesSearch =
      searchQuery === "" ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const action = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
      const method = editingUser ? "PATCH" : "POST";

      const body = editingUser
        ? { ...formData, password: formData.password || undefined }
        : formData;

      const res = await fetch(action, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Failed to save user");
      }

      setIsModalOpen(false);
      setEditingUser(null);
      resetForm();
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name || "",
      password: "",
      role: user.role,
      wardId: user.wardId || "",
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      password: "",
      role: "PUBLIC",
      wardId: "",
    });
  };

  const openCreateModal = () => {
    setEditingUser(null);
    resetForm();
    setShowPassword(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin/dashboard" },
          { label: "User Management" },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title="User Management"
          description="Manage admin users, editors, and ward officers. Only Admins can create, edit, or delete users and change roles."
        />

        {/* Filters */}
        <div className="border border-slate-200 bg-white p-4 sm:p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by email, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Administrator</option>
                <option value="EDITOR">Editor</option>
                <option value="PUBLIC">Public</option>
              </select>

              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-slate-700">No users match your filter criteria.</p>
              <p className="mt-1 text-xs text-slate-500">Try adjusting your filters or add a new user.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Ward</th>
                    <th className="py-3.5 px-4">Created</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900">{user.email}</div>
                        {user.name && (
                          <div className="text-[11px] text-slate-500">{user.name}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                            ROLE_COLORS[user.role] || "bg-slate-50 text-slate-800"
                          )}
                        >
                          {ROLE_LABELS[user.role] || user.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {user.ward ? (
                          <span className="text-[11px] font-semibold text-slate-700">
                            Ward {user.ward.number} — {user.ward.name}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.id !== "current-user-id" && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-base">
                  {editingUser ? "Edit User" : "Add New User"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mt-4 mb-4 flex items-center gap-2 text-xs text-red-400 bg-red-50 border border-red-200 p-2.5 rounded-xl">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                {!editingUser && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="user@paithan.gov.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                )}

                {editingUser && (
                  <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <span className="font-semibold">Email:</span> {editingUser.email}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Officer Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {editingUser ? "New Password (leave blank to keep current)" : "Password *"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={editingUser ? "••••••••" : "Min 12 characters"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <Key className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                    </button>
                  </div>
                  {!editingUser && (
                    <p className="text-[10px] text-slate-500 mt-1">Minimum 12 characters required</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="PUBLIC">Public (Read Only)</option>
                      <option value="EDITOR">Editor (Create/Update)</option>
                      <option value="ADMIN">Administrator (Full Access)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Ward</label>
                    <select
                      value={formData.wardId}
                      onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="">No Ward Assignment</option>
                      {wards.map((w) => (
                        <option key={w.id} value={w.id}>
                          Ward {w.number} — {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingUser(null);
                      resetForm();
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 text-xs font-bold rounded-xl shadow-md disabled:opacity-60"
                  >
                    {isSubmitting ? "Saving..." : editingUser ? "Update User" : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}