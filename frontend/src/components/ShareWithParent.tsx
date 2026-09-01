import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Check, MessageCircle, Send } from 'lucide-react';
import type { Property } from '../types';

interface ShareWithParentProps {
  property: Property;
}

export default function ShareWithParent({ property }: ShareWithParentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `تفاصيل العقار: ${property.title}
العنوان: ${property.address}، ${property.city}
السعر: ${property.price.toLocaleString('ar-SA')} ر.س
الغرف: ${property.rooms} | الحمامات: ${property.bathrooms}
المساحة: ${property.area} م²
الوصف: ${property.description}
رابط العقار: ${window.location.origin}/property/${property.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareViaWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const shareViaSMS = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`sms:?body=${encoded}`, '_blank');
  };

  return (
    <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10">
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="w-full py-3 rounded-2xl bg-gradient-to-l from-purple-600 to-pink-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
        >
          <Users className="w-4 h-4" />
          شارك مع ولي الأمر
        </motion.button>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              مشاركة التفاصيل
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              إغلاق
            </button>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{shareText}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={copyToClipboard}
              className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                copied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'تم النسخ' : 'نسخ'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={shareViaWhatsApp}
              className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              واتساب
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={shareViaSMS}
              className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
            >
              <Send className="w-4 h-4" />
              رسالة نصية
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
