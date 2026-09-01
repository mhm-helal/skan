import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '../store';
import api from '../api';
import type { ChatMessage, ChatConversation } from '../types';

export default function AdminChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    fetchConversations();
    const interval = setInterval(fetchConversations, 15000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  useEffect(() => {
    if (!selectedUser) return;
    fetchMessages(selectedUser);
    const interval = setInterval(() => fetchMessages(selectedUser), 10000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/api/chat/admin/all');
      setConversations(res.data);
    } catch {}
  };

  const fetchMessages = async (userId: number) => {
    try {
      const res = await api.get(`/api/chat/admin/messages/${userId}`);
      setMessages(res.data);
    } catch {}
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !selectedUser) return;
    setLoading(true);
    try {
      await api.post(`/api/chat/admin/send/${selectedUser}`, { message: input.trim() });
      setInput('');
      await fetchMessages(selectedUser);
      await fetchConversations();
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (userId: number) => {
    setSelectedUser(userId);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  const selectedConv = conversations.find((c) => c.user_id === selectedUser);

  return (
    <div className="min-h-screen pt-20 pb-24 flex">
      <div className="flex-1 flex">
        {/* Conversation list */}
        <div className={`w-full md:w-80 border-l border-purple-500/10 bg-purple-500/5 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-purple-500/10 flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="min-w-[44px] min-h-[44px] p-2 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors flex items-center justify-center"
            >
              <ArrowRight size={18} />
            </button>
            <h2 className="text-lg font-bold text-white/90">الدردشات</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && (
              <div className="text-center py-12 text-purple-300/40 text-sm">
                لا توجد دردشات بعد
              </div>
            )}
            {conversations.map((conv) => (
              <button
                key={conv.user_id}
                onClick={() => handleSelectConversation(conv.user_id)}
                className={`w-full text-right p-4 border-b border-purple-500/5 transition-colors min-h-[44px] ${
                  selectedUser === conv.user_id
                    ? 'bg-purple-500/10'
                    : 'hover:bg-purple-500/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {conv.user_name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white/90 text-sm">{conv.user_name}</span>
                      {conv.unread_count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-bold">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-purple-300/40 truncate">{conv.last_message}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className={`flex-1 flex-col ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
          {selectedUser ? (
            <>
              <div className="px-4 md:px-6 py-3 border-b border-purple-500/10 bg-purple-500/5 flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="md:hidden min-w-[44px] min-h-[44px] p-2 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors flex items-center justify-center"
                >
                  <ArrowLeft size={18} />
                </button>
                <h3 className="font-bold text-white/90">{selectedConv?.user_name || 'محادثة'}</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.is_admin
                          ? 'bg-purple-500/10 text-purple-200 rounded-br-sm'
                          : 'bg-gradient-to-l from-purple-500 to-pink-500 text-white rounded-bl-sm'
                      }`}
                    >
                      {!msg.is_admin && (
                        <span className="text-[10px] opacity-70 block mb-0.5">{msg.sender_name}</span>
                      )}
                      <p className="break-words">{msg.message}</p>
                      <span className="text-[10px] opacity-50 block mt-1">
                        {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="p-4 border-t border-purple-500/10">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اكتب الرد..."
                    className="flex-1 px-4 py-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-white/90 placeholder-purple-300/30 text-sm focus:outline-none focus:border-purple-500/30 min-h-[44px]"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="px-4 py-3 rounded-xl bg-gradient-to-l from-purple-500 to-pink-500 text-white font-bold text-sm disabled:opacity-40 flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center"
                  >
                    <Send size={14} />
                    <span className="hidden sm:inline">إرسال</span>
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-4 text-purple-500/20" />
                <p className="text-purple-300/40">اختر محادثة لبدء الرد</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
