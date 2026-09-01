import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, BedDouble, DollarSign, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const cities = [
  'القاهرة الجديدة',
  'مدينة الشروق',
  'مدينة بدر',
  'مدينتي',
  '6 أكتوبر',
  'الشيخ زايد',
  'المعادي',
  'مصر الجديدة',
  'الدقي',
  'المنصورة',
];

const roomOptions = [
  { value: 0, label: 'الكل' },
  { value: 1, label: 'غرفة واحدة' },
  { value: 2, label: 'غرفتان' },
  { value: 3, label: '3 غرف' },
  { value: 4, label: '4+ غرف' },
];

interface SearchFiltersProps {
  onSearch?: (filters: {
    searchQuery: string;
    city: string;
    minPrice: number;
    maxPrice: number;
    rooms: number;
  }) => void;
  compact?: boolean;
}

export default function SearchFilters({ onSearch, compact }: SearchFiltersProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (city) params.set('city', city);
    if (minPrice > 0) params.set('min_price', String(minPrice));
    if (maxPrice > 0) params.set('max_price', String(maxPrice));
    if (rooms > 0) params.set('rooms', String(rooms));

    const query = params.toString();

    if (onSearch) {
      onSearch({ searchQuery, city, minPrice, maxPrice, rooms });
    }

    navigate(`/properties${query ? `?${query}` : ''}`);
  };

  return (
    <div
      className={`w-full ${compact ? '' : 'max-w-4xl mx-auto'}`}
      dir="rtl"
    >
      <div
        className={`
          rounded-3xl border border-purple-500/10 bg-purple-500/5 backdrop-blur-xl
          ${compact ? 'p-4' : 'p-6 md:p-8'}
        `}
      >
        {/* Main Search Bar */}
        <div
          className={`
            flex items-center gap-3 rounded-2xl bg-[#0a0514]/60 border border-purple-500/10
            ${compact ? 'p-3' : 'p-4'}
          `}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
            <Search size={18} className="text-purple-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن سكن، شقة، فيلا..."
            className="flex-1 bg-transparent text-white placeholder:text-purple-300/30 outline-none text-sm md:text-base"
            dir="rtl"
          />
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm
              ${showAdvanced
                ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                : 'border-purple-500/10 text-purple-300/50 hover:border-purple-500/20 hover:text-purple-300/70'
              }
            `}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">بحث متقدم</span>
          </button>
        </div>

        {/* Filters Row */}
        <div
          className={`
            flex flex-col sm:flex-row items-stretch sm:items-center gap-3
            ${compact ? 'mt-3' : 'mt-4'}
          `}
        >
          {/* City Dropdown */}
          <div className="relative flex-1 min-w-0">
            <MapPin
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none"
            />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none bg-[#0a0514]/60 border border-purple-500/10 rounded-xl px-4 py-3 pr-10 text-sm text-white/80 outline-none focus:border-purple-500/30 transition-colors cursor-pointer"
              dir="rtl"
            >
              <option value="">جميع المدن</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <DollarSign
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none"
              />
              <input
                type="number"
                value={minPrice || ''}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                placeholder="من"
                min={0}
                className="w-24 bg-[#0a0514]/60 border border-purple-500/10 rounded-xl px-3 py-3 pr-8 text-sm text-white/80 outline-none focus:border-purple-500/30 transition-colors placeholder:text-purple-300/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <span className="text-purple-300/30 text-sm">-</span>
            <div className="relative">
              <DollarSign
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none"
              />
              <input
                type="number"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                placeholder="إلى"
                min={0}
                className="w-24 bg-[#0a0514]/60 border border-purple-500/10 rounded-xl px-3 py-3 pr-8 text-sm text-white/80 outline-none focus:border-purple-500/30 transition-colors placeholder:text-purple-300/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Rooms Dropdown */}
          <div className="relative">
            <BedDouble
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 pointer-events-none"
            />
            <select
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="appearance-none bg-[#0a0514]/60 border border-purple-500/10 rounded-xl px-4 py-3 pr-10 text-sm text-white/80 outline-none focus:border-purple-500/30 transition-colors cursor-pointer"
              dir="rtl"
            >
              {roomOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className={`
              flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all
              bg-gradient-to-l from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/25
              ${compact ? 'px-6 py-3 text-sm' : 'px-8 py-3 text-sm md:text-base'}
            `}
          >
            <Search size={18} />
            بحث
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-purple-500/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Min Price (Advanced) */}
                  <div>
                    <label className="block text-xs text-purple-300/40 mb-2">السعر الأدنى (ج.م/شهرياً)</label>
                    <input
                      type="range"
                      min={0}
                      max={20000}
                      step={500}
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full accent-purple-500 h-1.5 rounded-full bg-purple-500/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/30"
                    />
                    <div className="flex justify-between text-xs text-purple-300/30 mt-1">
                      <span>٠</span>
                      <span className="text-purple-400/60 font-medium">
                        {minPrice.toLocaleString('ar-EG')} ج.م
                      </span>
                      <span>٢٠,٠٠٠</span>
                    </div>
                  </div>

                  {/* Max Price (Advanced) */}
                  <div>
                    <label className="block text-xs text-purple-300/40 mb-2">السعر الأقصى (ج.م/شهرياً)</label>
                    <input
                      type="range"
                      min={0}
                      max={20000}
                      step={500}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-purple-500 h-1.5 rounded-full bg-purple-500/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/30"
                    />
                    <div className="flex justify-between text-xs text-purple-300/30 mt-1">
                      <span>٠</span>
                      <span className="text-purple-400/60 font-medium">
                        {maxPrice.toLocaleString('ar-EG')} ج.م
                      </span>
                      <span>٢٠,٠٠٠</span>
                    </div>
                  </div>
                </div>

                {/* Room Quick Picks */}
                <div className="mt-4">
                  <label className="block text-xs text-purple-300/40 mb-2">عدد الغرف</label>
                  <div className="flex flex-wrap gap-2">
                    {roomOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setRooms(opt.value)}
                        className={`
                          px-4 py-2 rounded-xl text-sm font-medium transition-all
                          ${rooms === opt.value
                            ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300'
                            : 'border border-purple-500/10 text-purple-300/40 hover:border-purple-500/20 hover:text-purple-300/60'
                          }
                        `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
