# Frontend Guidelines - Anti-Gravity Money Manager

> **Tech Stack**: React 19 + Vite 7 + Tailwind CSS 4 + Zustand 5 + shadcn/ui
> **Related Docs**: [BACKEND.md](./BACKEND.md) | [DATABASE.md](./DATABASE.md) | [Root AGENTS.md](../AGENTS.md)

---

## Build Commands

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

---

## Directory Structure

```
frontend/src/
├── components/
│   ├── ui/                    # shadcn/ui primitives (button, input, card, etc.)
│   ├── layout/                # AppLayout, ProtectedRoute, Sidebar, Header
│   ├── dashboard/             # IncomeExpenseChart, RecentActivity, SummaryCard
│   ├── transactions/          # AddTransactionModal, TransactionFilters, columns
│   ├── categories/            # AddCategoryModal, CategoryList
│   ├── accounts/              # AddAccountModal, AccountCard
│   ├── budgets/               # BudgetCard, SetBudgetModal
│   ├── goals/                 # GoalCard, AddGoalModal
│   └── common/                # [CREATE] ErrorBoundary, LoadingSpinner
├── pages/                     # Page components (one per route)
├── stores/                    # Zustand stores (useAuthStore, useTransactionStore, etc.)
├── hooks/                     # [CREATE] Custom hooks (useDebounce, useChartColors)
├── constants/                 # [CREATE] App constants (divisions, periods, types)
├── lib/
│   ├── api.js                 # Axios instance + API functions
│   └── utils.js               # cn(), formatCurrency(), formatDate(), etc.
├── App.jsx                    # Routes and providers
├── main.jsx                   # Entry point
└── index.css                  # Tailwind imports + CSS variables
```

---

## Feature Status

| Feature | Page | Store | Status |
|---------|------|-------|--------|
| Authentication | LoginPage, RegisterPage | authStore | Complete |
| Dashboard | DashboardPage | transactionStore | Complete |
| Transactions | TransactionsPage | transactionStore | Complete (edit/delete UI pending) |
| Categories | CategoriesPage | categoryStore | Complete |
| Accounts | AccountsPage | accountStore | Complete |
| Budgets | BudgetsPage | budgetStore | **Placeholder** - needs store |
| Goals | GoalsPage | goalStore | **Placeholder** - needs store |

---

## Import Order Convention

```javascript
// 1. React and hooks
import { useState, useEffect, useCallback } from 'react';

// 2. Third-party libraries
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// 3. Icons (lucide-react)
import { Loader2, Plus, X, ChevronLeft } from 'lucide-react';

// 4. UI components (from components/ui/)
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// 5. Feature components
import { TransactionFilters } from '../transactions/TransactionFilters';

// 6. Stores
import { useUIStore } from '../../stores/uiStore';
import { useTransactionStore } from '../../stores/transactionStore';

// 7. Utilities and API
import { cn, formatCurrency } from '../../lib/utils';
import { transactionsAPI } from '../../lib/api';

// 8. Constants
import { DIVISIONS, PERIODS } from '../../constants';
```

---

## Component Patterns

### Page Components (Named Exports)
```jsx
// pages/TransactionsPage.jsx
import { useEffect } from 'react';
import { useTransactionStore } from '../stores/transactionStore';

export function TransactionsPage() {  // Named export for ALL pages
    const { transactions, fetchTransactions } = useTransactionStore();
    
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);
    
    return <div>...</div>;
}

export default TransactionsPage;  // Also add default for lazy loading compatibility
```

### Feature Components (Named Exports)
```jsx
// components/transactions/AddTransactionModal.jsx
export function AddTransactionModal() {
    // 1. Store hooks first
    const { activeModal, closeModal } = useUIStore();
    const { createTransaction } = useTransactionStore();
    
    // 2. Local state
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // 3. Form setup
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });
    
    // 4. Effects
    useEffect(() => { /* ... */ }, []);
    
    // 5. Handlers
    const onSubmit = async (data) => { /* ... */ };
    
    // 6. Early returns
    if (activeModal !== 'addTransaction') return null;
    
    // 7. Render
    return <div>...</div>;
}
```

### Global Modal Pattern (Recommended)
```jsx
// All modals should use uiStore.activeModal pattern
// stores/uiStore.js
{
    activeModal: null,  // 'addTransaction' | 'addAccount' | 'addCategory' | null
    openModal: (name) => set({ activeModal: name }),
    closeModal: () => set({ activeModal: null }),
}

// In component:
const { activeModal, closeModal } = useUIStore();
if (activeModal !== 'myModal') return null;
```

---

## Zustand Store Pattern

```javascript
// stores/transactionStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';  // Only for auth/ui stores
import { transactionsAPI } from '../lib/api';

export const useTransactionStore = create((set, get) => ({
    // State
    transactions: [],
    isLoading: false,
    error: null,
    
    // Pagination
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    
    // Filters
    filters: { search: '', type: 'all', categoryId: 'all' },

    // Actions
    fetchTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await transactionsAPI.getAll(get().filters);
            set({ 
                transactions: response.data.data.transactions,
                pagination: response.data.data.pagination,
                isLoading: false 
            });
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to fetch';
            set({ isLoading: false, error: message });
            toast.error(message);  // Show toast for API errors
        }
    },

    createTransaction: async (data) => {
        try {
            const response = await transactionsAPI.create(data);
            set({ transactions: [response.data.data.transaction, ...get().transactions] });
            toast.success('Transaction created');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to create';
            toast.error(message);
            return { success: false, error: message };
        }
    },
}));
```

**Store Naming**: Always use `useXxxStore` (Zustand convention).

---

## Form Handling

### Current Pattern (react-hook-form + Controller)
```jsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
    amount: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be positive'),
    categoryId: z.string().min(1, 'Required'),
});

function MyForm() {
    const { register, control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { amount: '', categoryId: '' },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Text inputs use register */}
            <Input {...register('amount')} />
            {errors.amount && <p className="text-xs text-red-400">{errors.amount.message}</p>}
            
            {/* Select/complex inputs use Controller */}
            <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>...</SelectContent>
                    </Select>
                )}
            />
            {errors.categoryId && <p className="text-xs text-red-400">{errors.categoryId.message}</p>}
        </form>
    );
}
```

### Recommended: FormField Wrapper (Create This)
```jsx
// components/ui/form-field.jsx
export function FormField({ label, error, children }) {
    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium">{label}</label>}
            {children}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}
```

---

## Error Handling

| Error Type | How to Handle |
|------------|---------------|
| API errors (network, server) | `toast.error(message)` via Sonner |
| Form validation | Inline below field: `<p className="text-xs text-red-400">` |
| Page-level errors | ErrorBoundary (create in `components/common/`) |
| Auth errors | Redirect to login via authStore |

```javascript
// Extract error message consistently
const message = error.response?.data?.error?.message || 'Something went wrong';
toast.error(message);
```

---

## CSS & Styling

### Approach
- **Tailwind-first**: Use utility classes for all styling
- **CSS modules**: Allowed for complex component-specific styles
- **CSS variables**: Defined in `index.css` for theming

### Class Merging with cn()
```jsx
import { cn } from '../../lib/utils';

<div className={cn(
    "base-classes px-4 py-2",
    isActive && "bg-accent text-white",
    isDisabled && "opacity-50 cursor-not-allowed"
)} />
```

### Color Variables
```css
/* Use these semantic colors */
bg-background          /* Main background */
bg-background-secondary /* Card backgrounds */
text-foreground        /* Primary text */
text-muted-foreground  /* Secondary text */
bg-accent              /* Primary action color */
text-success           /* Positive values (green) */
text-danger            /* Negative values (red) */
```

### Glass Effect
```jsx
<div className="glass-card">...</div>
/* Or manually: */
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
```

---

## Recommendations (Create These)

### 1. Constants File
```javascript
// src/constants/index.js
export const DIVISIONS = {
    PERSONAL: 'personal',
    OFFICE: 'office',
};

export const PERIODS = {
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
};

export const ACCOUNT_TYPES = {
    BANK: 'bank',
    CASH: 'cash',
    WALLET: 'wallet',
};

export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
    TRANSFER: 'transfer',
};
```

### 2. Custom Hooks
```javascript
// src/hooks/useDebounce.js
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

// src/hooks/useMediaQuery.js
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches);
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
}
```

### 3. ErrorBoundary
```jsx
// src/components/common/ErrorBoundary.jsx
import { Component } from 'react';
import { Button } from '../ui/button';

export class ErrorBoundary extends Component {
    state = { hasError: false, error: null };
    
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                    <Button onClick={() => window.location.reload()}>Reload Page</Button>
                </div>
            );
        }
        return this.props.children;
    }
}
```

### 4. LoadingSpinner
```jsx
// src/components/common/LoadingSpinner.jsx
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LoadingSpinner({ className, size = 'default' }) {
    const sizes = { sm: 'w-4 h-4', default: 'w-8 h-8', lg: 'w-12 h-12' };
    return <Loader2 className={cn('animate-spin text-accent', sizes[size], className)} />;
}
```

### 5. Missing Stores
```javascript
// src/stores/budgetStore.js - CREATE THIS
export const useBudgetStore = create((set, get) => ({
    budgets: [],
    isLoading: false,
    error: null,
    fetchBudgets: async () => { /* ... */ },
    createBudget: async (data) => { /* ... */ },
    updateBudget: async (id, data) => { /* ... */ },
    deleteBudget: async (id) => { /* ... */ },
}));

// src/stores/goalStore.js - CREATE THIS
export const useGoalStore = create((set, get) => ({
    goals: [],
    isLoading: false,
    error: null,
    fetchGoals: async () => { /* ... */ },
    createGoal: async (data) => { /* ... */ },
    contributeToGoal: async (id, amount) => { /* ... */ },
    deleteGoal: async (id) => { /* ... */ },
}));
```

### 6. Wire Transaction Actions (columns.jsx)
```jsx
// Current (broken):
onClick: () => console.log('Edit', row.original)

// Should be:
onClick: () => {
    useUIStore.getState().setEditingTransaction(row.original);
    useUIStore.getState().openModal('editTransaction');
}
```

---

## Cross-References

- **API Functions**: See [BACKEND.md](./BACKEND.md) for endpoint details
- **Zod Schemas**: Frontend schemas should mirror backend schemas in `backend/utils/schemas.js`
- **Database Models**: See [DATABASE.md](./DATABASE.md) for data structure
