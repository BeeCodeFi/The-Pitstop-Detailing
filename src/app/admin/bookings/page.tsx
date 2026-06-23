"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

interface Booking {
  id: string;
  status: string;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string; phone: string | null };
  vehicle: { make: string; model: string; year: number; color: string | null; plateNumber: string | null };
  timeSlot: { date: string; startTime: string } | null;
  pickup: { pickupAddress: string; pickupCity: string; status: string } | null;
}

const statusOptions = ["", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  PENDING:     { label: "Pending",     classes: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25", dot: "bg-yellow-400" },
  CONFIRMED:   { label: "Confirmed",   classes: "bg-blue-500/10 text-blue-400 border-blue-500/25",       dot: "bg-blue-400" },
  IN_PROGRESS: { label: "In Progress", classes: "bg-primary/10 text-primary border-primary/25",           dot: "bg-primary" },
  COMPLETED:   { label: "Completed",   classes: "bg-green-500/10 text-green-400 border-green-500/25",     dot: "bg-green-400" },
  CANCELLED:   { label: "Cancelled",   classes: "bg-red-500/10 text-red-400 border-red-500/25",           dot: "bg-red-400" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function getInitials(name?: string | null, email?: string | null) {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  if (email) return email[0].toUpperCase();
  return "?";
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

  async function fetchBookings() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (filter) params.set("status", filter);
      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();
      setBookings(data.bookings || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch { /* noop */ }
    finally { setIsLoading(false); }
  }

  async function updateStatus(bookingId: string, newStatus: string) {
    setUpdating(bookingId);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
      }
    } catch { /* noop */ }
    finally { setUpdating(null); }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and update all service bookings</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/3">
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer pr-1"
            >
              <option value="" className="bg-gray-900">All Statuses</option>
              {statusOptions.filter(Boolean).map((s) => (
                <option key={s} value={s} className="bg-gray-900">
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl border border-white/5 bg-white/3 animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/2 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="h-7 w-7 text-gray-600" />
          </div>
          <p className="text-gray-400 font-medium">No bookings found</p>
          <p className="text-gray-600 text-sm mt-1">
            {filter ? `No bookings with status "${filter.replace("_", " ")}"` : "Bookings will appear here once customers make reservations"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="group rounded-2xl border border-white/5 bg-[#0d0d1a]/60 hover:border-white/10 hover:bg-[#0d0d1a]/90 transition-all duration-200 overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                {/* Top row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <StatusBadge status={booking.status} />
                  <span className="text-xs text-gray-600 font-mono bg-white/3 px-2 py-1 rounded-lg">
                    #{booking.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-600 ml-auto">
                    {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {/* Customer */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-blue-400">
                      {getInitials(booking.user.name, booking.user.email)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Customer</p>
                      <p className="text-sm font-medium text-white truncate">{booking.user.name || booking.user.email}</p>
                      <p className="text-xs text-gray-500 truncate">{booking.user.phone || booking.user.email}</p>
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Vehicle</p>
                    <p className="text-sm text-white">
                      {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                    </p>
                    {booking.vehicle.plateNumber && (
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-md font-mono">
                        {booking.vehicle.plateNumber}
                      </span>
                    )}
                  </div>

                  {/* Schedule */}
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Schedule</p>
                    <p className="text-sm text-white">
                      {booking.timeSlot
                        ? `${new Date(booking.timeSlot.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${booking.timeSlot.startTime}`
                        : "—"}
                    </p>
                    {booking.pickup && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        📍 Pickup: {booking.pickup.pickupCity}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <p className="text-xs text-gray-500 italic bg-white/3 rounded-xl px-3 py-2 mb-4 border border-white/5">
                    &ldquo;{booking.notes}&rdquo;
                  </p>
                )}

                {/* Bottom row */}
                <div className="flex flex-col xs:flex-row xs:flex-wrap items-start xs:items-center justify-between gap-3 pt-3 border-t border-white/5">
                  <p className="text-base font-bold text-primary">
                    ₹{(booking.totalAmount / 100).toLocaleString("en-IN")}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 w-full xs:w-auto">
                    <span className="text-xs text-gray-600">Update status:</span>
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      disabled={updating === booking.id}
                      className="flex-1 xs:flex-none h-8 px-3 rounded-lg border border-white/10 bg-white/5 text-xs text-white focus:border-primary focus:outline-none disabled:opacity-50 cursor-pointer transition-colors hover:border-white/20 min-w-[120px]"
                    >
                      {statusOptions.filter(Boolean).map((s) => (
                        <option key={s} value={s} className="bg-gray-900">
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                    {updating === booking.id && (
                      <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
