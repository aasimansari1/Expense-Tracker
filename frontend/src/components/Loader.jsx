export default function Loader({ rows = 3, label }) {
  return (
    <div className="space-y-3" aria-live="polite" aria-busy="true">
      {label && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl shimmer" />
      ))}
    </div>
  );
}

export const Spinner = ({ className = '' }) => (
  <div
    className={`inline-block h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin ${className}`}
    role="status"
    aria-label="Loading"
  />
);
