import { motion } from "framer-motion";

export default function Card({ children, className = "", hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2 } : {}}
      className={`rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl shadow-black/20 backdrop-blur sm:p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
