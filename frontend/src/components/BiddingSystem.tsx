import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, TrendingUp, Check, X } from 'lucide-react';

interface Bid {
  id: number;
  amount: number;
  note: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
}

interface BiddingSystemProps {
  propertyId: number;
  currentPrice: number;
  onBidSubmitted: () => void;
}

const simulatedBids: Bid[] = [
  { id: 1, amount: 1200, note: 'أريد هذا السكن بشدة', status: 'accepted', date: '2026-08-28' },
  { id: 2, amount: 1100, note: '', status: 'rejected', date: '2026-08-27' },
  { id: 3, amount: 1250, note: 'هل يمكن التفاوض؟', status: 'pending', date: '2026-08-29' },
];

const statusConfig = {
  pending: { label: 'قيد المراجعة', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  accepted: { label: 'مقبول', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  rejected: { label: 'مرفوض', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export default function BiddingSystem({ propertyId, currentPrice, onBidSubmitted }: BiddingSystemProps) {
  const [showForm, setShowForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidNote, setBidNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!bidAmount || Number(bidAmount) <= 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setBidAmount('');
      setBidNote('');
      onBidSubmitted();
    }, 2000);
  };

  return (
    <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Gavel className="w-5 h-5 text-purple-400" />
          تقديم عرض
        </h3>
        <div className="text-right">
          <p className="text-xs text-gray-400">السعر الحالي</p>
          <p className="text-xl font-bold bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {currentPrice.toLocaleString('ar-SA')} ر.س
          </p>
        </div>
      </div>

      {!showForm && !submitted && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-2xl bg-gradient-to-l from-purple-600 to-pink-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
        >
          <TrendingUp className="w-4 h-4" />
          قدم عرض
        </motion.button>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-8 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
            <Check className="w-7 h-7 text-green-400" />
          </div>
          <p className="text-green-400 font-bold">تم إرسال عرضك بنجاح!</p>
          <p className="text-gray-400 text-sm mt-1">سيتم مراجعته من المالك</p>
        </motion.div>
      )}

      {showForm && !submitted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-400 mb-1">المبلغ المقترح (ر.س)</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="أدخل المبلغ"
              className="w-full px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">ملاحظة (اختياري)</label>
            <textarea
              value={bidNote}
              onChange={(e) => setBidNote(e.target.value)}
              placeholder="رسالة للمالك..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!bidAmount || Number(bidAmount) <= 0}
              className="flex-1 py-3 rounded-xl bg-gradient-to-l from-purple-600 to-pink-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إرسال العرض
            </motion.button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-6">
        <h4 className="text-sm font-bold text-gray-400 mb-3">سجل العروض</h4>
        <div className="space-y-3">
          {simulatedBids.map((bid) => {
            const config = statusConfig[bid.status];
            return (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">{bid.amount.toLocaleString('ar-SA')} ر.س</p>
                    {bid.note && <p className="text-gray-400 text-sm mt-1">{bid.note}</p>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-2">{bid.date}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
