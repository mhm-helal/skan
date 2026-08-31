import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkanLogo from './SkanLogo';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 400);
          setTimeout(() => onComplete(), 1000);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0514]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-500/10 animate-blob"
              style={{
                width: Math.random() * 80 + 20,
                height: Math.random() * 80 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <div className="animate-float">
              <SkanLogo size={80} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Skan
            </h1>
            <div className="w-48 h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-l from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-purple-300/60 text-sm font-medium">{Math.min(progress, 100)}%</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
