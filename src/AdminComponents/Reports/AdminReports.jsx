import React, { useState, useEffect } from "react";
import axiosInstance from "../../Axios/AxiosInstance";
import {
  FileText,
  RefreshCw,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Activity,
  Stethoscope,
  ClipboardList,
  BarChart3,
  Filter,
  CalendarRange,
} from "lucide-react";

// ─── Section Title ─────────────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-7 h-7 rounded-lg bg-blue-900 flex items-center justify-center">
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
    <h2 className="text-xs font-black text-blue-950 uppercase tracking-widest">
      {label}
    </h2>
  </div>
);

// ─── Summary Metric Card ────────────────────────────────────────────────────
const MetricCard = ({ label, value, icon: Icon, color, glow, prefix = "" }) => (
  <div
    className={`relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
  >
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 -left-[100%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[30deg] animate-[light-sweep_5s_infinite]" />
    </div>
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="text-2xl font-black text-blue-950">
      {prefix}
      {typeof value === "number" ? value.toLocaleString() : (value ?? 0)}
    </p>
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
      {label}
    </p>
    <div
      className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r ${color} opacity-50`}
    />
  </div>
);

// ─── Appointment Status Row ─────────────────────────────────────────────────
const ApptRow = ({ label, value, color, icon: Icon }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <Icon className="w-3.5 h-3.5 text-slate-400" />
      <span className="text-xs font-bold text-slate-600">{label}</span>
    </div>
    <span className="text-xs font-black text-blue-950">{value ?? 0}</span>
  </div>
);

// ─── Doctor Bar Row ─────────────────────────────────────────────────────────
const DoctorBar = ({ name, total, max }) => {
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">
            {name?.charAt(0)?.toUpperCase() || "D"}
          </div>
          <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]">
            Dr. {name || "—"}
          </span>
        </div>
        <span className="text-[10px] font-black text-blue-900 ml-2">
          {total}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-900 to-blue-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const PAGE_SIZE = 8;

// ─── Main Component ─────────────────────────────────────────────────────────
const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filter state
  const [range, setRange] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  // Doctor table pagination
  const [docPage, setDocPage] = useState(1);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchReports = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {};
      if (params.range && params.range !== "all") {
        queryParams.range = params.range;
      }
      if (params.from && params.to) {
        queryParams.from = params.from;
        queryParams.to = params.to;
      }
      const res = await axiosInstance.get("/admin/reports", {
        params: queryParams,
      });
      setReport(res.data);
      setDocPage(1);
    } catch (err) {
      console.error(err);
      showToast("Failed to load report data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ── Apply Filter ─────────────────────────────────────────────────────────
  const applyFilter = (selectedRange) => {
    const r = selectedRange ?? range;
    if (r === "custom") {
      if (!fromDate || !toDate) {
        showToast("Please select both From and To dates.", "error");
        return;
      }
      fetchReports({ from: fromDate, to: toDate });
    } else {
      fetchReports({ range: r === "all" ? "" : r });
    }
  };

  const handleRangeClick = (r) => {
    setRange(r);
    setShowCustom(r === "custom");
    if (r !== "custom") applyFilter(r);
  };

  // ── Toast ────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Derived data ─────────────────────────────────────────────────────────
  const rev = report?.revenueSummary || {};
  const appt = report?.appointmentSummary || {};
  const doctors = report?.doctorPerformance || [];
  const maxAppt = doctors.length > 0 ? Math.max(...doctors.map((d) => d.totalAppointments || 0)) : 0;

  const totalDocPages = Math.ceil(doctors.length / PAGE_SIZE);
  const paginatedDoctors = doctors.slice(
    (docPage - 1) * PAGE_SIZE,
    docPage * PAGE_SIZE
  );

  const RANGE_TABS = [
    { id: "all", label: "All Time" },
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "custom", label: "Custom" },
  ];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#F0F4F9] p-3 min-h-screen">
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
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease forwards; opacity: 0; }
      `}</style>

      {/* ── Toast ────────────────────────────────────────────────────────── */}
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
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="mb-6 fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                  Reports
                </h1>
                <p className="text-slate-500 text-xs font-medium mt-0.5">
                  Hospital Analytics & Performance Overview
                </p>
              </div>
            </div>
            <button
              onClick={() => applyFilter(range)}
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-blue-50 text-blue-900 text-xs font-bold transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Filter Bar ───────────────────────────────────────────────── */}
        <div className="mb-6 fade-up bg-white rounded-2xl p-4 border border-slate-100 shadow-sm" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-3.5 h-3.5 text-blue-900" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Filter by Date Range
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {RANGE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleRangeClick(tab.id)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                  range === tab.id
                    ? "bg-blue-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Custom date pickers */}
          {showCustom && (
            <div className="mt-4 flex flex-wrap items-end gap-3 animate-[fadeUp_0.2s_ease]">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-800/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-800/10 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => applyFilter("custom")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-[11px] font-bold rounded-xl transition-all shadow-md"
              >
                <CalendarRange className="w-3.5 h-3.5" />
                Apply
              </button>
            </div>
          )}
        </div>

        {/* ── Loading ──────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-36">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-900 mx-auto" />
              <p className="mt-4 text-[11px] font-bold text-blue-900/50 uppercase tracking-widest">
                Generating Report...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Revenue Summary ─────────────────────────────────────── */}
            <div className="mb-6 fade-up" style={{ animationDelay: "100ms" }}>
              <SectionTitle icon={DollarSign} label="Revenue Summary" />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                  label="Total Bills"
                  value={rev.totalBills ?? 0}
                  icon={ClipboardList}
                  color="from-blue-900 to-blue-700"
                  glow="shadow-blue-800/30"
                />
                <MetricCard
                  label="Total Revenue (Paid)"
                  value={Number(rev.totalRevenue ?? 0).toLocaleString()}
                  icon={DollarSign}
                  color="from-emerald-600 to-emerald-400"
                  glow="shadow-emerald-500/30"
                  prefix="₹"
                />
                <MetricCard
                  label="Pending Revenue"
                  value={Number(rev.pendingRevenue ?? 0).toLocaleString()}
                  icon={Clock}
                  color="from-amber-500 to-amber-400"
                  glow="shadow-amber-500/30"
                  prefix="₹"
                />
              </div>
            </div>

            {/* ── Two Column: Appointment Summary + Revenue Breakdown ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

              {/* Appointment Summary */}
              <div className="fade-up bg-white rounded-2xl p-5 border border-slate-100 shadow-sm" style={{ animationDelay: "180ms" }}>
                <SectionTitle icon={Calendar} label="Appointment Summary" />

                {/* Big total */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-blue-950">{appt.totalAppointments ?? 0}</p>
                    <p className="text-[10px] font-bold text-blue-900/50 uppercase tracking-widest">Total Appointments</p>
                  </div>
                </div>

                <ApptRow
                  label="Pending"
                  value={appt.pending}
                  color="bg-amber-400"
                  icon={Clock}
                />
                <ApptRow
                  label="Approved"
                  value={appt.approved}
                  color="bg-sky-400"
                  icon={CheckCircle2}
                />
                <ApptRow
                  label="Completed"
                  value={appt.completed}
                  color="bg-emerald-400"
                  icon={CheckCircle2}
                />
                <ApptRow
                  label="Rejected"
                  value={appt.rejected}
                  color="bg-red-400"
                  icon={XCircle}
                />

                {/* Visual bar breakdown */}
                {(appt.totalAppointments ?? 0) > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Distribution
                    </p>
                    <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
                      {[
                        { val: appt.pending, cls: "bg-amber-400" },
                        { val: appt.approved, cls: "bg-sky-400" },
                        { val: appt.completed, cls: "bg-emerald-400" },
                        { val: appt.rejected, cls: "bg-red-400" },
                      ]
                        .filter((s) => (s.val ?? 0) > 0)
                        .map((s, i) => (
                          <div
                            key={i}
                            className={`${s.cls} transition-all duration-700`}
                            style={{
                              width: `${((s.val ?? 0) / (appt.totalAppointments ?? 1)) * 100}%`,
                            }}
                          />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {[
                        { label: "Pending", color: "bg-amber-400" },
                        { label: "Approved", color: "bg-sky-400" },
                        { label: "Completed", color: "bg-emerald-400" },
                        { label: "Rejected", color: "bg-red-400" },
                      ].map((l, i) => (
                        <span key={i} className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <span className={`w-2 h-2 rounded-full ${l.color}`} />
                          {l.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Revenue Breakdown visual */}
              <div className="fade-up bg-white rounded-2xl p-5 border border-slate-100 shadow-sm" style={{ animationDelay: "240ms" }}>
                <SectionTitle icon={TrendingUp} label="Revenue Overview" />

                <div className="space-y-4">
                  {/* Paid bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Paid Revenue
                      </span>
                      <span className="text-xs font-black text-emerald-700">
                        ₹{Number(rev.totalRevenue ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700"
                        style={{
                          width: `${
                            (Number(rev.totalRevenue ?? 0) /
                              Math.max(
                                Number(rev.totalRevenue ?? 0) + Number(rev.pendingRevenue ?? 0),
                                1
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Pending bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Pending Revenue
                      </span>
                      <span className="text-xs font-black text-amber-600">
                        ₹{Number(rev.pendingRevenue ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-700"
                        style={{
                          width: `${
                            (Number(rev.pendingRevenue ?? 0) /
                              Math.max(
                                Number(rev.totalRevenue ?? 0) + Number(rev.pendingRevenue ?? 0),
                                1
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats rows */}
                <div className="mt-6 space-y-2">
                  {[
                    {
                      label: "Total Bills",
                      value: rev.totalBills ?? 0,
                      icon: ClipboardList,
                      color: "text-blue-900",
                    },
                    {
                      label: "Paid Bills",
                      value: rev.totalBills ?? 0,
                      icon: CheckCircle2,
                      color: "text-emerald-600",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <row.icon className={`w-3.5 h-3.5 ${row.color}`} />
                        <span className="text-xs font-bold text-slate-600">
                          {row.label}
                        </span>
                      </div>
                      <span className={`text-xs font-black ${row.color}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status pill */}
                <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                  <Activity className="w-3.5 h-3.5 text-blue-700" />
                  <span className="text-[10px] font-bold text-blue-900">
                    Live data ·{" "}
                    {range === "all"
                      ? "All Time"
                      : range === "custom"
                      ? `${fromDate} → ${toDate}`
                      : range.charAt(0).toUpperCase() + range.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Doctor Performance ────────────────────────────────── */}
            <div className="fade-up" style={{ animationDelay: "300ms" }}>
              <div className="flex flex-col h-auto bg-white rounded-xl shadow-2xl shadow-blue-950/5 border border-blue-800/20 overflow-hidden">
                {/* Header */}
                <div className="bg-blue-800 px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                      Doctor Performance
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-200">
                    {doctors.length} Doctors
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-blue-50 border-b border-blue-100">
                        {["#", "Doctor", "Total Appointments", "Performance"].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-[10px] font-bold text-blue-900/60 uppercase tracking-widest whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-900/5">
                      {paginatedDoctors.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-16 text-center text-slate-400 font-semibold text-sm"
                          >
                            No doctor data available
                          </td>
                        </tr>
                      ) : (
                        paginatedDoctors.map((doc, idx) => {
                          const rank = (docPage - 1) * PAGE_SIZE + idx + 1;
                          const pct =
                            maxAppt > 0
                              ? Math.round(
                                  ((doc.totalAppointments || 0) / maxAppt) * 100
                                )
                              : 0;
                          return (
                            <tr
                              key={idx}
                              className="group hover:bg-blue-900/[0.03] transition-colors"
                            >
                              {/* Rank */}
                              <td className="px-5 py-3.5">
                                <span
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                    rank === 1
                                      ? "bg-amber-400 text-white"
                                      : rank === 2
                                      ? "bg-slate-300 text-white"
                                      : rank === 3
                                      ? "bg-orange-400 text-white"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {rank}
                                </span>
                              </td>

                              {/* Doctor */}
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-[10px] shadow-md shadow-blue-900/20 group-hover:rotate-3 transition-transform flex-shrink-0">
                                    {doc.name?.charAt(0)?.toUpperCase() || "D"}
                                  </div>
                                  <span className="text-xs font-black text-slate-800">
                                    Dr. {doc.name || "—"}
                                  </span>
                                </div>
                              </td>

                              {/* Total */}
                              <td className="px-5 py-3.5">
                                <span className="text-xs font-black text-blue-900">
                                  {doc.totalAppointments ?? 0}
                                </span>
                              </td>

                              {/* Bar */}
                              <td className="px-5 py-3.5 w-48">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-blue-900 to-blue-500 transition-all duration-700"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400 w-8 text-right">
                                    {pct}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalDocPages > 1 && (
                  <div className="px-6 py-4 bg-blue-900/[0.03] border-t border-blue-900/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-blue-900/50 uppercase tracking-widest">
                      Showing {paginatedDoctors.length} of {doctors.length} Doctors
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={docPage === 1}
                        onClick={() => setDocPage((p) => p - 1)}
                        className="px-3 py-1.5 rounded-xl border border-blue-900/20 text-[11px] font-bold text-blue-900 hover:bg-blue-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        Prev
                      </button>
                      {Array.from({ length: totalDocPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setDocPage(p)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                            p === docPage
                              ? "bg-blue-900 text-white shadow-md"
                              : "border border-blue-900/20 text-blue-900 hover:bg-blue-900/10"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        disabled={docPage === totalDocPages}
                        onClick={() => setDocPage((p) => p + 1)}
                        className="px-3 py-1.5 rounded-xl border border-blue-900/20 text-[11px] font-bold text-blue-900 hover:bg-blue-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReports;