export default function Input({ label, className = "", ...props }) {
  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-slate-300">{label}</span> : null}
      <input
        className={`w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-base text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 sm:py-2 sm:text-sm ${className}`}
        {...props}
      />
    </label>
  );
}
