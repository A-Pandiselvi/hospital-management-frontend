import React, { useState, useEffect } from "react";
import axiosInstance from "../../Axios/AxiosInstance";
import {
  Users,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  UserX,
  ShieldCheck,
  AlertTriangle,
  X,
  Phone,
  MapPin,
  Calendar,
  UserCircle,
  Venus,
  Mars,
} from "lucide-react";

// ─── Gender Badge ─────────────────────────────────────────────────────────────
const GenderBadge = ({ gender }) => {
  const isMale =
    gender?.toLowerCase() === "male" || gender?.toLowerCase() === "m";
  const isFemale =
    gender?.toLowerCase() === "female" || gender?.toLowerCase() === "f";

  if (!gender) return <span className="text-slate-400 text-xs font-bold">—</span>;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        isMale
          ? "bg-blue-50 text-blue-600 border-blue-200"
          : isFemale
          ? "bg-pink-50 text-pink-600 border-pink-200"
          : "bg-slate-100 text-slate-500 border-slate-200"
      }`}
    >
      {isMale ? (
        <Mars className="w-3 h-3" />
      ) : isFemale ? (
        <Venus className="w-3 h-3" />
      ) : null}
      {gender}
    </span>
  );
};

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ patient, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/60 backdrop-blur-sm px-4">
    <div className="bg-white rounded-3xl shadow-2xl shadow-blue-950/20 w-full max-w-md p-7 border border-blue-900/10 animate-[fadeUp_0.2s_ease]">
      <div className="flex items-center justify-between mb-5">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      <h2 className="text-lg font-black text-blue-950 mb-1">Delete Patient</h2>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to remove{" "}
        <span className="font-bold text-blue-900">{patient?.name}</span>? This
        action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          {deleting ? "Deleting..." : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

const PAGE_SIZE = 6;

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/patients");
      setPatients(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load patients.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/patient/${deleteTarget.id}`);
      setPatients((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast(`${deleteTarget.name} removed successfully.`, "success");
    } catch (err) {
      showToast("Failed to delete patient.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.gender?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const maleCount = patients.filter(
    (p) =>
      p.gender?.toLowerCase() === "male" || p.gender?.toLowerCase() === "m"
  ).length;
  const femaleCount = patients.filter(
    (p) =>
      p.gender?.toLowerCase() === "female" || p.gender?.toLowerCase() === "f"
  ).length;

  const stats = [
    {
      label: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "from-blue-900 to-blue-700",
      glow: "shadow-blue-800/30",
    },
    {
      label: "Male Patients",
      value: maleCount,
      icon: UserCircle,
      color: "from-sky-600 to-sky-400",
      glow: "shadow-sky-500/30",
    },
    {
      label: "Female Patients",
      value: femaleCount,
      icon: UserX,
      color: "from-pink-600 to-pink-400",
      glow: "shadow-pink-500/30",
    },
    {
      label: "Registered Today",
      value: patients.filter((p) => {
        if (!p.created_at) return false;
        const today = new Date().toDateString();
        return new Date(p.created_at).toDateString() === today;
      }).length,
      icon: Calendar,
      color: "from-violet-600 to-violet-400",
      glow: "shadow-violet-500/30",
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

      {/* ── Delete Modal ────────────────────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          patient={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      <div className="mx-auto">
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                Manage Patients
              </h1>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                Hospital Patient Registry
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-4 focus:ring-blue-800/10 outline-none w-64 shadow-sm transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={fetchPatients}
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
              {/* Sweep */}
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
                    "Patient",
                    "Age",
                    "Gender",
                    "Phone",
                    "Address",
                    "Registered",
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
                      No patients found
                    </td>
                  </tr>
                ) : (
                  paginated.map((patient) => (
                    <tr
                      key={patient.id}
                      className="group hover:bg-blue-900/[0.03] transition-colors"
                    >
                      {/* Patient */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-900/20 group-hover:rotate-3 transition-transform flex-shrink-0">
                            {patient.name?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 leading-tight">
                              {patient.name || "—"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {patient.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Age */}
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-bold text-slate-600">
                          {patient.age ? `${patient.age} yrs` : "—"}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="px-5 py-3.5">
                        <GenderBadge gender={patient.gender} />
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-600">
                            {patient.phone || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-5 py-3.5 max-w-[160px]">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs font-bold text-slate-600 truncate">
                            {patient.address || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Registered */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">
                            {patient.created_at
                              ? new Date(patient.created_at).toLocaleDateString(
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

                      {/* Delete */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setDeleteTarget(patient)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
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
              Showing {paginated.length} of {filtered.length} Patients
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

export default AdminPatients;