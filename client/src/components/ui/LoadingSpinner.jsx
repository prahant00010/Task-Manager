export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-brand-500" />
    </div>
  );
}
