import React, { useState, useEffect } from "react";
import axiosInstance from "../../Axios/AxiosInstance";
import {
  Stethoscope,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  Star,
  Clock,
  DollarSign,
  Calendar,
  Users,
  UserX,
  ShieldCheck,
  AlertTriangle,
  X,
  Plus,
  Pencil,
  User,
  Mail,
  Lock,
  BadgeCheck,
  Activity,
} from "lucide-react";

// ─── Availability Badge ───────────────────────────────────────────────────────
const AvailabilityBadge = ({ value }) => {
  const available =
    value &&
    value !== "0" &&
    value !== 0 &&
    value !== false &&
    value !== "Unavailable";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        available
          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
          : "bg-slate-100 text-slate-500 border-slate-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          available ? "bg-emerald-400 animate-pulse" : "bg-slate-400"
        }`}
      />
      {available ? value : "Unavailable"}
    </span>
  );
};

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ doctor, onConfirm, onCancel, deleting }) => (
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
      <h2 className="text-lg font-black text-blue-950 mb-1">Delete Doctor</h2>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to remove{" "}
        <span className="font-bold text-blue-900">Dr. {doctor?.name}</span>?
        This action cannot be undone.
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

// ─── Form Field ───────────────────────────────────────────────────────────────
const FormField = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="w-3.5 h-3.5 text-slate-400" />
        </div>
      )}
      {children}
    </div>
    {error && (
      <p className="mt-1 text-[10px] font-bold text-red-500">{error}</p>
    )}
  </div>
);

const inputCls = (hasIcon = true, error = false) =>
  `w-full ${hasIcon ? "pl-9" : "pl-3"} pr-3 py-2.5 bg-slate-50 border ${
    error ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-blue-800/10"
  } rounded-xl text-xs font-bold text-slate-700 focus:ring-4 outline-none transition-all`;

// ─── Add Doctor Modal ─────────────────────────────────────────────────────────
const AddDoctorModal = ({ onClose, onSuccess }) => {
  const INIT = {
    name: "", email: "", password: "",
    specialization: "", experience: "",
    consultation_fee: "", availability: "Available",
  };
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password.trim()) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (!form.specialization.trim()) e.specialization = "Specialization is required";
    if (!form.experience) e.experience = "Experience is required";
    else if (isNaN(form.experience) || Number(form.experience) < 0) e.experience = "Enter valid years";
    if (!form.consultation_fee) e.consultation_fee = "Fee is required";
    else if (isNaN(form.consultation_fee) || Number(form.consultation_fee) < 0) e.consultation_fee = "Enter valid amount";
    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await axiosInstance.post("/admin/doctor", {
        ...form,
        experience: Number(form.experience),
        consultation_fee: Number(form.consultation_fee),
      });
      onSuccess("Doctor added successfully.");
      onClose();
    } catch (err) {
      onSuccess(err.response?.data?.message || "Failed to add doctor.", "error");
    } finally {
      setSaving(false);
    }
  };

  const AVAILABILITY_OPTIONS = ["Available", "Unavailable", "On Leave"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-950/20 w-full max-w-lg p-7 border border-blue-900/10 animate-[fadeUp_0.2s_ease] my-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-blue-950">Add New Doctor</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Fill in the doctor's details below
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <FormField label="Full Name" icon={User} error={errors.name}>
            <input
              type="text"
              placeholder="Dr. John Smith"
              className={inputCls(true, !!errors.name)}
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormField>

          {/* Email */}
          <FormField label="Email Address" icon={Mail} error={errors.email}>
            <input
              type="email"
              placeholder="doctor@hospital.com"
              className={inputCls(true, !!errors.email)}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </FormField>

          {/* Password */}
          <FormField label="Password" icon={Lock} error={errors.password}>
            <input
              type="password"
              placeholder="Min. 6 characters"
              className={inputCls(true, !!errors.password)}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </FormField>

          {/* Specialization */}
          <FormField label="Specialization" icon={Star} error={errors.specialization}>
            <input
              type="text"
              placeholder="e.g. Cardiology, Neurology"
              className={inputCls(true, !!errors.specialization)}
              value={form.specialization}
              onChange={(e) => handleChange("specialization", e.target.value)}
            />
          </FormField>

          {/* Experience & Fee — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Experience (yrs)" icon={Clock} error={errors.experience}>
              <input
                type="number"
                min="0"
                placeholder="e.g. 5"
                className={inputCls(true, !!errors.experience)}
                value={form.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
              />
            </FormField>
            <FormField label="Consult Fee (₹)" icon={DollarSign} error={errors.consultation_fee}>
              <input
                type="number"
                min="0"
                placeholder="e.g. 500"
                className={inputCls(true, !!errors.consultation_fee)}
                value={form.consultation_fee}
                onChange={(e) => handleChange("consultation_fee", e.target.value)}
              />
            </FormField>
          </div>

          {/* Availability */}
          <FormField label="Availability" icon={Activity} error={errors.availability}>
            <select
              className={inputCls(true, false)}
              value={form.availability}
              onChange={(e) => handleChange("availability", e.target.value)}
            >
              {AVAILABILITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {saving ? "Adding..." : "Add Doctor"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Doctor Modal ────────────────────────────────────────────────────────
const EditDoctorModal = ({ doctor, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    specialization: doctor.specialization || "",
    experience: doctor.experience || "",
    consultation_fee: doctor.consultation_fee || "",
    availability: doctor.availability || "Available",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.specialization.trim()) e.specialization = "Specialization is required";
    if (!form.experience) e.experience = "Experience is required";
    else if (isNaN(form.experience) || Number(form.experience) < 0) e.experience = "Enter valid years";
    if (!form.consultation_fee) e.consultation_fee = "Fee is required";
    else if (isNaN(form.consultation_fee) || Number(form.consultation_fee) < 0) e.consultation_fee = "Enter valid amount";
    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await axiosInstance.put(`/admin/doctor/${doctor.id}`, {
        specialization: form.specialization,
        experience: Number(form.experience),
        consultation_fee: Number(form.consultation_fee),
        availability: form.availability,
      });
      onSuccess(`Dr. ${doctor.name} updated successfully.`);
      onClose();
    } catch (err) {
      onSuccess(err.response?.data?.message || "Failed to update doctor.", "error");
    } finally {
      setSaving(false);
    }
  };

  const AVAILABILITY_OPTIONS = ["Available", "Unavailable", "On Leave"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-950/20 w-full max-w-lg p-7 border border-blue-900/10 animate-[fadeUp_0.2s_ease] my-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center shadow-lg">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-blue-950">Edit Doctor</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Updating Dr. {doctor.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Read-only info */}
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-sm shadow flex-shrink-0">
            {doctor.name?.charAt(0)?.toUpperCase() || "D"}
          </div>
          <div>
            <p className="text-xs font-black text-blue-950">Dr. {doctor.name}</p>
            <p className="text-[10px] text-slate-400 font-medium">{doctor.email}</p>
          </div>
          <div className="ml-auto">
            <BadgeCheck className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Form — only editable fields per updateDoctorModel */}
        <div className="space-y-4">
          <FormField label="Specialization" icon={Star} error={errors.specialization}>
            <input
              type="text"
              placeholder="e.g. Cardiology"
              className={inputCls(true, !!errors.specialization)}
              value={form.specialization}
              onChange={(e) => handleChange("specialization", e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Experience (yrs)" icon={Clock} error={errors.experience}>
              <input
                type="number"
                min="0"
                placeholder="e.g. 5"
                className={inputCls(true, !!errors.experience)}
                value={form.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
              />
            </FormField>
            <FormField label="Consult Fee (₹)" icon={DollarSign} error={errors.consultation_fee}>
              <input
                type="number"
                min="0"
                placeholder="e.g. 500"
                className={inputCls(true, !!errors.consultation_fee)}
                value={form.consultation_fee}
                onChange={(e) => handleChange("consultation_fee", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Availability" icon={Activity} error={errors.availability}>
            <select
              className={inputCls(true, false)}
              value={form.availability}
              onChange={(e) => handleChange("availability", e.target.value)}
            >
              {AVAILABILITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

const PAGE_SIZE = 6;

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  // ── NEW state for modals ───────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/doctors");
      setDoctors(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load doctors.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/doctor/${deleteTarget.id}`);
      setDoctors((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      showToast(`Dr. ${deleteTarget.name} removed successfully.`, "success");
    } catch (err) {
      showToast("Failed to delete doctor.", "error");
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

  // ── After add/edit success: re-fetch + show toast ─────────────────────────
  const handleMutateSuccess = (msg, type = "success") => {
    showToast(msg, type);
    if (type !== "error") fetchDoctors();
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.specialization?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = [
    {
      label: "Total Doctors",
      value: doctors.length,
      icon: Users,
      color: "from-blue-900 to-blue-700",
      glow: "shadow-blue-800/30",
    },
    {
      label: "Available Now",
      value: doctors.filter((d) => {
        const val = String(d.availability).toLowerCase();
        return val === "1" || val === "true" || val === "available";
      }).length,
      icon: ShieldCheck,
      color: "from-emerald-600 to-emerald-400",
      glow: "shadow-emerald-500/30",
    },
    {
      label: "Unavailable",
      value: doctors.filter((d) => {
        const val = String(d.availability).toLowerCase();
        return !(val === "1" || val === "true" || val === "available");
      }).length,
      icon: UserX,
      color: "from-red-600 to-red-400",
      glow: "shadow-red-500/30",
    },
    {
      label: "Specializations",
      value: [...new Set(doctors.map((d) => d.specialization).filter(Boolean))].length,
      icon: Stethoscope,
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

      {/* ── Delete Modal ──────────────────────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          doctor={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {/* ── Add Doctor Modal ──────────────────────────────────────────────────── */}
      {showAddModal && (
        <AddDoctorModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleMutateSuccess}
        />
      )}

      {/* ── Edit Doctor Modal ─────────────────────────────────────────────────── */}
      {editTarget && (
        <EditDoctorModal
          doctor={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={handleMutateSuccess}
        />
      )}

      <div className="mx-auto">
        {/* ── Page Header ───────────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                Manage Doctors
              </h1>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                Hospital Medical Staff Registry
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search doctor, specialty..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-4 focus:ring-blue-800/10 outline-none w-64 shadow-sm transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={fetchDoctors}
                className="p-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-blue-50 text-blue-900 transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              {/* ── ADD DOCTOR BUTTON ── */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-2xl transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Doctor
              </button>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ────────────────────────────────────────────────────── */}
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

        {/* ── Table Card ────────────────────────────────────────────────────── */}
        <div className="flex flex-col h-[400px] bg-white rounded-xl shadow-2xl shadow-blue-950/5 border border-blue-800/20 overflow-hidden">
          {/* Table Scroll */}
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-800 text-white">
                  {[
                    "Doctor",
                    "Specialization",
                    "Experience",
                    "Consult Fee",
                    "Joined",
                    "Availability",
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
                      No doctors found
                    </td>
                  </tr>
                ) : (
                  paginated.map((doc) => (
                    <tr
                      key={doc.id}
                      className="group hover:bg-blue-900/[0.03] transition-colors"
                    >
                      {/* Doctor */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-900/20 group-hover:rotate-3 transition-transform flex-shrink-0">
                            {doc.name?.charAt(0)?.toUpperCase() || "D"}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 leading-tight">
                              Dr. {doc.name || "—"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {doc.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-blue-800 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-600">
                            {doc.specialization || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-600">
                            {doc.experience ? `${doc.experience} yrs` : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
                            <DollarSign className="w-3 h-3 text-emerald-600" />
                          </div>
                          <span className="text-xs font-black text-emerald-700">
                            {doc.consultation_fee
                              ? `₹${Number(doc.consultation_fee).toLocaleString()}`
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">
                            {doc.created_at
                              ? new Date(doc.created_at).toLocaleDateString(
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

                      {/* Availability */}
                      <td className="px-5 py-3.5">
                        <AvailabilityBadge value={doc.availability} />
                      </td>

                      {/* Actions — Edit + Delete */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {/* ── EDIT BUTTON ── */}
                          <button
                            onClick={() => setEditTarget(doc)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-500 text-violet-600 hover:text-white border border-violet-200 hover:border-violet-500 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </button>
                          {/* ── DELETE BUTTON ── */}
                          <button
                            onClick={() => setDeleteTarget(doc)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 hover:border-red-500 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ─────────────────────────────────────────────────── */}
          <div className="px-6 py-4 bg-blue-900/[0.03] border-t border-blue-900/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] font-bold text-blue-900/50 uppercase tracking-widest">
              Showing {paginated.length} of {filtered.length} Doctors
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

export default AdminDoctors;