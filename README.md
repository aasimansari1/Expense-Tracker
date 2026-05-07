# Expense Tracker

A modern, full-stack expense tracker with a beautiful glassmorphism UI, real-time analytics, and monthly budget management.

**Stack:** React + Vite + Tailwind CSS + Recharts · Node.js + Express · MongoDB · Framer Motion · jsPDF

## Features

- **Dashboard** — total balance, income, expenses, recent transactions, and a 6-month summary chart
- **Transaction management** — add / edit / delete with categories (Food, Shopping, Travel, Bills, Salary, Entertainment, Other), date picker, and notes
- **Analytics** — pie chart of expense categories, bar chart of monthly expenses, and an income-vs-expense line chart with real-time updates
- **Budget management** — set a monthly limit, see remaining balance, progress bar, and warning when 80% / exceeded
- **Search & filters** — by category, type, date range, and free-text search; sort latest / oldest
- **UI/UX** — glassmorphism cards, gradient backgrounds, dark/light mode, sidebar navigation, smooth Framer Motion animations, fully responsive
- **Extras** — export transactions / monthly report to PDF, toast notifications, loading skeletons, empty-state UI

## Folder structure

```
expense-tracker/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── transactionController.js
│   │   └── budgetController.js
│   ├── middleware/errorHandler.js
│   ├── models/
│   │   ├── Transaction.js
│   │   └── Budget.js
│   ├── routes/
│   │   ├── transactionRoutes.js
│   │   └── budgetRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── seedData.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   (Layout, Sidebar, Header, SummaryCard, TransactionForm, TransactionList, TransactionItem, BudgetProgress, Loader, EmptyState)
│   │   ├── context/      (ThemeContext, TransactionContext)
│   │   ├── pages/        (Dashboard, Transactions, Analytics, Budget)
│   │   ├── utils/        (api, format, exportPdf)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/favicon.svg
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Backend

```bash
cd backend
cp .env.example .env       # then edit MONGO_URI
npm install
npm run seed               # optional: load 18 demo transactions + a $2000 budget
npm run dev                # starts http://localhost:5000
```

`.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # optional — Vite proxies /api to localhost:5000 in dev
npm install
npm run dev                # starts http://localhost:5173
```

Open `http://localhost:5173`. The Vite dev server proxies `/api/*` to the backend on port 5000, so no CORS setup is needed for local development.

## API reference

| Method | Endpoint                       | Description                                        |
| ------ | ------------------------------ | -------------------------------------------------- |
| GET    | `/api/transactions`            | List transactions. Query: `category`, `type`, `search`, `from`, `to`, `sort` |
| POST   | `/api/transactions`            | Create a transaction                               |
| GET    | `/api/transactions/stats`      | Totals + category breakdown + monthly aggregates   |
| GET    | `/api/transactions/:id`        | Get one transaction                                |
| PUT    | `/api/transactions/:id`        | Update transaction                                 |
| DELETE | `/api/transactions/:id`        | Delete transaction                                 |
| GET    | `/api/budget?month=YYYY-MM`    | Get budget + spent / remaining (default: this month) |
| POST   | `/api/budget`                  | Set/update budget `{ month?, amount }`             |

### Transaction schema

```js
{
  title: String,            // required
  amount: Number,           // required, ≥ 0
  type: 'income' | 'expense',
  category: 'Food' | 'Shopping' | 'Travel' | 'Bills' | 'Salary' | 'Entertainment' | 'Other',
  note: String,
  date: Date,
  createdAt: Date,          // auto
  updatedAt: Date           // auto
}
```

## Deployment

### Backend → Render

1. Push the repo to GitHub.
2. Create a new **Web Service** on Render pointing to the `backend/` directory.
3. Build command: `npm install`. Start command: `npm start`.
4. Add env vars: `MONGO_URI`, `CLIENT_URL` (your Vercel URL), `NODE_ENV=production`.

### Frontend → Vercel

1. Import the repo into Vercel.
2. Set the **Root Directory** to `frontend/`.
3. Build command: `npm run build`. Output directory: `dist`.
4. Add env var: `VITE_API_URL=https://your-render-service.onrender.com/api`.

## Scripts

**Backend**

- `npm run dev` — start with nodemon
- `npm start` — production start
- `npm run seed` — load demo data

**Frontend**

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build

## License

MIT — built for learning and portfolio use.
