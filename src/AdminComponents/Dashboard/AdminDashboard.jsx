import React, { useState, useEffect } from "react";
import axiosInstance from "../../Axios/AxiosInstance";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  ArrowUpRight,
  HeartPulse,
  ClipboardList,
} from "lucide-react";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  glow,
  prefix = "",
  suffix = "",
  delay = 0,
}) => (
  <div
    className={`relative bg-white rounded-xl p-3 shadow-sm border border-slate-100 overflow-hidden 
    group hover:shadow-md hover:${glow} hover:-translate-y-0.5 transition-all duration-300`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Sweep shimmer */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 -left-[100%] w-[35%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[30deg] animate-[light-sweep_5s_infinite]" />
    </div>

    {/* Top row */}
    <div className="flex items-start justify-between mb-2">
      <div
        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>

      <span className="flex items-center gap-1 text-[9px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
        <ArrowUpRight className="w-2.5 h-2.5" />
        Live
      </span>
    </div>

    {/* Value */}
    <p className="text-xl font-semibold text-blue-900 tracking-tight">
      {prefix}
      {typeof value === "number" ? value.toLocaleString() : value}
      {suffix}
    </p>

    {/* Label */}
    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">
      {label}
    </p>

    {/* Bottom accent bar */}
    <div
      className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r ${color} opacity-50`}
    />
  </div>
);

// ─── Quick Link Card ──────────────────────────────────────────────────────────
const QuickCard = ({ label, desc, icon: Icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs font-black text-blue-950">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/dashboard");
      setData(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const stats = data
    ? [
        {
          label: "Total Doctors",
          value: data.totalDoctors ?? 0,
          icon: UserCog,
          color: "from-blue-900 to-blue-700",
          glow: "shadow-blue-800/30",
          delay: 0,
        },
        {
          label: "Total Patients",
          value: data.totalPatients ?? 0,
          icon: Users,
          color: "from-violet-600 to-violet-400",
          glow: "shadow-violet-500/30",
          delay: 80,
        },
        {
          label: "Total Appointments",
          value: data.totalAppointments ?? 0,
          icon: Calendar,
          color: "from-sky-600 to-sky-400",
          glow: "shadow-sky-500/30",
          delay: 160,
        },
        {
          label: "Total Revenue (Paid)",
          value: data.totalRevenue ?? 0,
          icon: DollarSign,
          color: "from-emerald-600 to-emerald-400",
          glow: "shadow-emerald-500/30",
          prefix: "₹",
          delay: 240,
        },
      ]
    : [];

  const quickLinks = [
    {
      label: "Manage Doctors",
      desc: "View & remove medical staff",
      icon: Stethoscope,
      color: "from-blue-900 to-blue-700",
      path: "/admin/doctors",
    },
    {
      label: "Manage Patients",
      desc: "Browse patient registry",
      icon: Users,
      color: "from-violet-600 to-violet-400",
      path: "/admin/patients",
    },
    {
      label: "Appointments",
      desc: "Track all appointments",
      icon: Calendar,
      color: "from-sky-600 to-sky-400",
      path: "/admin/appointments",
    },
    {
      label: "Billing",
      desc: "Payments & invoices",
      icon: ClipboardList,
      color: "from-emerald-600 to-emerald-400",
      path: "/admin/billing",
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#F0F4F9] p-3 ">
      <style>{`
        @keyframes light-sweep {
          0%   { left: -100%; }
          30%  { left: 150%; }
          100% { left: 150%; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.4s ease forwards;
          opacity: 0;
        }
      `}</style>

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold text-white animate-[slideIn_0.3s_ease] ${
            toast.type === "success" ? "bg-blue-900" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <ShieldCheck className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      <div className="mx-auto">
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="mb-6 fade-up" style={{ animationDelay: "0ms" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-slate-500 text-xs font-medium mt-0.5">
                  Hospital Management Overview
                </p>
              </div>
            </div>
            <button
              onClick={fetchDashboard}
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-blue-50 text-blue-900 text-xs font-bold transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Stats Grid ──────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-900 mx-auto" />
              <p className="mt-4 text-[11px] font-bold text-blue-900/50 uppercase tracking-widest">
                Loading Dashboard...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="fade-up"
                  style={{ animationDelay: `${s.delay + 100}ms` }}
                >
                  <StatCard {...s} />
                </div>
              ))}
            </div>

            {/* ── Two Column Layout ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* ── Summary Banner ──────────────────────────────────────── */}
              <div
                className="lg:col-span-2 fade-up relative bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-blue-900/20"
                style={{ animationDelay: "350ms" }}
              >
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute top-4 right-24 w-16 h-16 rounded-full bg-white/5" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <HeartPulse className="w-5 h-5 text-blue-200" />
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">
                      Hospital Summary
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Doctors", value: data?.totalDoctors ?? 0 },
                      { label: "Patients", value: data?.totalPatients ?? 0 },
                      { label: "Appointments", value: data?.totalAppointments ?? 0 },
                      {
                        label: "Revenue",
                        value: `₹${Number(data?.totalRevenue ?? 0).toLocaleString()}`,
                      },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                        <p className="text-xl font-black tracking-tight">{item.value}</p>
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-0.5">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-300" />
                    <p className="text-xs text-blue-200 font-medium">
                      All systems operational — data refreshed live from database
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Revenue Card ────────────────────────────────────────── */}
              <div
                className="fade-up bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between"
                style={{ animationDelay: "420ms" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Revenue Breakdown
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-bold text-slate-600">Paid Revenue</span>
                      </div>
                      <span className="text-xs font-black text-emerald-700">
                        ₹{Number(data?.totalRevenue ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-bold text-slate-600">Total Doctors</span>
                      </div>
                      <span className="text-xs font-black text-blue-900">
                        {data?.totalDoctors ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-400" />
                        <span className="text-xs font-bold text-slate-600">Total Patients</span>
                      </div>
                      <span className="text-xs font-black text-violet-700">
                        {data?.totalPatients ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        <span className="text-xs font-bold text-slate-600">Appointments</span>
                      </div>
                      <span className="text-xs font-black text-sky-700">
                        {data?.totalAppointments ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-900/60 uppercase tracking-widest">
                    Status
                  </p>
                  <p className="text-xs font-black text-blue-900 mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    All Records Live
                  </p>
                </div>
              </div>
            </div>

            {/* ── Quick Links ─────────────────────────────────────────────── */}
            <div
              className="mt-4 fade-up"
              style={{ animationDelay: "500ms" }}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Quick Navigation
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {quickLinks.map((link, i) => (
                  <QuickCard key={i} {...link} onClick={() => (window.location.href = link.path)} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;