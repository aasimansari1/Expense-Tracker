import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { TransactionsAPI, BudgetAPI } from '../utils/api.js';
import { monthKey } from '../utils/format.js';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState({ amount: 0, spent: 0, remaining: 0, percent: 0, status: 'unset', month: monthKey() });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [txns, b] = await Promise.all([
        TransactionsAPI.list({ sort: 'desc' }),
        BudgetAPI.get().catch(() => null),
      ]);
      setTransactions(txns);
      if (b) setBudget(b);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTransaction = useCallback(
    async (payload) => {
      try {
        const created = await TransactionsAPI.create(payload);
        setTransactions((prev) => [created, ...prev]);
        toast.success('Transaction added');
        const b = await BudgetAPI.get().catch(() => null);
        if (b) setBudget(b);
        return created;
      } catch (err) {
        toast.error(err.message);
        throw err;
      }
    },
    []
  );

  const updateTransaction = useCallback(async (id, payload) => {
    try {
      const updated = await TransactionsAPI.update(id, payload);
      setTransactions((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast.success('Transaction updated');
      const b = await BudgetAPI.get().catch(() => null);
      if (b) setBudget(b);
      return updated;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      await TransactionsAPI.remove(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      toast.success('Transaction deleted');
      const b = await BudgetAPI.get().catch(() => null);
      if (b) setBudget(b);
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  const saveBudget = useCallback(async (amount) => {
    try {
      await BudgetAPI.set({ amount: Number(amount) });
      const b = await BudgetAPI.get();
      setBudget(b);
      toast.success('Budget updated');
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((a, t) => a + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((a, t) => a + t.amount, 0);
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions]);

  const value = {
    transactions,
    stats,
    budget,
    loading,
    error,
    refresh,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    saveBudget,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
};
