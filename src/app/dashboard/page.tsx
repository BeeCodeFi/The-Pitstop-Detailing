"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, Card } from "@/components/ui";
import { Calendar, Car, LogOut, Clock, AlertCircle, RefreshCw } from "lucide-react";

interface Booking {
  id: string;
  date: string;
  timeSlot: string;
  status: string;
  totalAmount: number;
  notes?: string;
  vehicle: { make: string; model: string; year: number; color?: string };
  services: { service: { name: string } }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBookings();
    }
  }, [status]);

  async function fetchBookings() {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const json = await res.json();
      setBookings(json.bookings || []);
    } catch {
      setError("Unable to load bookings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    IN_PROGRESS: "bg-primary/10 text-primary border-primary/20",
    COMPLETED: "bg-green-500/10 text-green-400 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className="py-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl text-foreground">
                HI, {session?.user?.name?.toUpperCase() || "THERE"}
              </h1>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/booking")}>
                <Calendar className="h-4 w-4" /> New Booking
              </Button>
              <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold text-foreground mt-1">{bookings.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {bookings.filter((b) => ["PENDING", "CONFIRMED"].includes(b.status)).length}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {bookings.filter((b) => b.status === "COMPLETED").length}
              </p>
            </div>
          </div>

          {/* Bookings */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Your Bookings</h2>
            <Button variant="ghost" size="sm" onClick={fetchBookings} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-sm text-error flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 rounded-xl border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <Card hover={false}>
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No bookings yet</p>
                <Button onClick={() => router.push("/booking")}>
                  Book Your First Session
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-sm">
                        {booking.services?.[0]?.service?.name || "Service"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                        {booking.vehicle.color && ` · ${booking.vehicle.color}`}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {booking.timeSlot}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[booking.status] || statusColors.PENDING}`}>
                        {booking.status.replace("_", " ")}
                      </span>
                      <p className="text-sm font-bold text-primary">
                        ₹{(booking.totalAmount / 100).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
