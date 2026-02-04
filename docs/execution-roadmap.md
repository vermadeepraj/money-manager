# Execution Roadmap
## Money Manager Web Application

---

## Timeline Overview

| Day | Focus | Hours | Deliverables |
|-----|-------|-------|--------------|
| **Day 1** | Foundation | 6-8h | Project setup, Backend core, Auth |
| **Day 2** | Core Features | 6-8h | Dashboard layout, Transaction CRUD |
| **Day 3** | Data & Filters | 6-8h | Tables, Filters, Categories |
| **Day 4** | Analytics | 6-8h | Charts, Insights, Budgets |
| **Day 5** | Polish & Deploy | 4-6h | Responsive, Testing, Deployment |

**Total Estimated Hours:** 28-38 hours

---

## Day 1: Foundation

### Objective
Set up complete development environment with working auth flow.

### Tasks

#### Morning (3-4h)
```
□ 1.1 Initialize Vite + React project
    - npx create-vite@latest frontend --template react
    - Install dependencies (axios, react-router, zustand, etc.)
    
□ 1.2 Configure Tailwind CSS
    - Install tailwindcss, postcss, autoprefixer
    - Set up tailwind.config.js with custom colors
    - Create index.css with CSS variables

□ 1.3 Set up shadcn/ui
    - Initialize shadcn (npx shadcn-ui@latest init)
    - Add components: button, card, input, dialog, tabs
    
□ 1.4 Initialize Express backend
    - npm init & install express, mongoose, cors, dotenv
    - Create folder structure
    - Set up server.js with middleware
```

#### Afternoon (3-4h)
```
□ 1.5 Connect MongoDB Atlas
    - Create cluster (or use existing)
    - Get connection string
    - Create config/db.js connection

□ 1.6 Create User model
    - Schema with email, password (hashed), name
    - Pre-save hook for password hashing

□ 1.7 Build Auth API
    - POST /api/v1/auth/register
    - POST /api/v1/auth/login
    - GET /api/v1/auth/me (protected)
    - JWT middleware

□ 1.8 Build Login/Register pages
    - Glassmorphism design
    - Form validation with React Hook Form + Zod
    - Connect to API
    - Store token in localStorage
```

### Day 1 Deliverable
✅ User can register, login, and see protected dashboard page

---

## Day 2: Core Features

### Objective
Complete dashboard layout and transaction management.

### Tasks

#### Morning (3-4h)
```
□ 2.1 Create AppLayout component
    - Sidebar navigation
    - Header with theme toggle
    - Main content area

□ 2.2 Set up React Router
    - Protected routes wrapper
    - Dashboard, Transactions pages

□ 2.3 Implement dark/light theme
    - Zustand uiStore for theme state
    - Toggle component
    - Persist to localStorage

□ 2.4 Build summary cards (static)
    - SummaryCard component with glassmorphism
    - Total Income, Expense, Balance, Savings Rate
    - Placeholder data initially
```

#### Afternoon (3-4h)
```
□ 2.5 Create Transaction model (backend)
    - Full schema with all fields
    - Soft delete support
    - Indexes

□ 2.6 Build Transaction API
    - GET /transactions (paginated)
    - POST /transactions
    - PUT /transactions/:id (12hr check)
    - DELETE /transactions/:id (soft delete)

□ 2.7 Create Category model + seed data
    - Default categories with emojis
    - Run seed script

□ 2.8 Build AddTransactionModal
    - Income/Expense tabs
    - Amount, Category select, Description, Date, Division
    - Form validation
    - API integration
```

### Day 2 Deliverable
✅ User can add transactions and see them saved

---

## Day 3: Data & Filters

### Objective
Complete transaction list with filtering and category management.

### Tasks

#### Morning (3-4h)
```
□ 3.1 Build TransactionTable component
    - TanStack Table setup
    - Columns: Date, Description, Category, Division, Amount
    - Loading skeleton

□ 3.2 Add pagination
    - Server-side pagination
    - Page controls (prev/next, page numbers)

□ 3.3 Implement sorting
    - Click column header to sort
    - Sort by date (default), amount

□ 3.4 Transaction row actions
    - Edit button (opens modal)
    - Delete button (confirmation)
    - Lock icon for >12hr transactions
```

#### Afternoon (3-4h)
```
□ 3.5 Build FilterPanel component
    - Search input (debounced)
    - Division dropdown (All/Personal/Office)
    - Category dropdown
    - Date range picker

□ 3.6 Implement filter API
    - Query params: search, division, category, startDate, endDate

□ 3.7 Categories page
    - List all categories (defaults + custom)
    - Add custom category modal
    - Edit/delete custom categories

□ 3.8 Edit transaction flow
    - Pre-fill modal with transaction data
    - 12-hour restriction check
    - Update API call
```

### Day 3 Deliverable
✅ Full transaction CRUD with filtering and search working

---

## Day 4: Analytics

### Objective
Complete dashboard with charts and budget tracking.

### Tasks

#### Morning (3-4h)
```
□ 4.1 Build summary API endpoint
    - GET /transactions/summary?period=month
    - Aggregation for totals, trends

□ 4.2 Connect summary cards to API
    - Fetch real data
    - Display Income, Expense, Balance
    - Add trend indicators (↑↓ vs last period)

□ 4.3 Build IncomeExpenseBar chart
    - Recharts BarChart
    - Monthly comparison
    - Animation on load

□ 4.4 Build CategoryDonut chart
    - Recharts PieChart (donut variant)
    - Expense breakdown
    - Legend with category names
```

#### Afternoon (3-4h)
```
□ 4.5 Build TrendLine chart
    - Recharts LineChart
    - Daily/weekly trend
    - Responsive container

□ 4.6 Build PeriodSelector
    - Segmented control (Week/Month/Year)
    - Updates all charts on change

□ 4.7 Build InsightCard
    - Auto-generated insight
    - "You spent X% more on Food this month"
    - Simple comparison logic

□ 4.8 Budget feature
    - Budget model & API
    - SetBudgetModal
    - BudgetCard with progress bar
    - Color coding (green/yellow/red)
```

### Day 4 Deliverable
✅ Complete dashboard with charts, insights, and budget tracking

---

## Day 5: Polish & Deploy

### Objective
Production-ready, deployed, demo-ready.

### Tasks

#### Morning (2-3h)
```
□ 5.1 Responsive design fixes
    - Test on mobile viewport (375px)
    - Test on tablet (768px)
    - Sidebar collapse on mobile
    - Stack cards/charts on small screens

□ 5.2 Loading states
    - Skeleton loaders for all lists
    - Button loading states
    - Full-page loading for auth check

□ 5.3 Error handling
    - Error boundary wrapper
    - Toast notifications for all errors
    - Empty state components
```

#### Afternoon (2-3h)
```
□ 5.4 Create demo seed data
    - Script to generate 3 months of transactions
    - Mix of income/expenses, categories
    - Create demo user account

□ 5.5 Deploy backend
    - Railway/Render: Connect GitHub repo
    - Add environment variables
    - Test health check endpoint

□ 5.6 Deploy frontend
    - Vercel: Connect GitHub repo
    - Set VITE_API_URL to backend URL
    - Test full flow

□ 5.7 Final testing
    - Full user journey test
    - Check all features work
    - Fix any last bugs

□ 5.8 Prepare demo
    - Pre-load demo data
    - Clear browser, fresh login
    - Practice 2-minute walkthrough
```

### Day 5 Deliverable
✅ Deployed, working, demo-ready application

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Running out of time | Cut budgets/accounts, focus on transactions |
| API errors | Use Postman to test independently |
| Chart library issues | Fallback to simpler Chart.js |
| Deployment fails | Keep localhost demo ready |
| Database issues | Have seed script to quickly rebuild |

---

## Feature Priority Matrix

### Must Complete (Days 1-3)
| Feature | Why |
|---------|-----|
| Auth (login/register) | Core requirement |
| Add transaction | Primary feature |
| Transaction list | Core requirement |
| Filters (division, category, date) | Hackathon requirement |
| 12-hour edit restriction | Hackathon requirement |
| Categories with emojis | Hackathon requirement |

### Should Complete (Day 4)
| Feature | Why |
|---------|-----|
| Dashboard summary cards | First impression |
| Bar chart (income vs expense) | Analytics requirement |
| Donut chart (categories) | Analytics requirement |
| Period selector (M/W/Y) | Hackathon requirement |
| Dark/light theme | Polish |

### Nice to Have (Day 5 if time)
| Feature | Why |
|---------|-----|
| Budget tracking | Differentiator |
| Line chart (trends) | Extra analytics |
| Insight card | "AI-like" feature |
| Account transfers | Completeness |
| CSV export | Utility feature |

---

## Demo Script (2 minutes)

### Opening (10 sec)
"This is Money Manager, a personal finance app for working professionals."

### Auth (20 sec)
- Show login page (glassmorphism design)
- Login with demo account
- Redirect to dashboard

### Dashboard (30 sec)
- Point out summary cards with real data
- Show trend indicators
- Toggle Month/Week/Year
- Charts update

### Add Transaction (20 sec)
- Click Add Transaction
- Show Income/Expense tabs
- Fill form, select category with emoji
- Save, see it appear in list

### Filters (20 sec)
- Go to Transactions page
- Filter by "Office" division
- Search by description
- Show date range filter

### Cool Features (20 sec)
- Toggle dark/light mode
- Show locked transaction (12hr restriction)
- Show budget progress bar
- Category with emoji

### Close (10 sec)
"Built with React, Node.js, and MongoDB."

---

## Post-Submission Polish (If Extra Time)

- [ ] Goal tracking widget
- [ ] CSV export
- [ ] Account balance tracking
- [ ] Print-friendly transaction report
- [ ] Animations refinement
- [ ] SEO meta tags
- [ ] PWA support (optional)

---

## Command Reference

### Development
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

### Deployment
```bash
# Frontend (Vercel)
# Auto-deploy on git push

# Backend (Railway)
# Auto-deploy on git push
```

### Database
```bash
# Seed categories
cd backend
npm run seed
```
