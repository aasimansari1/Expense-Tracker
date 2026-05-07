import { motion } from 'framer-motion';
import { Pencil, Trash2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { CATEGORY_COLORS, currency, formatDate } from '../utils/format.js';

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income';
  const color = CATEGORY_COLORS[transaction.category] || '#64748b';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 dark:hover:bg-white/5 transition-all"
    >
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden
      >
        {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{transaction.title}</p>
          <span
            className="chip text-[10px]"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {transaction.category}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {formatDate(transaction.date)}
          {transaction.note ? ` — ${transaction.note}` : ''}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className={`font-semibold ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isIncome ? '+' : '-'}
          {currency(transaction.amount)}
        </p>
        <div className="flex items-center justify-end gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit?.(transaction)}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10"
            aria-label="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete?.(transaction)}
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
            aria-label="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
