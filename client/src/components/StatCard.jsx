import { motion } from "framer-motion";
import Card from "./ui/Card";

export default function StatCard({ label, value, icon: Icon, accent = "text-brand-400" }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <motion.p
            key={value}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-3xl font-bold text-white"
          >
            {value}
          </motion.p>
        </div>
        {Icon ? (
          <div className={`rounded-lg bg-slate-800 p-2 ${accent}`}>
            <Icon size={22} />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
