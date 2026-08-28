"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  Plus,
  Trash2,
  Edit3,
  LogOut,
  X,
  Check,
  Shield,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useUser } from "@/lib/useUser";

type Property = {
  id: number;
  title: string;
  address: string;
  city: string;
  price: number;
  image: string;
  rooms: number;
  bathrooms: number;
  area: number;
  tags: string;
  owner_name: string;
  owner_phone: string;
  description: string;
  available: number;
};

type AdminUser = {
  id: number;
  user_id: number;
  role: string;
  name: string;
  email: string;
  created_at: string;
};

type Booking = {
  id: number;
  user_id: number;
  property_id: number;
  property_title: string;
  property_price: number;
  status: string;
  brokerage_paid: number;
  created_at: string;
  user_name: string;
  user_email: string;
};

type Tab = "dashboard" | "properties" | "admins" | "bookings";

const emptyProperty = {
  title: "",
  address: "",
  city: "",
  price: 0,
  image: "",
  rooms: 1,
  bathrooms: 1,
  area: 50,
  tags: "[]",
  owner_name: "",
  owner_phone: "",
  description: "",
};

export default function AdminPage() {
  const { user, loading: authLoading, logout } = useUser();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [properties, setProperties] = useState<Property[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<number | null>(null);
  const [propForm, setPropForm] = useState(emptyProperty);

  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("admin");

  const fetchAdmin = useCallback(async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    if (res.status === 403) {
      setError("لا توجد صلاحية للوصول إلى هذه الصفحة");
      return null;
    }
    return res.json();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError("يرجى تسجيل الدخول أولاً");
      return;
    }

    const load = async () => {
      setLoading(true);
      const [pRes, aRes, bRes] = await Promise.all([
        fetchAdmin("/api/admin/properties"),
        fetchAdmin("/api/admin/admins"),
        fetchAdmin("/api/admin/bookings"),
      ]);

      if (pRes) setProperties(pRes.properties || []);
      if (aRes) setAdmins(aRes.admins || []);
      if (bRes) setBookings(bRes.bookings || []);
      setLoading(false);
    };

    load();
  }, [user, authLoading, fetchAdmin]);

  const refreshData = async () => {
    const [pRes, aRes, bRes] = await Promise.all([
      fetchAdmin("/api/admin/properties"),
      fetchAdmin("/api/admin/admins"),
      fetchAdmin("/api/admin/bookings"),
    ]);
    if (pRes) setProperties(pRes.properties || []);
    if (aRes) setAdmins(aRes.admins || []);
    if (bRes) setBookings(bRes.bookings || []);
  };

  const saveProperty = async () => {
    const url = editingProperty
      ? `/api/admin/properties/${editingProperty}`
      : "/api/admin/properties";
    const method = editingProperty ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...propForm,
        price: Number(propForm.price),
        rooms: Number(propForm.rooms),
        bathrooms: Number(propForm.bathrooms),
        area: Number(propForm.area),
        tags: propForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });

    setShowPropertyForm(false);
    setEditingProperty(null);
    setPropForm(emptyProperty);
    refreshData();
  };

  const deleteProperty = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الشقة؟")) return;
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    refreshData();
  };

  const startEdit = (p: Property) => {
    setEditingProperty(p.id);
    setPropForm({
      title: p.title,
      address: p.address,
      city: p.city,
      price: p.price,
      image: p.image,
      rooms: p.rooms,
      bathrooms: p.bathrooms,
      area: p.area,
      tags: typeof p.tags === "string" ? p.tags : JSON.stringify(p.tags),
      owner_name: p.owner_name,
      owner_phone: p.owner_phone,
      description: p.description,
    });
    setShowPropertyForm(true);
  };

  const addAdmin = async () => {
    if (!newAdminEmail) return;
    const res = await fetchAdmin("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newAdminEmail, role: newAdminRole }),
    });
    if (res?.success) {
      setNewAdminEmail("");
      refreshData();
    } else if (res?.error) {
      alert(res.error);
    }
  };

  const removeAdmin = async (userId: number) => {
    if (!confirm("هل أنت متأكد من إزالة صلاحية المسؤول من هذا المستخدم؟")) return;
    await fetchAdmin("/api/admin/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    refreshData();
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={40} className="animate-spin text-fuchsia-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
        <Shield size={64} className="text-red-400" />
        <h1 className="text-2xl font-bold">{error}</h1>
        <Link href="/" className="text-fuchsia-500 hover:underline">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    );
  }

  const stats = {
    totalProperties: properties.length,
    availableProperties: properties.filter((p) => p.available).length,
    totalBookings: bookings.length,
    totalRevenue: bookings.filter((b) => b.brokerage_paid).length * 1000,
    totalAdmins: admins.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-fuchsia-50/30 to-orange-50/20 dark:from-[#0a0514] dark:via-[#12082a] dark:to-[#1a0e2e]">
      {/* الشريط الجانبي */}
      <aside className="fixed right-0 top-0 h-full w-64 border-l border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#0e0720]/90">
        <div className="flex h-full flex-col p-5">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ShieldCheck className="text-fuchsia-500" size={24} />
              <span className="text-xl font-black">
                <span className="bg-gradient-to-r from-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                  Skan
                </span>
              </span>
            </Link>
            <DarkModeToggle />
          </div>

          <div className="mb-4 rounded-xl bg-fuchsia-500/10 p-3">
            <p className="text-xs text-black/50 dark:text-white/50">مرحباً بك</p>
            <p className="font-bold">{user?.name}</p>
            <p className="text-xs text-fuchsia-500">
              {admins.find((a) => a.user_id === user?.id)?.role === "main"
                ? "المسؤول الرئيسي"
                : "مسؤول"}
            </p>
          </div>

          <nav className="flex-1 space-y-1">
            {(
              [
                { key: "dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
                { key: "properties", icon: Building2, label: "العقارات" },
                { key: "admins", icon: Users, label: "المسؤولون" },
                { key: "bookings", icon: CalendarCheck, label: "الحجوزات" },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  tab === item.key
                    ? "bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white shadow-lg"
                    : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="space-y-2 border-t border-black/10 pt-4 dark:border-white/10">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-black/60 transition hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
            >
              <ArrowRight size={16} />
              العودة إلى الموقع
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-500/10"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="mr-64 min-h-screen p-8">
        {/* لوحة التحكم */}
        {tab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-8 text-3xl font-black">لوحة التحكم</h1>
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "إجمالي العقارات", value: stats.totalProperties, color: "fuchsia" },
                { label: "العقارات المتاحة", value: stats.availableProperties, color: "green" },
                { label: "إجمالي الحجوزات", value: stats.totalBookings, color: "orange" },
                { label: "إيرادات الوساطة", value: `${stats.totalRevenue.toLocaleString()} ج.م`, color: "yellow" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-black/5 bg-white/70 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
                >
                  <p className="text-sm text-black/50 dark:text-white/50">{s.label}</p>
                  <p className={`mt-2 text-3xl font-black text-${s.color}-500`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-black/5 bg-white/70 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-4 text-xl font-bold">آخر الحجوزات</h2>
              {bookings.length === 0 ? (
                <p className="text-black/50 dark:text-white/50">لا توجد حجوزات حتى الآن</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="flex items-center justify-between rounded-xl bg-black/5 p-4 dark:bg-white/5">
                      <div>
                        <p className="font-bold">{b.user_name}</p>
                        <p className="text-sm text-black/50 dark:text-white/50">{b.property_title}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-green-500">
                          {b.brokerage_paid ? "مدفوع" : "قيد الانتظار"}
                        </p>
                        <p className="text-xs text-black/40 dark:text-white/40">
                          {new Date(b.created_at).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* العقارات */}
        {tab === "properties" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-black">العقارات</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingProperty(null);
                  setPropForm(emptyProperty);
                  setShowPropertyForm(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-orange-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg"
              >
                <Plus size={18} />
                إضافة عقار
              </motion.button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <div
                  key={p.id}
                  className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="text-sm text-black/50 dark:text-white/50">
                      {p.city} — {p.address}
                    </p>
                    <p className="mt-2 text-lg font-black text-fuchsia-600 dark:text-fuchsia-400">
                      {p.price.toLocaleString()} ج.م
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-fuchsia-500/10 py-2 text-xs font-bold text-fuchsia-500 transition hover:bg-fuchsia-500/20"
                      >
                        <Edit3 size={14} />
                        تعديل
                      </button>
                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-500/10 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
                      >
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                  {!p.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <span className="rounded-full bg-red-500 px-4 py-1 text-sm font-bold text-white">
                        غير متاح
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* نموذج تعديل العقار */}
            <AnimatePresence>
              {showPropertyForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"
                  onClick={() => setShowPropertyForm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1a1033]"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-xl font-bold">
                        {editingProperty ? "تعديل العقار" : "إضافة عقار جديد"}
                      </h2>
                      <button
                        onClick={() => setShowPropertyForm(false)}
                        className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <input
                        placeholder="اسم العقار"
                        value={propForm.title}
                        onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                        className="w-full rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="المدينة"
                          value={propForm.city}
                          onChange={(e) => setPropForm({ ...propForm, city: e.target.value })}
                          className="rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                        />
                        <input
                          placeholder="العنوان"
                          value={propForm.address}
                          onChange={(e) => setPropForm({ ...propForm, address: e.target.value })}
                          className="rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                        />
                      </div>
                      <input
                        placeholder="رابط الصورة"
                        value={propForm.image}
                        onChange={(e) => setPropForm({ ...propForm, image: e.target.value })}
                        className="w-full rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="number"
                          placeholder="السعر (ج.م)"
                          value={propForm.price || ""}
                          onChange={(e) => setPropForm({ ...propForm, price: Number(e.target.value) })}
                          className="rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                        />
                        <input
                          type="number"
                          placeholder="عدد الغرف"
                          value={propForm.rooms || ""}
                          onChange={(e) => setPropForm({ ...propForm, rooms: Number(e.target.value) })}
                          className="rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                        />
                        <input
                          type="number"
                          placeholder="عدد الحمامات"
                          value={propForm.bathrooms || ""}
                          onChange={(e) => setPropForm({ ...propForm, bathrooms: Number(e.target.value) })}
                          className="rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                        />
                      </div>
                      <input
                        type="number"
                        placeholder="المساحة بالمتر المربع"
                        value={propForm.area || ""}
                        onChange={(e) => setPropForm({ ...propForm, area: Number(e.target.value) })}
                        className="w-full rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                      />
                      <input
                        placeholder="الوسوم (مفصولة بفواصل)"
                        value={propForm.tags.replace(/[[\]"']/g, "")}
                        onChange={(e) => setPropForm({ ...propForm, tags: JSON.stringify(e.target.value.split(",").map((t) => t.trim()).filter(Boolean)) })}
                        className="w-full rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                      />
                      <input
                        placeholder="اسم مالك العقار"
                        value={propForm.owner_name}
                        onChange={(e) => setPropForm({ ...propForm, owner_name: e.target.value })}
                        className="w-full rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                      />
                      <input
                        placeholder="رقم هاتف مالك العقار"
                        value={propForm.owner_phone}
                        onChange={(e) => setPropForm({ ...propForm, owner_phone: e.target.value })}
                        className="w-full rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                      />
                      <textarea
                        placeholder="وصف العقار"
                        rows={3}
                        value={propForm.description}
                        onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                        className="w-full resize-none rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                      />

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={saveProperty}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-orange-400 py-3 font-bold text-white shadow-lg"
                        >
                          <Check size={18} />
                          {editingProperty ? "حفظ التعديلات" : "إضافة العقار"}
                        </motion.button>
                        <button
                          onClick={() => setShowPropertyForm(false)}
                          className="rounded-xl border border-black/10 px-6 py-3 font-bold dark:border-white/20"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* المسؤولون */}
        {tab === "admins" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-8 text-3xl font-black">المسؤولون</h1>

            <div className="mb-8 rounded-2xl border border-black/5 bg-white/70 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-4 text-lg font-bold">إضافة مسؤول جديد</h2>
              <p className="mb-4 text-sm text-black/50 dark:text-white/50">
                يجب أن يكون المستخدم مسجلاً في الموقع أولاً. أدخل البريد الإلكتروني للمستخدم وأضفه كمسؤول.
              </p>
              <div className="flex gap-3">
                <input
                  placeholder="البريد الإلكتروني للمستخدم"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none focus:border-fuchsia-400 dark:border-white/20 dark:bg-white/5"
                />
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="rounded-xl border border-black/10 bg-black/5 p-3 text-sm outline-none dark:border-white/20 dark:bg-white/5"
                >
                  <option value="admin">مسؤول</option>
                  <option value="editor">محرر</option>
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addAdmin}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-orange-400 px-6 py-3 font-bold text-white shadow-lg"
                >
                  <Plus size={18} />
                  إضافة
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              {admins.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/70 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        a.role === "main"
                          ? "bg-gradient-to-r from-fuchsia-500 to-orange-400"
                          : "bg-fuchsia-500/20"
                      }`}
                    >
                      {a.role === "main" ? (
                        <ShieldCheck size={18} className="text-white" />
                      ) : (
                        <Shield size={18} className="text-fuchsia-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{a.name}</p>
                      <p className="text-sm text-black/50 dark:text-white/50">{a.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        a.role === "main"
                          ? "bg-fuchsia-500/20 text-fuchsia-500"
                          : "bg-orange-400/20 text-orange-400"
                      }`}
                    >
                      {a.role === "main" ? "المسؤول الرئيسي" : a.role === "admin" ? "مسؤول" : "محرر"}
                    </span>
                    {a.role !== "main" && (
                      <button
                        onClick={() => removeAdmin(a.user_id)}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* الحجوزات */}
        {tab === "bookings" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-8 text-3xl font-black">الحجوزات</h1>
            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-black/5 bg-white/70 p-12 text-center backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <CalendarCheck size={48} className="mx-auto mb-4 text-black/20 dark:text-white/20" />
                <p className="text-lg font-bold text-black/50 dark:text-white/50">لا توجد حجوزات حتى الآن</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/70 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
                  >
                    <div>
                      <p className="font-bold">{b.user_name}</p>
                      <p className="text-sm text-black/50 dark:text-white/50">{b.user_email}</p>
                      <p className="mt-1 text-sm text-fuchsia-500">{b.property_title}</p>
                    </div>
                    <div className="text-left">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                          b.status === "confirmed"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {b.status === "confirmed" ? "مؤكد" : "قيد الانتظار"}
                      </span>
                      <p className="mt-1 text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400">
                        {b.property_price.toLocaleString()} ج.م
                      </p>
                      <p className="text-xs text-black/40 dark:text-white/40">
                        {new Date(b.created_at).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
