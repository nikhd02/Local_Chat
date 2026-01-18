'use client';

import { motion } from 'framer-motion';
import { Loader2, Users } from 'lucide-react';

export default function MatchingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="absolute inset-0 blur-2xl bg-green-500/30 rounded-full" />
          <Loader2 className="w-24 h-24 text-green-400 relative z-10" />
        </motion.div>

        <div className="text-center space-y-4">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Finding stranger
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.span>
          </motion.h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 text-green-400"
          >
            <Users className="w-6 h-6" />
            <span className="text-lg">Connecting you to someone random</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-2 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                backgroundColor: ['#10b981', '#34d399', '#10b981'],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-green-500"
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-400 text-sm mt-8 max-w-md text-center"
        >
          Stay connected. You will be matched with someone in just a few seconds.
        </motion.p>
      </motion.div>
    </div>
  );
}
