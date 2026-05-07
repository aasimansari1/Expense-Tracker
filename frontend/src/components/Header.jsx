import { Menu, Moon, Sun, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useTransactions } from '../context/TransactionContext.jsx';

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { refresh, loading } = useTransactions();

  return (
    <header className="sticky top-0 z-20 px-4 sm:px-6 lg:px-8 pt-4">
      <div className="glass rounded-2xl flex items-center justify-between px-4 sm:px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-white/70 dark:hover:bg-white/10"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Welcome back
            </p>
            <h1 className="text-base sm:text-lg font-bold">Track every dollar</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all"
            title="Refresh"
            aria-label="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
