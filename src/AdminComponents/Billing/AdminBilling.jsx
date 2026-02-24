import React, { useState, useEffect } from "react";
import axiosInstance from "../../Axios/AxiosInstance";
import {
  ClipboardList,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Stethoscope,
  UserCircle,
  Receipt,
  Pill,
} from "lucide-react";

// ─── Payment Status Badge ─────────────────────────────────────────────────────
const PaymentBadge = ({ status }) => {
  const s = status?.toLowerCase();

  const config =
    s === "paid"
      ? {
          cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
          dot: "bg-emerald-400 animate-pulse",
          icon: <CheckCircle2 className="w-3 h-3" />,
          label: "Paid",
        }
      : s === "pending"
      ? {
          cls: "bg-amber-50 text-amber-600 border-amber-200",
          dot: "bg-amber-400 animate-pulse",
          icon: <Clock className="w-3 h-3" />,
          label: "Pending",
        }
      : {
          cls: "bg-red-50 text-red-500 border-red-200",
          dot: "bg-red-400",
          icon: <XCircle className="w-3 h-3" />,
          label: status || "Unknown",
        };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.icon}
      {config.label}
    </span>
  );
};

const PAGE_SIZE = 6;

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminBilling = () => {
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchBilling = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/billing");
      setBilling(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load billing records.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, filterStatus]);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = billing.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      b.patient_name?.toLowerCase().includes(q) ||
      b.doctor_name?.toLowerCase().includes(q);
    const matchStatus =
      filterStatus === "all" ||
      b.payment_status?.toLowerCase() === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRevenue = billing
    .filter((b) => b.payment_status?.toLowerCase() === "paid")
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

  const pendingAmount = billing
    .filter((b) => b.payment_status?.toLowerCase() === "pending")
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

  const stats = [
    {
      label: "Total Records",
      value: billing.length,
      icon: ClipboardList,
      color: "from-blue-900 to-blue-700",
      glow: "shadow-blue-800/30",
      prefix: "",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-emerald-600 to-emerald-400",
      glow: "shadow-emerald-500/30",
      prefix: "",
    },
    {
      label: "Pending Amount",
      value: `₹${pendingAmount.toLocaleString()}`,
      icon: Clock,
      color: "from-amber-500 to-amber-400",
      glow: "shadow-amber-500/30",
      prefix: "",
    },
    {
      label: "Paid Bills",
      value: billing.filter((b) => b.payment_status?.toLowerCase() === "paid")
        .length,
      icon: CheckCircle2,
      color: "from-violet-600 to-violet-400",
      glow: "shadow-violet-500/30",
      prefix: "",
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#F0F4F9] p-3">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes light-sweep {
          0%   { left: -100%; }
          30%  { left: 150%; }
          100% { left: 150%; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
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
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                Billing
              </h1>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                Hospital Payment & Invoice Records
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                {["all", "paid", "pending"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      filterStatus === s
                        ? "bg-blue-900 text-white shadow"
                        : "text-slate-500 hover:text-blue-900"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patient, doctor..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-4 focus:ring-blue-800/10 outline-none w-56 shadow-sm transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                onClick={fetchBilling}
                className="p-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-blue-50 text-blue-900 transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:${s.glow} hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-[100%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[30deg] animate-[light-sweep_5s_infinite]" />
              </div>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-black text-blue-950">{s.value}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {s.label}
              </p>
              <div
                className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r ${s.color} opacity-50`}
              />
            </div>
          ))}
        </div>

        {/* ── Table Card ──────────────────────────────────────────────────── */}
        <div className="flex flex-col h-[400px] bg-white rounded-xl shadow-2xl shadow-blue-950/5 border border-blue-800/20 overflow-hidden">
          {/* Table Scroll */}
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-800 text-white">
                  {[
                    "Bill ID",
                    "Patient",
                    "Doctor",
                    "Consult Fee",
                    "Medicine Cost",
                    "Total",
                    "Date",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-blue-900/5">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-24 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-blue-900 mx-auto" />
                      <p className="mt-3 text-[10px] font-bold text-blue-900/50 uppercase tracking-widest">
                        Loading Records...
                      </p>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-20 text-center text-slate-400 font-semibold text-sm"
                    >
                      No billing records found
                    </td>
                  </tr>
                ) : (
                  paginated.map((bill) => (
                    <tr
                      key={bill.id}
                      className="group hover:bg-blue-900/[0.03] transition-colors"
                    >
                      {/* Bill ID */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <Receipt className="w-3.5 h-3.5 text-blue-700" />
                          </div>
                          <span className="text-xs font-black text-blue-900">
                            #{bill.id}
                          </span>
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-[10px] shadow-md shadow-blue-900/20 group-hover:rotate-3 transition-transform flex-shrink-0">
                            {bill.patient_name?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                          <span className="text-xs font-black text-slate-800">
                            {bill.patient_name || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-600">
                            Dr. {bill.doctor_name || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Consult Fee */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center">
                            <DollarSign className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-600">
                            {bill.consultation_fee != null
                              ? `₹${Number(bill.consultation_fee).toLocaleString()}`
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Medicine Cost */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-violet-50 flex items-center justify-center">
                            <Pill className="w-3 h-3 text-violet-500" />
                          </div>
                          <span className="text-xs font-bold text-slate-600">
                            {bill.medicine_cost != null
                              ? `₹${Number(bill.medicine_cost).toLocaleString()}`
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
                            <DollarSign className="w-3 h-3 text-emerald-600" />
                          </div>
                          <span className="text-xs font-black text-emerald-700">
                            {bill.total_amount != null
                              ? `₹${Number(bill.total_amount).toLocaleString()}`
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">
                            {bill.created_at
                              ? new Date(bill.created_at).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <PaymentBadge status={bill.payment_status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ──────────────────────────────────────────────── */}
          <div className="px-6 py-4 bg-blue-900/[0.03] border-t border-blue-900/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] font-bold text-blue-900/50 uppercase tracking-widest">
              Showing {paginated.length} of {filtered.length} Records
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-blue-900/20 text-[11px] font-bold text-blue-900 hover:bg-blue-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`d${i}`} className="text-slate-400 text-xs px-1">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        p === page
                          ? "bg-blue-900 text-white shadow-md"
                          : "border border-blue-900/20 text-blue-900 hover:bg-blue-900/10"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-blue-900/20 text-[11px] font-bold text-blue-900 hover:bg-blue-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;