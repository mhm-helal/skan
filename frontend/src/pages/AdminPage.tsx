import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, BookOpen, Plus, Edit3, Trash2,
  X, Eye, CreditCard, MessageCircle
} from 'lucide-react';
import { useAuth } from '../store';
import api from '../api';
import type { Property, Booking, Admin, Payment } from '../types';

type SidebarTab = 'stats' | 'properties' | 'admins' | 'bookings' | 'payments' | 'chat';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SidebarTab>('stats');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'addProperty' | 'editProperty' | 'addAdmin' | 'viewBooking' | 'viewPayment'>('addProperty');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [propsRes, bookingsRes, adminsRes, paymentsRes] = await Promise.allSettled([
        api.get('/api/properties'),
        api.get('/api/bookings/admin'),
        api.get('/api/admin/admins'),
        api.get('/api/payments/admin'),
      ]);
      if (propsRes.status === 'fulfilled') setProperties(Array.isArray(propsRes.value.data) ? propsRes.value.data : []);
      if (bookingsRes.status === 'fulfilled') setBookings(Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data : []);
      if (adminsRes.status === 'fulfilled') setAdmins(Array.isArray(adminsRes.value.data) ? adminsRes.value.data : []);
      if (paymentsRes.status === 'fulfilled') setPayments(Array.isArray(paymentsRes.value.data) ? paymentsRes.value.data : []);
    } catch {}
  };

  const handleDeleteProperty = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا العقار؟')) return;
    try {
      await api.delete(`/api/properties/admin/${id}`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المسؤول؟')) return;
    try {
      await api.delete(`/api/admin/admins/${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch {}
  };

  const tabs = [
    { id: 'stats' as SidebarTab, icon: LayoutDashboard, label: 'الإحصائيات' },
    { id: 'properties' as SidebarTab, icon: Building2, label: 'العقارات' },
    { id: 'admins' as SidebarTab, icon: Users, label: 'المسؤولون' },
    { id: 'bookings' as SidebarTab, icon: BookOpen, label: 'الحجوزات' },
    { id: 'payments' as SidebarTab, icon: CreditCard, label: 'المدفوعات' },
    { id: 'chat' as SidebarTab, icon: MessageCircle, label: 'الدردشة' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 flex">
      <aside className="hidden md:flex w-64 flex-col border-l border-purple-500/10 bg-purple-500/5 p-4 fixed top-16 bottom-0 right-0">
        <div className="text-center mb-6 py-4">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <p className="text-sm font-medium text-white/80">{user?.name}</p>
          <p className="text-xs text-purple-300/40">مسؤول النظام</p>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'text-purple-300/40 hover:text-purple-300/60 hover:bg-purple-500/5'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 md:mr-64 p-4 md:p-8">
        <div className="md:hidden flex gap-1 overflow-x-auto mb-6 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'text-purple-300/40'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-2xl font-bold text-white/90 mb-6">لوحة الإحصائيات</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'إجمالي العقارات', value: properties.length, color: 'from-purple-500 to-violet-500' },
                  { label: 'الحجوزات', value: bookings.length, color: 'from-pink-500 to-rose-500' },
                  { label: 'المسؤولون', value: admins.length, color: 'from-indigo-500 to-blue-500' },
                  { label: 'الحجوزات المقبولة', value: bookings.filter((b) => b.status === 'accepted').length, color: 'from-green-500 to-emerald-500' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10"
                  >
                    <div className={`text-3xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-purple-300/50">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'properties' && (
            <motion.div
              key="properties"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white/90">إدارة العقارات</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setModalType('addProperty'); setSelectedItem(null); setShowModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white text-sm font-medium"
                >
                  <Plus size={16} />
                  إضافة عقار
                </motion.button>
              </div>

              <div className="space-y-3">
                {properties.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                    <img src={p.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop'} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white/90 truncate">{p.title}</h3>
                      <p className="text-sm text-purple-300/40 truncate">{p.address}</p>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-purple-300">{p.price.toLocaleString('ar-EG')} ج.م</div>
                      <div className={`text-xs ${p.is_available ? 'text-green-400' : 'text-red-400'}`}>
                        {p.is_available ? 'متاح' : 'غير متاح'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setModalType('editProperty'); setSelectedItem(p); setShowModal(true); }}
                        className="p-2 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(p.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {properties.length === 0 && (
                  <div className="text-center py-12 text-purple-300/40">لا توجد عقارات بعد</div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'admins' && (
            <motion.div
              key="admins"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white/90">إدارة المسؤولين</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setModalType('addAdmin'); setSelectedItem(null); setShowModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white text-sm font-medium"
                >
                  <Plus size={16} />
                  إضافة مسؤول
                </motion.button>
              </div>

              <div className="space-y-3">
                {admins.map((a) => (
                  <div key={a.id} className="flex items-center gap-4 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {a.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white/90">{a.name}</h3>
                      <p className="text-sm text-purple-300/40">{a.email}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300/60 text-xs">
                      {a.role}
                    </span>
                    <button
                      onClick={() => handleDeleteAdmin(a.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {admins.length === 0 && (
                  <div className="text-center py-12 text-purple-300/40">لا يوجد مسؤولون بعد</div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-2xl font-bold text-white/90 mb-6">إدارة الحجوزات</h2>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white/90 truncate">{b.property_title}</h3>
                      <p className="text-sm text-purple-300/40">
                        {b.user_name || 'طالب'} · {new Date(b.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-purple-300">{b.property_price?.toLocaleString('ar-EG')} ج.م</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        b.status === 'accepted' ? 'bg-green-500/10 text-green-400' :
                        b.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {b.status === 'accepted' ? 'مقبول' : b.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedItem(b); setShowModal(true); }}
                      className="p-2 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="text-center py-12 text-purple-300/40">لا توجد حجوزات بعد</div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-2xl font-bold text-white/90 mb-6">إدارة المدفوعات</h2>
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white/90 truncate">{p.property_title || `حجز #${p.booking_id}`}</h3>
                      <p className="text-sm text-purple-300/40">
                        {p.user_name || 'مستخدم'} · {new Date(p.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-purple-300">{p.amount?.toLocaleString('ar-EG')} ج.م</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                        p.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {p.status === 'approved' ? 'مقبول' : p.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedItem(p); setModalType('viewPayment'); setShowModal(true); }}
                      className="p-2 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                ))}
                {payments.length === 0 && (
                  <div className="text-center py-12 text-purple-300/40">لا توجد مدفوعات بعد</div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white/90">الدردشة</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin/chat')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white text-sm font-medium"
                >
                  <MessageCircle size={16} />
                  فتح الدردشة
                </motion.button>
              </div>
              <div className="p-8 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-center">
                <MessageCircle size={48} className="mx-auto mb-4 text-purple-500/20" />
                <p className="text-purple-300/40">اضغط على "فتح الدردشة" لإدارة المحادثات مع المستخدمين</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-[#0f0a24] border border-purple-500/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white/90">
                  {modalType === 'addProperty' && 'إضافة عقار جديد'}
                  {modalType === 'editProperty' && 'تعديل العقار'}
                  {modalType === 'addAdmin' && 'إضافة مسؤول جديد'}
                  {modalType === 'viewBooking' && 'تفاصيل الحجز'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20">
                  <X size={18} />
                </button>
              </div>

              {modalType === 'viewBooking' && selectedItem && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-purple-500/5">
                    <div className="text-sm text-purple-300/40">العقار</div>
                    <div className="text-white/90">{selectedItem.property_title}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/5">
                    <div className="text-sm text-purple-300/40">المحجز</div>
                    <div className="text-white/90">{selectedItem.user_name || 'غير معروف'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/5">
                    <div className="text-sm text-purple-300/40">البريد الإلكتروني</div>
                    <div className="text-white/90" dir="ltr">{selectedItem.user_email || 'غير متاح'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/5">
                    <div className="text-sm text-purple-300/40">السعر</div>
                    <div className="text-white/90">{selectedItem.property_price?.toLocaleString('ar-EG')} ج.م</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/5">
                    <div className="text-sm text-purple-300/40">التاريخ</div>
                    <div className="text-white/90">{new Date(selectedItem.created_at).toLocaleDateString('ar-EG')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/5">
                    <div className="text-sm text-purple-300/40">الحالة</div>
                    <div className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                      selectedItem.status === 'accepted' ? 'bg-green-500/10 text-green-400' :
                      selectedItem.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {selectedItem.status === 'accepted' ? 'مقبول' : selectedItem.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                    </div>
                  </div>
                </div>
              )}

              {modalType === 'viewPayment' && selectedItem && (
                <PaymentDetails
                  payment={selectedItem}
                  onAction={async (action) => {
                    try {
                      await api.post(`/api/payments/admin/${selectedItem.id}/${action}`);
                      setPayments((prev) => prev.map((p) => p.id === selectedItem.id ? { ...p, status: action === 'approve' ? 'approved' : 'rejected' } : p));
                      setShowModal(false);
                    } catch {}
                  }}
                />
              )}

              {(modalType === 'addProperty' || modalType === 'editProperty') && (
                <PropertyForm
                  initial={selectedItem}
                  onClose={() => setShowModal(false)}
                  onSaved={(p) => {
                    if (modalType === 'addProperty') setProperties((prev) => [...prev, p]);
                    else setProperties((prev) => prev.map((x) => x.id === p.id ? p : x));
                    setShowModal(false);
                  }}
                />
              )}

              {modalType === 'addAdmin' && (
                <AdminForm
                  onClose={() => setShowModal(false)}
                  onSaved={(a) => {
                    setAdmins((prev) => [...prev, a]);
                    setShowModal(false);
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PropertyForm({ initial, onClose, onSaved }: { initial: any; onClose: () => void; onSaved: (p: Property) => void }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    address: initial?.address || '',
    city: initial?.city || '',
    price: initial?.price || '',
    image_url: initial?.image_url || '',
    rooms: initial?.rooms || '',
    bathrooms: initial?.bathrooms || '',
    area: initial?.area || '',
    tags: initial?.tags?.join(', ') || '',
    owner_name: initial?.owner_name || '',
    owner_phone: initial?.owner_phone || '',
    description: initial?.description || '',
    is_available: initial?.is_available ?? 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        rooms: Number(form.rooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        is_available: Number(form.is_available),
      };
      let res;
      if (initial?.id) {
        res = await api.put(`/api/properties/admin/${initial.id}`, payload);
      } else {
        res = await api.post('/api/properties/admin', payload);
      }
      onSaved(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 placeholder-purple-300/30 focus:outline-none focus:border-purple-500/30 text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>}
      <input className={inputClass} placeholder="عنوان العقار" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <input className={inputClass} placeholder="العنوان التفصيلي" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
      <div className="grid grid-cols-2 gap-3">
        <input className={inputClass} placeholder="المدينة" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <input className={inputClass} type="number" placeholder="السعر" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <input className={inputClass} type="number" placeholder="الغرف" value={form.rooms} onChange={(e) => setForm({ ...form, rooms: e.target.value })} required />
        <input className={inputClass} type="number" placeholder="الحمامات" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} required />
        <input className={inputClass} type="number" placeholder="المساحة" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required />
      </div>
      <input className={inputClass} placeholder="رابط الصورة" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
      <input className={inputClass} placeholder="الوسوم (مفصولة بفواصل)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
      <input className={inputClass} placeholder="اسم المالك" value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} required />
      <input className={inputClass} placeholder="هاتف المالك" value={form.owner_phone} onChange={(e) => setForm({ ...form, owner_phone: e.target.value })} required />
      <textarea className={inputClass} rows={3} placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <select className={inputClass} value={form.is_available} onChange={(e) => setForm({ ...form, is_available: Number(e.target.value) })}>
        <option value={1}>متاح</option>
        <option value={0}>غير متاح</option>
      </select>
      <div className="flex gap-3 pt-2">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white font-bold text-sm disabled:opacity-50">
          {loading ? 'جاري الحفظ...' : initial?.id ? 'تحديث' : 'إضافة'}
        </motion.button>
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-purple-500/10 text-purple-300 text-sm">إلغاء</button>
      </div>
    </form>
  );
}

function AdminForm({ onClose, onSaved }: { onClose: () => void; onSaved: (a: Admin) => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/admin/admins', form);
      onSaved(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 placeholder-purple-300/30 focus:outline-none focus:border-purple-500/30 text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>}
      <input className={inputClass} placeholder="الاسم" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input className={inputClass} type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input className={inputClass} type="password" placeholder="كلمة المرور" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="admin">مسؤول</option>
        <option value="superadmin">مسؤول رئيسي</option>
      </select>
      <div className="flex gap-3 pt-2">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white font-bold text-sm disabled:opacity-50">
          {loading ? 'جاري الإضافة...' : 'إضافة مسؤول'}
        </motion.button>
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-purple-500/10 text-purple-300 text-sm">إلغاء</button>
      </div>
    </form>
  );
}

function PaymentDetails({ payment, onAction }: { payment: Payment; onAction: (action: 'approve' | 'reject') => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  const handle = async (action: 'approve' | 'reject') => {
    setLoading(true);
    await onAction(action);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-purple-500/5">
        <div className="text-sm text-purple-300/40">المستخدم</div>
        <div className="text-white/90">{payment.user_name || 'غير معروف'}</div>
        <div className="text-xs text-purple-300/30" dir="ltr">{payment.user_email}</div>
      </div>
      <div className="p-3 rounded-xl bg-purple-500/5">
        <div className="text-sm text-purple-300/40">العقار</div>
        <div className="text-white/90">{payment.property_title || `حجز #${payment.booking_id}`}</div>
      </div>
      <div className="p-3 rounded-xl bg-purple-500/5">
        <div className="text-sm text-purple-300/40">المبلغ</div>
        <div className="text-white/90 font-bold">{payment.amount?.toLocaleString('ar-EG')} ج.م</div>
      </div>
      <div className="p-3 rounded-xl bg-purple-500/5">
        <div className="text-sm text-purple-300/40">طريقة الدفع</div>
        <div className="text-white/90">
          {payment.method === 'bank_transfer' ? 'تحويل بنكي' : payment.method === 'instapay' ? 'InstaPay' : 'فوري'}
        </div>
      </div>
      {payment.reference_number && (
        <div className="p-3 rounded-xl bg-purple-500/5">
          <div className="text-sm text-purple-300/40">رقم المرجع</div>
          <div className="text-white/90 font-mono">{payment.reference_number}</div>
        </div>
      )}
      {payment.screenshot_url && (
        <div className="p-3 rounded-xl bg-purple-500/5">
          <div className="text-sm text-purple-300/40 mb-2">الإيصال</div>
          <img src={`http://localhost:8000${payment.screenshot_url}`} alt="Screenshot" className="w-full max-h-64 object-contain rounded-xl" />
        </div>
      )}
      {payment.status === 'pending' && (
        <div className="flex gap-3 pt-2">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handle('approve')} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm disabled:opacity-50">
            ✅ قبول
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handle('reject')} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm disabled:opacity-50">
            ❌ رفض
          </motion.button>
        </div>
      )}
    </div>
  );
}
