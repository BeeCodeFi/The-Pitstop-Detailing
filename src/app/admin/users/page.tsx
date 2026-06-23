"use client";

import { useEffect, useState } from "react";
import { Search, Users as UsersIcon, ChevronLeft, ChevronRight, Car, CalendarCheck } from "lucide-react";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  image: string | null;
  createdAt: string;
  _count: { bookings: number; vehicles: number };
}

const roleConfig: Record<string, { label: string; classes: string }> = {
  ADMIN:    { label: "Admin",    classes: "bg-primary/15 text-primary border-primary/25" },
  STAFF:    { label: "Staff",    classes: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  CUSTOMER: { label: "Customer", classes: "bg-white/5 text-gray-400 border-white/10" },
};

function getInitials(name?: string | null, email?: string | null) {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  if (email) return email[0].toUpperCase();
  return "?";
}

function avatarColor(id: string) {
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-violet-500 to-purple-500",
    "from-green-500 to-emerald-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-yellow-500",
    "from-primary to-orange-500",
  ];
  const idx = id.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch { /* noop */ }
    finally { setIsLoading(false); }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Users</h1>
          <p className="text-gray-500 text-sm mt-1">All registered customers and staff</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 w-full pl-10 pr-4 rounded-xl border border-white/10 bg-white/3 text-sm text-white placeholder:text-gray-600 focus:border-primary/50 focus:bg-white/5 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block rounded-2xl border border-white/5 bg-[#0d0d1a]/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-gray-600 text-xs uppercase tracking-widest">
              <th className="text-left px-5 py-4 font-medium">User</th>
              <th className="text-left px-5 py-4 font-medium">Phone</th>
              <th className="text-left px-5 py-4 font-medium">Role</th>
              <th className="text-center px-5 py-4 font-medium">Bookings</th>
              <th className="text-center px-5 py-4 font-medium">Vehicles</th>
              <th className="text-left px-5 py-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td colSpan={6} className="px-5 py-4">
                    <div className="h-5 bg-white/3 rounded-lg animate-pulse" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <UsersIcon className="h-7 w-7 text-gray-600" />
                  </div>
                  <p className="text-gray-400 font-medium">No users found</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {search ? `No results for "${search}"` : "Users will appear here once people register"}
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const role = roleConfig[user.role] ?? roleConfig.CUSTOMER;
                return (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor(user.id)} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                          {getInitials(user.name, user.email)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{user.name || "—"}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm">
                      {user.phone || <span className="text-gray-700">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${role.classes}`}>
                        {role.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <CalendarCheck className="h-3.5 w-3.5 text-gray-600" />
                        <span className="text-gray-300 font-medium">{user._count.bookings}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Car className="h-3.5 w-3.5 text-gray-600" />
                        <span className="text-gray-300 font-medium">{user._count.vehicles}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl border border-white/5 bg-white/3 animate-pulse" />
          ))
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/2 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-7 w-7 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No users found</p>
          </div>
        ) : (
          users.map((user) => {
            const role = roleConfig[user.role] ?? roleConfig.CUSTOMER;
            return (
              <div
                key={user.id}
                className="rounded-2xl border border-white/5 bg-[#0d0d1a]/60 p-4 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColor(user.id)} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                    {getInitials(user.name, user.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white truncate">{user.name || "—"}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${role.classes}`}>
                        {role.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                    {user.phone && <p className="text-xs text-gray-600 mt-0.5">{user.phone}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <CalendarCheck className="h-3 w-3" />
                    <span>{user._count.bookings} bookings</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Car className="h-3 w-3" />
                    <span>{user._count.vehicles} vehicles</span>
                  </div>
                  <p className="text-xs text-gray-700 ml-auto">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 disabled:opacity-40 transition-all"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-sm text-gray-500 px-2">
            Page <span className="text-white font-medium">{page}</span> of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 disabled:opacity-40 transition-all"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
