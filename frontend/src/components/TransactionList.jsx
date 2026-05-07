import { AnimatePresence } from 'framer-motion';
import TransactionItem from './TransactionItem.jsx';
import EmptyState from './EmptyState.jsx';
import { Receipt } from 'lucide-react';

export default function TransactionList({ items, onEdit, onDelete, emptyMessage }) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions"
        message={emptyMessage || 'Try adjusting your filters or add a new transaction.'}
      />
    );
  }

  return (
    <div className="space-y-1">
      <AnimatePresence>
        {items.map((t) => (
          <TransactionItem key={t._id} transaction={t} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
}
