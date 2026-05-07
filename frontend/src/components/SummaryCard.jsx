import { motion } from 'framer-motion';
import { currency } from '../utils/format.js';

export default function SummaryCard({ icon: Icon, label, value, accent = 'brand', sub }) {
  const accents = {
    brand: 'from-indigo-500 to-fuchsia-500',
    green: 'from-emerald-500 to-teal-500',
    rose: 'from-rose-500 to-orange-500',
    blue: 'from-sky-500 to-cyan-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            {label}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">{currency(value)}</p>
          {sub && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>
          )}
        </div>
        <div
          className={`h-11 w-11 rounded-xl bg-gradient-to-br ${accents[accent]} flex items-center justify-center text-white shadow-lg`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
