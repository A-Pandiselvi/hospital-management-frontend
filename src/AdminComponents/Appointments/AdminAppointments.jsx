import React, { useState, useEffect } from "react";
import axiosInstance from "../../Axios/AxiosInstance";
import {
  Calendar,
  Clock,
  Stethoscope,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarDays,
  Activity,
  UserCheck,
  Clock8,
  XCircle
} from "lucide-react";

// ─── Refined Status Badges ───────────────────────────────────────────────────
const statusConfig = {
  pending: { 
    label: "Pending", 
    bg: "bg-amber-50", 
    text: "text-amber-600", 
    dot: "bg-amber-400" 
  },

  approved: { 
    label: "Approved", 
    bg: "bg-blue-50", 
    text: "text-blue-600", 
    dot: "bg-blue-500" 
  },

  completed: { 
    label: "Completed", 
    bg: "bg-emerald-50", 
    text: "text-emerald-600", 
    dot: "bg-emerald-500" 
  },

  rejected: { 
    label: "Rejected", 
    bg: "bg-red-50", 
    text: "text-red-600", 
    dot: "bg-red-400" 
  },
};

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  const cfg = statusConfig[s] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text} border border-current/10`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  );
};

const PAGE_SIZE = 8;

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/appointments");
      setAppointments(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
useEffect(() => {
  setPage(1);
}, [search, statusFilter]);
  useEffect(() => { fetchAppointments(); }, []);

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = a.patient_name?.toLowerCase().includes(q) || a.doctor_name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || a.status?.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats Logic
  const stats = [
    { label: "Total Bookings", value: appointments.length, icon: Activity, color: "from-blue-600 to-blue-400" },
    { label: "Pending Review", value: appointments.filter(a => a.status?.toLowerCase() === 'pending').length, icon: Clock8, color: "from-amber-500 to-amber-300" },
    { label: "Confirmed", value: appointments.filter(a => a.status?.toLowerCase() === 'approved').length, icon: UserCheck, color: "from-emerald-600 to-emerald-400" },
    { label: "Cancelled", value: appointments.filter(a => a.status?.toLowerCase() === 'rejected').length, icon: XCircle, color: "from-red-600 to-red-400" },
  ];

  return (
    <div className=" bg-[#F8FAFC] p-3 rounded-xl ">
      <div className=" mx-auto">
        
        {/* ── Header Section ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-xl font-bold text-blue-950 tracking-tight">Management Appointments</h1>
            <p className="text-slate-500 text-xs font-medium italic">Hospital Appointment Registry</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Find record..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-4 focus:ring-blue-500/10 outline-none w-72 transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={fetchAppointments} className="p-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-blue-600 transition-all shadow-sm">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Modern Stat Cards ─────────────────────────────────────── */}
{/* ── Compact Light-Themed Neon Stat Cards ───────────────────────────── */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {stats.map((s, i) => (
    <div 
      key={i} 
      className="group relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-blue-200/40 hover:-translate-y-1"
    >
      {/* Light Sweep Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -left-[100%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[35deg] animate-[light-sweep_4s_infinite]" />
      </div>

      {/* Soft Glow Blob */}
      <div className={`absolute -right-3 -top-3 w-16 h-16 bg-gradient-to-br ${s.color} opacity-[0.06] blur-xl group-hover:opacity-20 transition-opacity`} />

      <div className="relative z-10">
        {/* Smaller Icon */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform duration-500`}>
          <s.icon className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex flex-col gap-1">
          {/* Smaller Value */}
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
            {s.value}
          </h3>
          
          <div className="flex items-center gap-2">
            {/* Status Dot */}
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r ${s.color} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r ${s.color}`}></span>
            </span>

            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {s.label}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Neon Border */}
      <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r ${s.color} opacity-40 animate-pulse`} />
    </div>
  ))}
</div>

{/* Keep this in global CSS */}
<style>{`
  @keyframes light-sweep {
    0% { left: -100%; }
    30% { left: 150%; }
    100% { left: 150%; }
  }
`}</style>

{/* ── Table Section ─────────────────────────────────────────── */}
<div className="flex flex-col h-[400px] bg-white rounded-xl shadow-2xl shadow-blue-950/5 border border-blue-800/20 overflow-hidden">

  {/* Scroll Area */}
  <div className="flex-1 overflow-y-auto scroll-smooth">

    <table className="w-full text-left border-separate border-spacing-0">

      {/* Sticky Header */}
      <thead className="sticky top-0 z-10">
        <tr className="bg-blue-800 text-white">
          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border-b border-blue-800/10">
            Patient
          </th>
          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border-b border-blue-800/10">
            Practitioner
          </th>
          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border-b border-blue-800/10">
            Timing
          </th>
    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border-b border-blue-800/10">
      Reason
    </th>
          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border-b border-blue-800/10">
            Status
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-blue-800/5">
  {loading ? (
    <tr>
      <td colSpan="5" className="py-24 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-800 mx-auto" />
        <p className="mt-4 text-xs font-bold text-blue-800/60 uppercase tracking-widest">
          Refreshing Records...
        </p>
      </td>
    </tr>
  ) : paginated.length === 0 ? (
    <tr>
      <td colSpan="5" className="py-20 text-center text-slate-400 font-semibold text-sm">
        No appointments found
      </td>
    </tr>
  ) : (
    paginated.map((apt) => (
      <tr
        key={apt.id}
        className="group hover:bg-blue-800/5 transition-all cursor-default"
      >
        {/* Patient */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-800 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-800/20 group-hover:rotate-6 transition-all">
              {apt.patient_name?.charAt(0) || "P"}
            </div>
            <div>
              <span className="block font-black text-slate-800 text-xs leading-none mb-1">
                {apt.patient_name || "Unknown"}
              </span>
              <span className="text-[10px] font-bold text-blue-800/50 uppercase tracking-tighter">
                Record #{apt.id?.toString().slice(-4)}
              </span>
            </div>
          </div>
        </td>

        {/* Doctor */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-800/10 rounded-lg">
              <Stethoscope className="w-4 h-4 text-blue-800" />
            </div>
            <span className="text-xs font-bold text-slate-600 italic">
              Dr. {apt.doctor_name || "N/A"}
            </span>
          </div>
        </td>

        {/* Date & Time */}
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-700">
              {apt.appointment_date
                ? new Date(apt.appointment_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
            <div className="flex items-center gap-1.5 text-blue-800 font-bold text-[10px] uppercase">
              <Clock className="w-3 h-3" />
              {apt.appointment_time || "N/A"}
            </div>
          </div>
        </td>

        {/* Reason */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Activity className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-slate-600">
              {apt.reason || "N/A"}
            </span>
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <StatusBadge status={apt.status} />
        </td>
      </tr>
    ))
  )}
</tbody>

    </table>
  </div>

  {/* Pagination (Fixed Bottom) */}
  <div className="px-8 py-6 bg-blue-800/5 border-t border-blue-800/10 flex items-center justify-between">
    <span className="text-[11px] font-black text-blue-800/60 uppercase tracking-widest">
      Showing {paginated.length} of {filtered.length} Appointments
    </span>

    <div className="flex items-center gap-4">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="text-xs font-black text-blue-800 hover:text-blue-900 disabled:opacity-20 transition-all flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        PREV
      </button>

      <div className="h-4 w-[1px] bg-blue-800/20" />

      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        className="text-xs font-black text-blue-800 hover:text-blue-900 disabled:opacity-20 transition-all flex items-center gap-1"
      >
        NEXT
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>

</div>

      </div>
    </div>
  );
};

export default AdminAppointments;