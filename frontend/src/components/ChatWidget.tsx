import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '../store';
import api from '../api';
import type { ChatMessage } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !open) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [user, open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/api/chat/messages');
      setMessages(res.data);
    } catch {}
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      await api.post('/api/chat/send', { message: input.trim() });
      setInput('');
      await fetchMessages();
    } catch {} finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 flex items-center justify-center"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 left-4 right-4 md:left-auto md:right-6 z-50 w-[calc(100vw-2rem)] md:w-80 h-[70vh] md:h-96 rounded-2xl bg-[#0f0a24] border border-purple-500/10 shadow-2xl shadow-purple-500/10 flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-purple-500/10 bg-purple-500/5">
              <h3 className="text-sm font-bold text-white/90">الدردشة مع الدعم</h3>
              <p className="text-xs text-purple-300/40">نرد عادة خلال دقائق</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-purple-300/30 text-sm mt-8">
                  ابدأ المحادثة الآن
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                      msg.is_admin
                        ? 'bg-purple-500/10 text-purple-200 rounded-br-sm'
                        : 'bg-gradient-to-l from-purple-500 to-pink-500 text-white rounded-bl-sm'
                    }`}
                  >
                    {msg.is_admin && (
                      <span className="text-[10px] text-purple-400 font-bold block mb-0.5">
                         مسؤول
                      </span>
                    )}
                    <p className="break-words">{msg.message}</p>
                    <span className="text-[10px] opacity-50 block text-left mt-1">
                      {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-purple-500/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 px-3 py-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 placeholder-purple-300/30 text-sm focus:outline-none focus:border-purple-500/30"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center disabled:opacity-40"
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
