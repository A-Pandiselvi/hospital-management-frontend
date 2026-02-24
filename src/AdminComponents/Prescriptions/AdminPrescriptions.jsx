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
  Calendar,
  Stethoscope,
  Users,
  FileText,
  Pill,
  StickyNote,
  Eye,
  X,
} from "lucide-react";

// ─── View Modal ───────────────────────────────────────────────────────────────
const ViewModal = ({ prescription, onClose }) => {
  if (!prescription) return null;

  // medicines field may be JSON string or plain text
  let medicines = [];
  try {
    const parsed = JSON.parse(prescription.medicines);
    medicines = Array.isArray(parsed) ? parsed : [prescription.medicines];
  } catch {
    medicines = prescription.medicines
      ? prescription.medicines.split(",").map((m) => m.trim()).filter(Boolean)
      : [];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-950/20 w-full max-w-lg p-7 border border-blue-900/10 animate-[fadeUp_0.2s_ease]">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-lg">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-blue-950">
                Prescription #{prescription.id}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {prescription.created_at
                  ? new Date(prescription.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Patient & Doctor */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3">
            <p className="text-[10px] font-bold text-blue-900/50 uppercase tracking-widest mb-1">
              Patient
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-[10px]">
                {prescription.patient_name?.charAt(0)?.toUpperCase() || "P"}
              </div>
              <p className="text-xs font-black text-blue-950">
                {prescription.patient_name || "—"}
              </p>
            </div>
          </div>
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-3">
            <p className="text-[10px] font-bold text-violet-900/50 uppercase tracking-widest mb-1">
              Doctor
            </p>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-violet-500 flex-shrink-0" />
              <p className="text-xs font-black text-violet-900">
                Dr. {prescription.doctor_name || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Medicines */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Pill className="w-3.5 h-3.5 text-blue-700" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Medicines
            </p>
          </div>
          {medicines.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {medicines.map((med, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold rounded-xl"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {med}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No medicines listed</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StickyNote className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Notes
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 min-h-[60px]">
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {prescription.notes || (
                <span className="text-slate-400 italic">No notes provided</span>
              )}
            </p>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold transition-colors shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const PAGE_SIZE = 6;

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewTarget, setViewTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/prescriptions");
      setPrescriptions(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load prescriptions.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = prescriptions.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.patient_name?.toLowerCase().includes(q) ||
      p.doctor_name?.toLowerCase().includes(q) ||
      p.medicines?.toLowerCase().includes(q) ||
      p.notes?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Unique doctors count
  const uniqueDoctors = [
    ...new Set(prescriptions.map((p) => p.doctor_name).filter(Boolean)),
  ].length;
  const uniquePatients = [
    ...new Set(prescriptions.map((p) => p.patient_name).filter(Boolean)),
  ].length;

  const stats = [
    {
      label: "Total Prescriptions",
      value: prescriptions.length,
      icon: ClipboardList,
      color: "from-blue-900 to-blue-700",
    },
    {
      label: "Unique Patients",
      value: uniquePatients,
      icon: Users,
      color: "from-violet-600 to-violet-400",
    },
    {
      label: "Doctors Prescribing",
      value: uniqueDoctors,
      icon: Stethoscope,
      color: "from-sky-600 to-sky-400",
    },
    {
      label: "Issued Today",
      value: prescriptions.filter((p) => {
        if (!p.created_at) return false;
        return (
          new Date(p.created_at).toDateString() === new Date().toDateString()
        );
      }).length,
      icon: Calendar,
      color: "from-emerald-600 to-emerald-400",
    },
  ];

  // Helper: truncate medicines string for table preview
  const getMedicinePreview = (medicines) => {
    if (!medicines) return "—";
    let list = [];
    try {
      const parsed = JSON.parse(medicines);
      list = Array.isArray(parsed) ? parsed : [medicines];
    } catch {
      list = medicines.split(",").map((m) => m.trim()).filter(Boolean);
    }
    if (list.length === 0) return "—";
    if (list.length === 1) return list[0];
    return `${list[0]} +${list.length - 1} more`;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#F0F4F9] p-3 min-h-screen">
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

      {/* ── Toast ────────────────────────────────────────────────────────────── */}
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

      {/* ── View Modal ───────────────────────────────────────────────────────── */}
      {viewTarget && (
        <ViewModal
          prescription={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}

      <div className="mx-auto">
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                Prescriptions
              </h1>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                All Patient Prescription Records
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patient, doctor, medicine..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-4 focus:ring-blue-800/10 outline-none w-64 shadow-sm transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={fetchPrescriptions}
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
              className="relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
        <div className="flex flex-col h-[420px] bg-white rounded-xl shadow-2xl shadow-blue-950/5 border border-blue-800/20 overflow-hidden">
          {/* Table Scroll */}
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-800 text-white">
                  {[
                    "ID",
                    "Patient",
                    "Doctor",
                    "Medicines",
                    "Notes",
                    "Date",
                    "Action",
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
                    <td colSpan={7} className="py-24 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-blue-900 mx-auto" />
                      <p className="mt-3 text-[10px] font-bold text-blue-900/50 uppercase tracking-widest">
                        Loading Records...
                      </p>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center text-slate-400 font-semibold text-sm"
                    >
                      No prescriptions found
                    </td>
                  </tr>
                ) : (
                  paginated.map((rx) => (
                    <tr
                      key={rx.id}
                      className="group hover:bg-blue-900/[0.03] transition-colors"
                    >
                      {/* ID */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <FileText className="w-3.5 h-3.5 text-blue-700" />
                          </div>
                          <span className="text-xs font-black text-blue-900">
                            #{rx.id}
                          </span>
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-[10px] shadow-md shadow-blue-900/20 group-hover:rotate-3 transition-transform flex-shrink-0">
                            {rx.patient_name?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                          <span className="text-xs font-black text-slate-800">
                            {rx.patient_name || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-600">
                            Dr. {rx.doctor_name || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Medicines */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Pill className="w-3 h-3 text-blue-700" />
                          </div>
                          <span className="text-xs font-bold text-slate-600 max-w-[130px] truncate">
                            {getMedicinePreview(rx.medicines)}
                          </span>
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="px-5 py-3.5 max-w-[160px]">
                        <div className="flex items-start gap-1.5">
                          <StickyNote className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs font-medium text-slate-500 truncate">
                            {rx.notes || (
                              <span className="italic text-slate-300">
                                No notes
                              </span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">
                            {rx.created_at
                              ? new Date(rx.created_at).toLocaleDateString(
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

                      {/* View */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setViewTarget(rx)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-900 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-900 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
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
              Showing {paginated.length} of {filtered.length} Prescriptions
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
                  (p) =>
                    p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`d${i}`}
                      className="text-slate-400 text-xs px-1"
                    >
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

export default AdminPrescriptions;