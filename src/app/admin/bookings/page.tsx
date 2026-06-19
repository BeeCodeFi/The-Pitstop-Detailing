"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Filter } from "lucide-react";

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
const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  IN_PROGRESS: "bg-primary/10 text-primary border-primary/20",
  COMPLETED: "bg-green-500/10 text-green-400 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
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
    } catch {
      /* noop */
    } finally {
      setIsLoading(false);
    }
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
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch {
      /* noop */
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-white">BOOKINGS</h1>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="h-9 px-3 rounded-lg border border-gray-700 bg-gray-800 text-sm text-white focus:border-primary focus:outline-none"
          >
            <option value="">All Statuses</option>
            {statusOptions.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl border border-gray-800 bg-gray-900/50 animate-pulse" />
          ))
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-12 text-center">
            <CalendarCheck className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No bookings found</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${statusColors[booking.status] || statusColors.PENDING}`}>
                      {booking.status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{booking.id.slice(0, 8)}...</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="text-white font-medium truncate">{booking.user.name || booking.user.email}</p>
                      <p className="text-xs text-gray-400">{booking.user.phone || booking.user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Vehicle</p>
                      <p className="text-gray-200">
                        {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                      </p>
                      {booking.vehicle.plateNumber && (
                        <p className="text-xs text-gray-400">{booking.vehicle.plateNumber}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Schedule</p>
                      <p className="text-gray-200">
                        {booking.timeSlot
                          ? `${new Date(booking.timeSlot.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at ${booking.timeSlot.startTime}`
                          : "—"}
                      </p>
                      {booking.pickup && (
                        <p className="text-xs text-gray-400">Pickup: {booking.pickup.pickupCity}</p>
                      )}
                    </div>
                  </div>
                  {booking.notes && (
                    <p className="text-xs text-gray-500 mt-2 italic">&quot;{booking.notes}&quot;</p>
                  )}
                </div>
                <div className="text-right shrink-0 space-y-2">
                  <p className="text-primary font-bold">
                    ₹{(booking.totalAmount / 100).toLocaleString("en-IN")}
                  </p>
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking.id, e.target.value)}
                    disabled={updating === booking.id}
                    className="h-8 px-2 rounded border border-gray-700 bg-gray-800 text-xs text-white focus:border-primary focus:outline-none disabled:opacity-50"
                  >
                    {statusOptions.filter(Boolean).map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded text-xs font-medium text-gray-400 hover:text-white border border-gray-700 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded text-xs font-medium text-gray-400 hover:text-white border border-gray-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
