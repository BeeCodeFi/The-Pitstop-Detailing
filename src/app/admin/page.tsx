"use client";

import { useEffect, useState } from "react";
import { Users, CalendarCheck, Clock, IndianRupee } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400" },
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: CalendarCheck, color: "text-green-400" },
    { label: "Pending", value: stats?.pendingBookings || 0, icon: Clock, color: "text-yellow-400" },
    { label: "Revenue", value: `₹${((stats?.totalRevenue || 0) / 100).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl text-white mb-6">DASHBOARD</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl border border-gray-800 bg-gray-900/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{card.label}</p>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="text-sm font-bold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="/admin/bookings" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-white">Manage Bookings</p>
              <p className="text-xs text-gray-500">View & update all bookings</p>
            </div>
          </a>
          <a href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
            <Users className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">View Users</p>
              <p className="text-xs text-gray-500">All registered customers</p>
            </div>
          </a>
          <a href="/" target="_blank" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            <div>
              <p className="text-sm font-medium text-white">View Site</p>
              <p className="text-xs text-gray-500">Open frontend in new tab</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
