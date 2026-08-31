import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Bath, Maximize, MapPin, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../store';
import api from '../api';
import type { Property } from '../types';

type Tab = 'details' | '3d' | 'features';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    api.get(`/api/properties/${id}`).then((res) => setProperty(res.data)).catch(() => {
      const fallback: Record<string, Property> = {
        '1': { id: 1, title: 'شقة سكنية حديثة', address: 'التجمع الخامس، القاهرة الجديدة', city: 'القاهرة الجديدة', price: 8200, image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', rooms: 3, bathrooms: 2, area: 120, tags: ['حديثة', 'مفروشة', 'أمن 24 ساعة'], owner_name: 'أحمد محمد', owner_phone: '01012345678', description: 'شقة سكنية حديثة بإطلالة رائعة على المدينة.', is_available: true },
        '2': { id: 2, title: 'أستوديو راقٍ', address: 'شارع النزهة، مدينة الشروق', city: 'مدينة الشروق', price: 5000, image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', rooms: 1, bathrooms: 1, area: 55, tags: ['أستوديو', 'أنيق', 'قريب من المترو'], owner_name: 'فاطمة علي', owner_phone: '01098765432', description: 'أستوديو أنيق مثالي للطلاب والأفراد.', is_available: true },
        '3': { id: 3, title: 'شقة بغرفتين وشرفة', address: 'المنصورة الجديدة، مدينة بدر', city: 'مدينة بدر', price: 6500, image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', rooms: 2, bathrooms: 1, area: 85, tags: ['شرفة', 'مطبخ مجهز', 'حديقة'], owner_name: 'محمد حسن', owner_phone: '01155544433', description: 'شقة واسعة بشرفة تطل على الحديقة.', is_available: true },
        '4': { id: 4, title: 'شقة فاخرة بالكامل', address: 'Fifth Settlement، القاهرة الجديدة', city: 'القاهرة الجديدة', price: 12000, image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', rooms: 4, bathrooms: 3, area: 200, tags: ['فاخرة', 'جاكوزي', 'حديقة خاصة'], owner_name: 'خالد عبدالله', owner_phone: '01288877766', description: 'شقة فاخرة في كومباوند راقي.', is_available: true },
        '5': { id: 5, title: 'غرفة مشتركة للطلاب', address: 'شارع جامعة الدول العربية، الشروق', city: 'الشروق', price: 2200, image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', rooms: 1, bathrooms: 1, area: 25, tags: ['مشتركة', 'للطلاب'], owner_name: 'سارة إبراهيم', owner_phone: '01033322211', description: 'غرفة مشتركة مثالية للطلاب.', is_available: true },
        '6': { id: 6, title: 'شقة عائلية واسعة', address: 'مدينتي، Fifth Settlement', city: 'مدينتي', price: 9800, image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', rooms: 3, bathrooms: 2, area: 150, tags: ['عائلية', 'واسعة', 'حديقة'], owner_name: 'عمر السيد', owner_phone: '01199988877', description: 'شقة عائلية واسعة في كومباوند مدينتي.', is_available: true },
      };
      setProperty(fallback[id || ''] || null);
    });
  }, [id]);

  const handleBook = async () => {
    if (!user) return;
    setBookingLoading(true);
    setBookingError('');
    try {
      const res = await api.post('/api/bookings', { property_id: Number(id) });
      setBookingId(res.data.id);
      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(err.response?.data?.detail || 'حدث خطأ أثناء الحجز');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const features = [
    { label: 'عدد الغرف', value: property.rooms },
    { label: 'عدد الحمامات', value: property.bathrooms },
    { label: 'المساحة', value: `${property.area} م²` },
    { label: 'المدينة', value: property.city },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-purple-300/50 hover:text-purple-300 transition-colors mb-6">
            <ArrowRight size={16} />
            العودة للرئيسية
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  src={property.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop'}
                  alt={property.title}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0514] via-transparent to-transparent" />
                <div className="absolute bottom-6 right-6">
                  <h1 className="text-3xl font-bold text-white/90 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-purple-300/60">
                    <MapPin size={16} />
                    {property.address}, {property.city}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 p-1 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                {(['details', '3d', 'features'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-purple-300/40 hover:text-purple-300/60'
                    }`}
                  >
                    {tab === 'details' ? 'التفاصيل' : tab === '3d' ? 'ثلاثي الأبعاد' : 'المميزات'}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10">
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-xl font-bold text-white/90 mb-4">وصف العقار</h3>
                    <p className="text-purple-300/50 leading-relaxed">{property.description || 'لا يوجد وصف متاح لهذا العقار.'}</p>
                  </div>
                )}
                {activeTab === '3d' && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                      <Maximize size={32} className="text-purple-400" />
                    </div>
                    <p className="text-purple-300/50">تجربة ثلاثية الأبعاد ستكون متاحة قريباً</p>
                  </div>
                )}
                {activeTab === 'features' && (
                  <div className="grid grid-cols-2 gap-4">
                    {features.map((f) => (
                      <div key={f.label} className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <div className="text-sm text-purple-300/40 mb-1">{f.label}</div>
                        <div className="text-lg font-bold text-white/90">{f.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-3xl font-black bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    {property.price.toLocaleString('ar-EG')} ج.م
                  </div>
                  <div className="text-sm text-purple-300/40">شهرياً</div>
                </div>

                <div className="flex items-center gap-4 text-sm text-purple-300/50 mb-6 justify-center">
                  <span className="flex items-center gap-1"><BedDouble size={14} /> {property.rooms} غرف</span>
                  <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms} حمام</span>
                  <span className="flex items-center gap-1"><Maximize size={14} /> {property.area} م²</span>
                </div>

                {property.tags && property.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-6 justify-center">
                    {property.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300/60 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {bookingSuccess ? (
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                    <Lock size={24} className="mx-auto mb-2 text-purple-400" />
                    <p className="text-purple-300 font-medium">تم الحجز بنجاح!</p>
                    <p className="text-sm text-purple-300/60 mt-1">ادفع 1,000 ج.م عمولة التوكيل لفتح بيانات المالك</p>
                    <Link
                      to={`/payment?booking_id=${bookingId}`}
                      className="mt-4 inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                    >
                      💳 ادفع الآن — 1,000 ج.م
                    </Link>
                  </div>
                ) : user ? (
                  <>
                    {bookingError && (
                      <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
                        {bookingError}
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBook}
                      disabled={bookingLoading}
                      className="w-full py-3 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
                    >
                      {bookingLoading ? 'جاري الحجز...' : 'احجز الآن'}
                    </motion.button>
                    <p className="text-xs text-purple-300/30 text-center mt-3">
                      سيتم تحويلك للمالك بعد تأكيد الحجز
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block w-full py-3 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white font-bold text-center hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                    >
                      سجل دخولك للحجز
                    </Link>
                    <p className="text-xs text-purple-300/30 text-center">
                      تحتاج حساباً لإجراء الحجز
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
