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
| Emojis | Twemoji | 14.x | Cross-platform emoji rendering |
| Animations | Framer Motion | 11.x | Count-up & page transitions |
| HTTP | Axios | 1.x | API requests |
| Router | React Router | 6.x | Client-side routing |
| Toasts | Sonner | 1.x | Notifications |
| Dates | date-fns | 3.x | Date formatting |

---

## 2. Folder Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── patterns/              # Background pattern assets
│       └── grid-pattern.svg
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
│   │   │   ├── skeleton.jsx       # Extended with shimmer
│   │   │   ├── badge.jsx
│   │   │   ├── progress.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── table.jsx
│   │   │   ├── tooltip.jsx
│   │   │   ├── avatar.jsx
│   │   │   ├── sheet.jsx          # Mobile drawer
│   │   │   ├── collapsible.jsx    # Sidebar sections
│   │   │   ├── toggle.jsx
│   │   │   └── toggle-group.jsx   # Division selector
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx      # Main app wrapper
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   ├── Header.jsx         # Top header bar
│   │   │   └── ProtectedRoute.jsx # Auth guard
│   │   ├── dashboard/
│   │   │   ├── SummaryCard.jsx    # Stats card with sparkline
│   │   │   ├── PeriodSelector.jsx # Month/Week/Year toggle
│   │   │   ├── InsightCard.jsx    # Backend-generated insights
│   │   │   ├── QuickAddWidget.jsx # Quick transaction entry
│   │   │   ├── RecentTransactions.jsx  # Last 5-7 transactions
│   │   │   ├── GoalSummaryWidget.jsx   # Primary goal progress
│   │   │   └── OnboardingCard.jsx      # First-time user welcome
│   │   ├── charts/
│   │   │   ├── IncomeExpenseBar.jsx
│   │   │   ├── CategoryDonut.jsx
│   │   │   ├── TrendLine.jsx
│   │   │   └── Sparkline.jsx
│   │   ├── transactions/
│   │   │   ├── AddTransactionModal.jsx
│   │   │   ├── EditTransactionModal.jsx
│   │   │   ├── TransactionTable.jsx    # Desktop view
│   │   │   ├── TransactionCardList.jsx # Mobile view
│   │   │   ├── TransactionCard.jsx     # Single mobile card
│   │   │   ├── TransactionRow.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   └── CategoryEmojiGrid.jsx   # Emoji picker with Twemoji
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
│   │   ├── goals/
│   │   │   ├── GoalCard.jsx
│   │   │   └── AddGoalModal.jsx
│   │   └── common/
│   │       ├── EmptyState.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── PageErrorFallback.jsx
│   │       ├── LoadingSpinner.jsx
│   │       ├── AnimatedNumber.jsx     # Framer Motion count-up
│   │       └── ThemeToggle.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TransactionsPage.jsx
│   │   ├── CategoriesPage.jsx         # Lazy loaded
│   │   ├── BudgetsPage.jsx            # Lazy loaded
│   │   ├── AccountsPage.jsx           # Lazy loaded
│   │   └── GoalsPage.jsx              # Lazy loaded
│   ├── stores/
│   │   ├── authStore.js           # User & auth state
│   │   ├── transactionStore.js    # Transaction state
│   │   ├── categoryStore.js       # Category state
│   │   ├── budgetStore.js         # Budget state
│   │   ├── accountStore.js        # Account state
│   │   ├── goalStore.js           # Goal state
│   │   └── uiStore.js             # UI state (theme, division, modals)
│   ├── hooks/
│   │   ├── useAuth.js             # Auth utilities
│   │   ├── useTransactions.js     # Transaction CRUD
│   │   ├── useCategories.js       # Category CRUD
│   │   ├── useBudgets.js          # Budget CRUD
│   │   ├── useChartColors.js      # Theme-aware chart colors
│   │   ├── useReducedMotion.js    # Accessibility preference
│   │   └── useDebounce.js         # Debounce utility
│   ├── lib/
│   │   ├── utils.js               # cn(), formatCurrency(), etc.
│   │   ├── api.js                 # Axios instance with refresh
│   │   ├── constants.js           # Preset categories, etc.
│   │   └── schemas.js             # Zod validation schemas
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                  # CSS variables & shimmer animation
├── components.json                # shadcn configuration
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── package.json
└── .env
```

---

### Decision 04: Visual Theme
- **Choice:** "Premium Glassmorphism" (Dark Blue/Purple base with ambient gradients)
- **Rationale:** Aligns with "Money Manager" premium branding defined in original specs. Provides depth and visual hierarchy.
- **Key Traits:**
  - Background: Deep blue (`#0A0E27`) with ambient radial gradients (Blue/Emerald).
  - Cards: Glassmorphism (`bg-white/5` + `backdrop-blur`).
  - Sidebar: Floating glass panel.
  - Typography: Inter with specific font weights for hierarchy.
---

## 3. State Management (Zustand)

### Store Design Principles
- **Minimal stores:** Only what needs to be global
- **Flat structure:** Avoid deep nesting
- **Actions inside store:** Keep mutations colocated
- **Selectors for derived data:** Compute in selectors, not components

### uiStore.js (Updated)
```javascript
// State
{
  theme: 'dark' | 'light',
  sidebarOpen: boolean,
  activeModal: null | string,
  activePeriod: 'month' | 'week' | 'year',
  activeDivision: 'personal' | 'office'  // Global workspace context
}

// Actions
- toggleTheme()
- toggleSidebar()
- openModal(name)
- closeModal()
- setPeriod(period)
- setDivision(division)
```

### authStore.js (Updated for Refresh Tokens)
```javascript
// State
{
  user: null | { id, email, name },
  accessToken: null | string,
  isLoading: boolean,
  isInitialized: boolean,
  error: null | string
}

// Actions
- login(email, password)      // Sets accessToken in store, refreshToken in cookie
- register(email, password, name)
- logout()                    // Clears cookie via POST /auth/logout
- refreshToken()              // POST /auth/refresh to get new accessToken
- checkAuth()                 // Called on app init, tries refresh if no token
- clearError()
```

---

## 4. Routing Structure

```javascript
// App.jsx routing configuration with lazy loading

const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage'));
const AccountsPage = lazy(() => import('./pages/AccountsPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));

Routes:
├── /login           → LoginPage (public)
├── /register        → RegisterPage (public)
└── / (protected)    → AppLayout wrapper
    ├── /dashboard   → DashboardPage (eager)
    ├── /transactions → TransactionsPage (eager)
    ├── /categories  → CategoriesPage (lazy)
    ├── /budgets     → BudgetsPage (lazy)
    ├── /accounts    → AccountsPage (lazy)
    └── /goals       → GoalsPage (lazy)

PageErrorBoundary wraps each page for isolated error handling.
```

---

## 5. API Layer (Axios with Token Refresh)

### Instance Configuration
```javascript
// lib/api.js

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  withCredentials: true, // For httpOnly cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Add accessToken from store
api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401 with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        await authStore.getState().refreshToken();
        return api(error.config);
      } catch {
        authStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
```

### API Functions
```javascript
// Auth
api.post('/auth/register', { email, password, name })
api.post('/auth/login', { email, password })
api.post('/auth/refresh')                           // Uses httpOnly cookie
api.post('/auth/logout')
api.get('/auth/me')

// Transactions
api.get('/transactions', { params: { page, limit, division, ...filters } })
api.post('/transactions', transactionData)
api.put('/transactions/:id', transactionData)
api.delete('/transactions/:id')
api.patch('/transactions/:id/restore')              // Undo delete
api.get('/transactions/summary', { params: { period, division } })

// Insights
api.get('/insights', { params: { period, division } })

// Categories, Budgets, Accounts, Goals...
```

---

## 6. Theme System

### CSS Variables in index.css
```css
:root {
  /* Light mode defaults */
  --bg-primary: #F8FAFC;
  --bg-secondary: #FFFFFF;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --accent: #3B82F6;
  --success: #10B981;
  --danger: #EF4444;
  --warning: #F59E0B;
}

.dark {
  --bg-primary: #0A0E27;
  --bg-secondary: #131837;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
}
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
      muted: 'var(--text-secondary)',
      accent: 'var(--accent)',
      success: 'var(--success)',
      danger: 'var(--danger)',
      warning: 'var(--warning)',
    }
  }
}
```

---

## 7. Animation System

### Framer Motion Usage (Minimal Scope)
```javascript
// AnimatedNumber.jsx - Count-up on first load only
import { motion, useReducedMotion } from 'framer-motion';

const AnimatedNumber = ({ value, duration = 0.5 }) => {
  const prefersReducedMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Only animate on first dashboard load
  if (prefersReducedMotion || hasAnimated) {
    return <span>{formatCurrency(value)}</span>;
  }
  
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onAnimationComplete={() => setHasAnimated(true)}
    >
      {/* Framer Motion counter implementation */}
    </motion.span>
  );
};
```

### CSS Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Skeleton Shimmer (Extended shadcn)

### skeleton.jsx
```javascript
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted/10",
        "animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent",
        "bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}
```

### Shimmer Animation in index.css
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
```

---

## 9. Chart Colors Hook

```javascript
// hooks/useChartColors.js
import { useUIStore } from '@/stores/uiStore';

export const useChartColors = () => {
  const theme = useUIStore((state) => state.theme);
  
  return {
    income: '#10B981',
    expense: '#EF4444',
    grid: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    axis: theme === 'dark' ? '#94A3B8' : '#64748B',
    tooltip: {
      bg: theme === 'dark' ? '#131837' : '#FFFFFF',
      border: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    }
  };
};
```

---

## 10. Currency Formatting

```javascript
// lib/utils.js

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Output: ₹1,23,456 (Indian number system)
```

---

## 11. Error Boundaries (Page-Level)

```javascript
// App.jsx
<Route path="/dashboard" element={
  <PageErrorBoundary>
    <DashboardPage />
  </PageErrorBoundary>
} />

// PageErrorFallback.jsx
const PageErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh]">
    <AlertTriangle className="h-12 w-12 text-danger mb-4" />
    <h2>Something went wrong</h2>
    <p className="text-muted">Check your connection and retry.</p>
    <Button onClick={resetErrorBoundary}>Try Again</Button>
  </div>
);
```

---

## 12. Delete with Undo

```javascript
// Transaction delete flow
const handleDelete = async (id) => {
  // Optimistic: Remove from UI immediately
  removeFromStore(id);
  
  // Call soft delete API
  await api.delete(`/transactions/${id}`);
  
  // Show undo toast
  toast.success('Transaction deleted', {
    action: {
      label: 'Undo',
      onClick: async () => {
        await api.patch(`/transactions/${id}/restore`);
        refetch(); // Restore to UI
      }
    },
    duration: 5000,
  });
};
```

---

## 13. Mobile Transaction Views

```javascript
// TransactionsPage.jsx
const TransactionsPage = () => {
  const { data, isLoading, handlers } = useTransactions();
  
  return (
    <>
      {/* Desktop: Table view */}
      <div className="hidden md:block">
        <TransactionTable data={data} {...handlers} />
      </div>
      
      {/* Mobile: Card view */}
      <div className="md:hidden">
        <TransactionCardList data={data} {...handlers} />
      </div>
    </>
  );
};
```

---

## 14. Login Page Background

```css
/* Login background: gradient + subtle pattern */
.login-bg {
  background: 
    url('/patterns/grid-pattern.svg'),
    linear-gradient(135deg, #0A0E27 0%, #1a1f4a 50%, #0A0E27 100%);
  background-blend-mode: overlay;
}
```

---

## 15. Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| Code splitting | React.lazy for secondary pages |
| Memoization | React.memo for chart components |
| Debouncing | Search input debounced (300ms) |
| Virtual scrolling | Consider for 100+ transactions |
| Reduced motion | useReducedMotion hook + CSS query |

### Bundle Size Goals
- Initial load: < 200KB gzipped
- Lazy-loaded pages: < 50KB each

---

## 16. Frontend Decision Summary (26 Decisions)

| # | Area | Decision |
|---|------|----------|
| 1 | Division state | `activeDivision` in `uiStore.js` |
| 2 | Folder structure | P0 components added (Onboarding, QuickAdd, etc.) |
| 3 | shadcn/ui | Added Sheet, Collapsible, Toggle, ToggleGroup |
| 4 | Count-up | Framer Motion |
| 5 | Framer scope | Minimal (count-up + page transitions) |
| 6 | Shimmer | Extended shadcn Skeleton |
| 7 | Colors | Full CSS variable mapping |
| 8 | Chart colors | `useChartColors()` hook |
| 9 | Currency | Native `Intl.NumberFormat('en-IN')` |
| 10 | Delete undo | Optimistic UI + restore endpoint |
| 11 | Reduced motion | React hook + CSS media query |
| 12 | Lazy loading | Core eager, secondary lazy |
| 13 | Error boundaries | Page-level |
| 14 | Login background | Gradient + subtle pattern |
| 15 | Auth tokens | Hybrid (localStorage + httpOnly cookie) |
| 16 | Mobile transactions | Two components (Table + CardList) |
| 17 | Category emojis | Twemoji (category grid only) |
| 18 | Insight content | Backend-generated via `/insights` |
| 19 | Date picker | shadcn Calendar + Popover |
| 20 | Form validation | Inline errors below each field |
| 21 | Loading buttons | Spinner icon + text (e.g., "Saving...") |
| 22 | Sidebar collapse | Collapsible with toggle, tooltips when collapsed |
| 23 | Pagination | Numbered on desktop, Load more on mobile |
| 24 | Modal close | Immediate if clean, confirm if dirty |
| 25 | Card hover | Lift + subtle accent glow |
| 26 | Scroll behavior | Preserve per page, reset on filter changes |

---

## 17. Additional Implementation Details

### Form Validation (Decision 20)
```jsx
// Inline error display with React Hook Form
<Input {...register('amount')} />
{errors.amount && (
  <p className="text-sm text-danger mt-1">{errors.amount.message}</p>
)}
```

### Loading Button (Decision 21)
```jsx
<Button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : 'Save Transaction'}
</Button>
```

### Collapsible Sidebar (Decision 22)
```javascript
// uiStore.js addition
{
  sidebarCollapsed: false,  // Persisted in localStorage
  toggleSidebarCollapse: () => set(...)
}

// Sidebar shows tooltips when collapsed
<Tooltip content={label} side="right">
  <NavItem icon={icon} label={sidebarCollapsed ? null : label} />
</Tooltip>
```

### Pagination (Decision 23)
```jsx
// Desktop: Numbered pagination
<Pagination>
  <PaginationPrevious />
  <PaginationItem page={1} />
  <PaginationItem page={2} />
  <PaginationEllipsis />
  <PaginationItem page={totalPages} />
  <PaginationNext />
</Pagination>

// Mobile: Load more button
<Button onClick={loadMore} disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Load More'}
</Button>
```

### Modal Close Protection (Decision 24)
```jsx
const handleClose = () => {
  if (isDirty) {
    setShowConfirmDialog(true);
  } else {
    onClose();
  }
};
```

### Card Hover Effect (Decision 25)
```css
.summary-card {
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(59, 130, 246, 0.15);
}
```

### Scroll Restoration (Decision 26)
```javascript
// Custom hook for scroll preservation
const useScrollRestoration = (key) => {
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll_${key}`);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
    }
    return () => {
      sessionStorage.setItem(`scroll_${key}`, window.scrollY.toString());
    };
  }, [key]);
};

// Reset on filter/period/division change
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [filters, period, division]);
```

