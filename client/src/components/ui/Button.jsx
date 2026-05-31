import { motion } from "framer-motion";

const variants = {
  primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25",
  secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
  danger: "bg-rose-600 hover:bg-rose-700 text-white",
  ghost: "bg-transparent hover:bg-slate-800 text-slate-300"
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:py-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
