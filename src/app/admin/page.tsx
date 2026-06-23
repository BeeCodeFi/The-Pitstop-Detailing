"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CalendarCheck,
  Clock,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Car,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}

const quickActions = [
  {
    href: "/admin/bookings",
    label: "Manage Bookings",
    desc: "View & update all bookings",
    icon: CalendarCheck,
    color: "from-primary/20 to-orange-600/10",
    border: "border-primary/20",
    iconColor: "text-primary",
    glow: "shadow-primary/10",
  },
  {
    href: "/admin/users",
    label: "View Users",
    desc: "All registered customers",
    icon: Users,
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    glow: "shadow-blue-500/10",
  },
  {
    href: "/admin/bookings?status=PENDING",
    label: "Pending Reviews",
    desc: "Bookings awaiting confirmation",
    icon: Clock,
    color: "from-yellow-500/20 to-amber-500/10",
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
    glow: "shadow-yellow-500/10",
  },
];

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
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      gradient: "from-blue-600/20 to-cyan-600/10",
      border: "border-blue-500/20",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      valueColor: "text-blue-300",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: CalendarCheck,
      gradient: "from-green-600/20 to-emerald-600/10",
      border: "border-green-500/20",
      iconBg: "bg-green-500/15",
      iconColor: "text-green-400",
      valueColor: "text-green-300",
    },
    {
      label: "Pending",
      value: stats?.pendingBookings ?? 0,
      icon: Clock,
      gradient: "from-yellow-600/20 to-amber-600/10",
      border: "border-yellow-500/20",
      iconBg: "bg-yellow-500/15",
      iconColor: "text-yellow-400",
      valueColor: "text-yellow-300",
    },
    {
      label: "Revenue",
      value: `₹${((stats?.totalRevenue ?? 0) / 100).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      gradient: "from-primary/20 to-orange-600/10",
      border: "border-primary/20",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      valueColor: "text-orange-300",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back — here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10">
          <Activity className="h-3 w-3 text-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-white/5 bg-white/3 animate-pulse"
              />
            ))
          : cards.map((card) => (
              <div
                key={card.label}
                className={`relative rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
              >
                {/* Glow orb */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 bg-white/10 group-hover:opacity-30 transition-opacity" />

                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    {card.label}
                  </p>
                  <div className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                  </div>
                </div>
                <p className={`text-3xl font-bold ${card.valueColor}`}>{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-gray-600" />
                  <span className="text-xs text-gray-600">All time</span>
                </div>
              </div>
            ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group relative rounded-2xl border ${action.border} bg-gradient-to-br ${action.color} p-5 overflow-hidden hover:scale-[1.02] transition-all duration-200 shadow-lg ${action.glow}`}
            >
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20 bg-white/10 group-hover:opacity-40 transition-opacity" />
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              <p className="text-sm font-semibold text-white">{action.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-white/5 bg-white/2 p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Car className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">Connect your database to see live data</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Add <code className="text-primary/80 bg-primary/10 px-1 rounded">DATABASE_URL</code> to your{" "}
            <code className="text-gray-400 bg-white/5 px-1 rounded">.env.local</code> file to enable all features.
          </p>
        </div>
      </div>
    </div>
  );
}
