// app/loading.tsx
"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f9fafb] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <Loader2 className="w-12 h-12 text-[#094E85] animate-spin mb-4" />

        <h2 className="text-xl font-semibold text-gray-700">
          Loading your experience...
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Please wait while we prepare your data.
        </p>
      </motion.div>
    </div>
  );
}
