export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-400 sm:text-base">{subtitle}</p> : null}
      </div>
      {children ? (
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          {children}
        </div>
      ) : null}
    </div>
  );
}
