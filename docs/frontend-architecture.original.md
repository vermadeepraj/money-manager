# Frontend Architecture
## Money Manager Web Application

---

## 1. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | React | 18.x | UI library |
| Build Tool | Vite | 5.x | Fast dev server, HMR |
| Styling | Tailwind CSS | 3.4.x | Utility-first CSS |
| Components | shadcn/ui | latest | Accessible UI components |
| State | Zustand | 4.x | Global state management |
| Forms | React Hook Form | 7.x | Form handling |
| Validation | Zod | 3.x | Schema validation |
| Tables | TanStack Table | 8.x | Data tables |
| Charts | Recharts | 2.x | Data visualization |
| Icons | Lucide React | latest | Icon library |
| HTTP | Axios | 1.x | API requests |
| Router | React Router | 6.x | Client-side routing |
| Toasts | Sonner | 1.x | Notifications |
| Dates | date-fns | 3.x | Date formatting |

---

## 2. Folder Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── input.jsx
│   │   │   ├── select.jsx
│   │   │   ├── tabs.jsx
│   │   │   ├── calendar.jsx
│   │   │   ├── popover.jsx
│   │   │   ├── skeleton.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── progress.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── table.jsx
│   │   │   ├── tooltip.jsx
│   │   │   └── avatar.jsx
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx      # Main app wrapper
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   ├── Header.jsx         # Top header bar
│   │   │   └── ProtectedRoute.jsx # Auth guard
│   │   ├── dashboard/
│   │   │   ├── SummaryCard.jsx    # Stats card with sparkline
│   │   │   ├── PeriodSelector.jsx # Month/Week/Year toggle
│   │   │   └── InsightCard.jsx    # Auto-generated insights
│   │   ├── charts/
│   │   │   ├── IncomeExpenseBar.jsx
│   │   │   ├── CategoryDonut.jsx
│   │   │   ├── TrendLine.jsx
│   │   │   └── Sparkline.jsx
│   │   ├── transactions/
│   │   │   ├── AddTransactionModal.jsx
│   │   │   ├── EditTransactionModal.jsx
│   │   │   ├── TransactionTable.jsx
│   │   │   ├── TransactionRow.jsx
│   │   │   └── FilterPanel.jsx
│   │   ├── categories/
│   │   │   ├── CategoryList.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   └── AddCategoryModal.jsx
│   │   ├── budgets/
│   │   │   ├── BudgetCard.jsx
│   │   │   ├── BudgetProgress.jsx
│   │   │   └── SetBudgetModal.jsx
│   │   ├── accounts/
│   │   │   ├── AccountCard.jsx
│   │   │   ├── AccountList.jsx
│   │   │   └── TransferModal.jsx
│   │   └── common/
│   │       ├── EmptyState.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── LoadingSpinner.jsx
│   │       └── ThemeToggle.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TransactionsPage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── BudgetsPage.jsx
│   │   └── AccountsPage.jsx
│   ├── stores/
│   │   ├── authStore.js           # User & auth state
│   │   ├── transactionStore.js    # Transaction state
│   │   ├── categoryStore.js       # Category state
│   │   ├── budgetStore.js         # Budget state
│   │   ├── accountStore.js        # Account state
│   │   └── uiStore.js             # UI state (theme, modals)
│   ├── hooks/
│   │   ├── useAuth.js             # Auth utilities
│   │   ├── useTransactions.js     # Transaction CRUD
│   │   ├── useCategories.js       # Category CRUD
│   │   ├── useBudgets.js          # Budget CRUD
│   │   └── useDebounce.js         # Debounce utility
│   ├── lib/
│   │   ├── utils.js               # cn(), formatCurrency(), etc.
│   │   ├── api.js                 # Axios instance
│   │   ├── constants.js           # Preset categories, etc.
│   │   └── schemas.js             # Zod validation schemas
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── components.json                # shadcn configuration
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── package.json
└── .env
```

---

## 3. State Management (Zustand)

### Store Design Principles
- **Minimal stores:** Only what needs to be global
- **Flat structure:** Avoid deep nesting
- **Actions inside store:** Keep mutations colocated
- **Selectors for derived data:** Compute in selectors, not components

### authStore.js
```javascript
// State
{
  user: null | { id, email, name },
  token: null | string,
  isLoading: boolean,
  error: null | string
}

// Actions
- login(email, password)
- register(email, password, name)
- logout()
- checkAuth()
- clearError()
```

### transactionStore.js
```javascript
// State
{
  transactions: [],
  totalCount: 0,
  currentPage: 1,
  pageSize: 20,
  filters: {
    search: '',
    division: 'all',
    category: 'all',
    startDate: null,
    endDate: null
  },
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  },
  isLoading: boolean
}

// Actions
- fetchTransactions()
- addTransaction(data)
- updateTransaction(id, data)
- deleteTransaction(id)
- setFilters(filters)
- setPage(page)
- fetchSummary(period)
```

### uiStore.js
```javascript
// State
{
  theme: 'dark' | 'light',
  sidebarOpen: boolean,
  activeModal: null | string,
  activePeriod: 'month' | 'week' | 'year'
}

// Actions
- toggleTheme()
- toggleSidebar()
- openModal(name)
- closeModal()
- setPeriod(period)
```

---

## 4. Routing Structure

```javascript
// App.jsx routing configuration

Routes:
├── /login           → LoginPage (public)
├── /register        → RegisterPage (public)
└── / (protected)    → AppLayout wrapper
    ├── /dashboard   → DashboardPage
    ├── /transactions → TransactionsPage
    ├── /categories  → CategoriesPage
    ├── /budgets     → BudgetsPage
    └── /accounts    → AccountsPage

Default redirect:
- Unauthenticated → /login
- Authenticated (on /login) → /dashboard
- Root (/) → /dashboard
```

---

## 5. API Layer (Axios)

### Instance Configuration
```javascript
// lib/api.js

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Add JWT token
// Response interceptor: Handle 401 (logout)
```

### API Functions
```javascript
// Auth
api.post('/auth/register', { email, password, name })
api.post('/auth/login', { email, password })
api.get('/auth/me')

// Transactions
api.get('/transactions', { params: { page, limit, ...filters } })
api.post('/transactions', transactionData)
api.put('/transactions/:id', transactionData)
api.delete('/transactions/:id')
api.get('/transactions/summary', { params: { period } })

// Categories
api.get('/categories')
api.post('/categories', categoryData)
api.put('/categories/:id', categoryData)
api.delete('/categories/:id')

// Budgets
api.get('/budgets')
api.post('/budgets', budgetData)
api.put('/budgets/:id', budgetData)
api.delete('/budgets/:id')

// Accounts
api.get('/accounts')
api.post('/accounts', accountData)
api.post('/accounts/transfer', transferData)
```

---

## 6. Form Handling (React Hook Form + Zod)

### Pattern
```javascript
// 1. Define Zod schema
const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  date: z.date(),
  division: z.enum(['personal', 'office'])
});

// 2. Use in component
const form = useForm({
  resolver: zodResolver(transactionSchema),
  defaultValues: { ... }
});

// 3. Handle submit
const onSubmit = (data) => {
  // data is validated
};
```

---

## 7. Data Tables (TanStack Table)

### Features Used
- Column definitions
- Sorting (client-side for small datasets)
- Manual pagination (server-side)
- Column visibility
- Row selection (for bulk actions if needed)

### Column Definition Pattern
```javascript
const columns = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => formatDate(row.date)
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => <CategoryBadge category={row.category} />
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <AmountCell amount={row.amount} type={row.type} />
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions transaction={row.original} />
  }
];
```

---

## 8. Chart Components (Recharts)

### Chart Data Flow
```
API → Store → Selector → ChartComponent → Recharts
```

### Standard Chart Props
```javascript
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
    <XAxis dataKey="name" stroke="#94A3B8" />
    <YAxis stroke="#94A3B8" />
    <Tooltip content={<CustomTooltip />} />
    <Bar dataKey="income" fill="#10B981" animationDuration={800} />
    <Bar dataKey="expense" fill="#EF4444" animationDuration={800} />
  </BarChart>
</ResponsiveContainer>
```

---

## 9. Theme System

### Implementation
```javascript
// uiStore.js
toggleTheme: () => {
  set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  });
}

// Initialize on app load
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.toggle('dark', savedTheme === 'dark');
```

### Tailwind Configuration
```javascript
// tailwind.config.js
darkMode: 'class',
theme: {
  extend: {
    colors: {
      background: 'var(--bg-primary)',
      foreground: 'var(--text-primary)',
      // ... more CSS variable mappings
    }
  }
}
```

---

## 10. Error Handling Strategy

### Levels
1. **Component Level:** Try-catch in async functions
2. **Error Boundary:** Catch React rendering errors
3. **API Level:** Axios interceptor for global handling
4. **Form Level:** Zod validation errors displayed inline

### Error Boundary Pattern
```javascript
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

### API Error Handling
```javascript
// Axios response interceptor
if (error.response?.status === 401) {
  // Token expired → logout
  authStore.getState().logout();
}

// Show toast for other errors
toast.error(error.response?.data?.error?.message || 'Something went wrong');
```

---

## 11. Loading States

### Patterns
```javascript
// Skeleton for lists
{isLoading ? (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
) : (
  <TransactionList data={transactions} />
)}

// Button loading
<Button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    'Save Transaction'
  )}
</Button>
```

---

## 12. Environment Variables

```env
# .env
VITE_API_URL=http://localhost:5000/api/v1

# Production
VITE_API_URL=https://your-backend.railway.app/api/v1
```

---

## 13. Build & Development

### Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx"
  }
}
```

### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

---

## 14. Performance Considerations

### Optimizations
- **Code splitting:** React.lazy for page components
- **Memoization:** React.memo for expensive components
- **Debouncing:** Search input debounced (300ms)
- **Virtual scrolling:** Consider for very long lists
- **Image optimization:** Not applicable (no images)

### Bundle Size Goals
- Initial load: < 200KB gzipped
- Code split pages: < 50KB each

---

## 15. Component Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Page | `*Page.jsx` | `DashboardPage.jsx` |
| Layout | `*Layout.jsx` | `AppLayout.jsx` |
| Modal | `*Modal.jsx` | `AddTransactionModal.jsx` |
| Form | `*Form.jsx` | `LoginForm.jsx` |
| List | `*List.jsx` | `TransactionList.jsx` |
| Card | `*Card.jsx` | `SummaryCard.jsx` |
| Table | `*Table.jsx` | `TransactionTable.jsx` |
| Store | `*Store.js` | `authStore.js` |
| Hook | `use*.js` | `useAuth.js` |
