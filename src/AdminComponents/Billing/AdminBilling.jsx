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
  CheckCircle2,
  Clock,
  XCircle,
  Stethoscope,
  Receipt,
  Pill,
  Plus,
  Pencil,
  Trash2,
  X,
  User,
  BadgeCheck,
  Activity,
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
      : s === "unpaid"
      ? {
          cls: "bg-amber-50 text-amber-600 border-amber-200",
          dot: "bg-amber-400 animate-pulse",
          icon: <Clock className="w-3 h-3" />,
          label: "Unpaid",
        }
      : {
          cls: "bg-red-50 text-red-500 border-red-200",
          dot: "bg-red-400",
          icon: <XCircle className="w-3 h-3" />,
          label: status || "Unknown",
        };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.icon}
      {config.label}
    </span>
  );
};

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
    {error && <p className="mt-1 text-[10px] font-bold text-red-500">{error}</p>}
  </div>
);

const inputCls = (hasIcon = true, error = false) =>
  `w-full ${hasIcon ? "pl-9" : "pl-3"} pr-3 py-2.5 bg-slate-50 border ${
    error ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-blue-800/10"
  } rounded-xl text-xs font-bold text-slate-700 focus:ring-4 outline-none transition-all`;

// ─── Add Bill Modal ───────────────────────────────────────────────────────────
const AddBillModal = ({ onClose, onSuccess }) => {
const INIT = {
  appointment_id: "",
  consultation_fee: "",
  medicine_cost: "",
};
  const [form, setForm] = useState(INIT);
  const [appointments, setAppointments] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
const fetchAppointments = async () => {
  if (appointments.length > 0) return;

  try {
    const res = await axiosInstance.get("/admin/appointments");
    setAppointments(res.data || []);
  } catch (error) {
    console.error("Failed to load appointments");
  }
};
const validate = () => {
  const e = {};

  if (!form.appointment_id)
    e.appointment_id = "Appointment ID is required";

  if (!form.consultation_fee)
    e.consultation_fee = "Consultation fee is required";
  else if (isNaN(form.consultation_fee) || Number(form.consultation_fee) < 0)
    e.consultation_fee = "Enter valid amount";

  if (form.medicine_cost && (isNaN(form.medicine_cost) || Number(form.medicine_cost) < 0))
    e.medicine_cost = "Enter valid amount";

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
 await axiosInstance.post("/admin/billing", {
  appointment_id: Number(form.appointment_id),
  consultation_fee: Number(form.consultation_fee),
  medicine_cost: Number(form.medicine_cost || 0),
});
      onSuccess("Bill created successfully.");
      onClose();
    } catch (err) {
      onSuccess(err.response?.data?.message || "Failed to create bill.", "error");
    } finally {
      setSaving(false);
    }
  };

  const consultFee = Number(form.consultation_fee) || 0;
  const medCost    = Number(form.medicine_cost)    || 0;
  const total      = consultFee + medCost;

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
              <h2 className="text-base font-black text-blue-950">Create New Bill</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Fill in the billing details below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
<FormField label="Select Appointment" icon={ClipboardList} error={errors.appointment_id}>
<select
  className={inputCls(true, !!errors.appointment_id)}
  value={form.appointment_id}
  onChange={(e) => handleChange("appointment_id", e.target.value)}
  onFocus={fetchAppointments}
>
    <option value="">Select Appointment</option>

    {appointments.map((a) => (
      <option key={a.id} value={a.id}>
        Appointment #{a.id}
      </option>
    ))}

  </select>
</FormField>

          <div className="grid grid-cols-2 gap-3">
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
            <FormField label="Medicine Cost (₹)" icon={Pill} error={errors.medicine_cost}>
              <input
                type="number"
                min="0"
                placeholder="e.g. 200"
                className={inputCls(true, !!errors.medicine_cost)}
                value={form.medicine_cost}
                onChange={(e) => handleChange("medicine_cost", e.target.value)}
              />
            </FormField>
          </div>

          {/* Auto-calculated total */}
          {total > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Total Amount</p>
                <p className="text-sm font-black text-emerald-700">₹{total.toLocaleString()}</p>
              </div>
            </div>
          )}

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
            {saving ? "Creating..." : "Create Bill"}
          </button>
        </div>
      </div>
    </div>
  );
};
const STATUS_OPTIONS = ["unpaid", "paid"];
// ─── Edit Bill Modal ──────────────────────────────────────────────────────────
const EditBillModal = ({ bill, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    consultation_fee: bill.consultation_fee || "",
    medicine_cost:    bill.medicine_cost    || "",
    payment_status:   bill.payment_status?.toLowerCase() || "unpaid",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

const validate = () => {
  const e = {};
  if (!form.consultation_fee) e.consultation_fee = "Consultation fee is required";
  else if (isNaN(form.consultation_fee) || Number(form.consultation_fee) < 0)
    e.consultation_fee = "Enter valid amount";
  if (form.medicine_cost && (isNaN(form.medicine_cost) || Number(form.medicine_cost) < 0))
    e.medicine_cost = "Enter valid amount";
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
    await axiosInstance.put(`/admin/billing/${bill.id}`, {
  payment_status: form.payment_status,
});
      onSuccess(`Bill #${bill.id} updated successfully.`);
      onClose();
    } catch (err) {
      onSuccess(err.response?.data?.message || "Failed to update bill.", "error");
    } finally {
      setSaving(false);
    }
  };

  const total = Number(form.consultation_fee || 0) + Number(form.medicine_cost || 0);

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
              <h2 className="text-base font-black text-blue-950">Edit Bill</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Updating Bill #{bill.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Read-only info card */}
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-sm shadow flex-shrink-0">
            {bill.patient_name?.charAt(0)?.toUpperCase() || "P"}
          </div>
          <div>
            <p className="text-xs font-black text-blue-950">{bill.patient_name}</p>
            <p className="text-[10px] text-slate-400 font-medium">Dr. {bill.doctor_name}</p>
          </div>
          <div className="ml-auto">
            <BadgeCheck className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Consult Fee (₹)" icon={DollarSign} error={errors.consultation_fee}>
             <input
  type="number"
  disabled
  className={`${inputCls(true, false)} bg-slate-100 cursor-not-allowed`}
  value={form.consultation_fee}
/>
            </FormField>
            <FormField label="Medicine Cost (₹)" icon={Pill} error={errors.medicine_cost}>
              <input
  type="number"
  disabled
  className={`${inputCls(true, false)} bg-slate-100 cursor-not-allowed`}
  value={form.medicine_cost}
/>
            </FormField>
          </div>

          {/* Live total preview */}
          {total > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Total Amount</p>
                <p className="text-sm font-black text-emerald-700">₹{total.toLocaleString()}</p>
              </div>
            </div>
          )}

          <FormField label="Payment Status" icon={Activity} error={errors.payment_status}>
            <select
              className={inputCls(true, false)}
              value={form.payment_status}
              onChange={(e) => handleChange("payment_status", e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
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

// ─── Main Component ───────────────────────────────────────────────────────────
const PAGE_SIZE = 6;

const AdminBilling = () => {
  const [billing, setBilling]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage]                 = useState(1);
  const [toast, setToast]               = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget]     = useState(null);

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

  useEffect(() => { fetchBilling(); }, []);
  useEffect(() => { setPage(1); }, [search, filterStatus]);



  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleMutateSuccess = (msg, type = "success") => {
    fetchBilling();
    showToast(msg, type);
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = billing.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch  = b.patient_name?.toLowerCase().includes(q) || b.doctor_name?.toLowerCase().includes(q);
    const matchStatus  = filterStatus === "all" || b.payment_status?.toLowerCase() === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRevenue  = billing.filter(b => b.payment_status?.toLowerCase() === "paid").reduce((s, b) => s + Number(b.total_amount || 0), 0);
  const pendingAmount = billing.filter(b => b.payment_status?.toLowerCase() === "unpaid").reduce((s, b) => s + Number(b.total_amount || 0), 0);

  const stats = [
    { label: "Total Records",  value: billing.length,                                                             icon: ClipboardList, color: "from-blue-900 to-blue-700",       glow: "shadow-blue-800/30"    },
    { label: "Total Revenue",  value: `₹${totalRevenue.toLocaleString()}`,                                        icon: DollarSign,    color: "from-emerald-600 to-emerald-400", glow: "shadow-emerald-500/30" },
    { label: "unpaid Amount", value: `₹${pendingAmount.toLocaleString()}`,                                       icon: Clock,         color: "from-amber-500 to-amber-400",     glow: "shadow-amber-500/30"   },
    { label: "Paid Bills",     value: billing.filter(b => b.payment_status?.toLowerCase() === "paid").length,     icon: CheckCircle2,  color: "from-violet-600 to-violet-400",   glow: "shadow-violet-500/30"  },
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
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold text-white animate-[slideIn_0.3s_ease] ${toast.type === "success" ? "bg-blue-900" : "bg-red-500"}`}>
          {toast.type === "success" ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}


      {/* ── Add Bill Modal ────────────────────────────────────────────────────── */}
      {showAddModal && (
        <AddBillModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleMutateSuccess}
        />
      )}

      {/* ── Edit Bill Modal ───────────────────────────────────────────────────── */}
      {editTarget && (
        <EditBillModal
          bill={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={handleMutateSuccess}
        />
      )}

      <div className="mx-auto">
        {/* ── Page Header ───────────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-blue-950 tracking-tight">Billing</h1>
              <p className="text-slate-500 text-xs font-medium mt-0.5">Hospital Payment & Invoice Records</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Filter Pills */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                {["all", "paid", "unpaid"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      filterStatus === s ? "bg-blue-900 text-white shadow" : "text-slate-500 hover:text-blue-900"
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

              {/* ── ADD BILL BUTTON ── */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-2xl transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                Create Bill
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
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-[100%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[30deg] animate-[light-sweep_5s_infinite]" />
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-black text-blue-950">{s.value}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
              <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r ${s.color} opacity-50`} />
            </div>
          ))}
        </div>

        {/* ── Table Card ────────────────────────────────────────────────────── */}
        <div className="flex flex-col h-[400px] bg-white rounded-xl shadow-2xl shadow-blue-950/5 border border-blue-800/20 overflow-hidden">
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-800 text-white">
                  {["Bill ID", "Patient", "Doctor", "Consult Fee", "Medicine Cost", "Total", "Date", "Status", "Action"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-blue-900/5">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-24 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-blue-900 mx-auto" />
                      <p className="mt-3 text-[10px] font-bold text-blue-900/50 uppercase tracking-widest">Loading Records...</p>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-slate-400 font-semibold text-sm">
                      No billing records found
                    </td>
                  </tr>
                ) : (
                  paginated.map((bill) => (
                    <tr key={bill.id} className="group hover:bg-blue-900/[0.03] transition-colors">
                      {/* Bill ID */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <Receipt className="w-3.5 h-3.5 text-blue-700" />
                          </div>
                          <span className="text-xs font-black text-blue-900">#{bill.id}</span>
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-[10px] shadow-md shadow-blue-900/20 group-hover:rotate-3 transition-transform flex-shrink-0">
                            {bill.patient_name?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                          <span className="text-xs font-black text-slate-800">{bill.patient_name || "—"}</span>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-600">Dr. {bill.doctor_name || "—"}</span>
                        </div>
                      </td>

                      {/* Consult Fee */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center">
                            <DollarSign className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-600">
                            {bill.consultation_fee != null ? `₹${Number(bill.consultation_fee).toLocaleString()}` : "—"}
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
                            {bill.medicine_cost != null ? `₹${Number(bill.medicine_cost).toLocaleString()}` : "—"}
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
                            {bill.total_amount != null ? `₹${Number(bill.total_amount).toLocaleString()}` : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">
                            {bill.created_at
                              ? new Date(bill.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <PaymentBadge status={bill.payment_status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {/* ── EDIT BUTTON ── */}
                          <button
                            onClick={() => setEditTarget(bill)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-500 text-violet-600 hover:text-white border border-violet-200 hover:border-violet-500 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ──────────────────────────────────────────────────── */}
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
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`d${i}`} className="text-slate-400 text-xs px-1">…</span>
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