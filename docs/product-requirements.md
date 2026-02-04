# Product Requirements Document (PRD)
## Money Manager Web Application

---

## 1. Executive Summary

**Product Name:** Money Manager  
**Type:** Personal Finance Web Application  
**Stack:** MERN (MongoDB, Express.js, React, Node.js)  
**Target Platform:** Web (Desktop-first, Mobile-responsive)  
**Hackathon:** HCL GUVI  

---

## 2. Vision & Objectives

### Product Vision
A **premium, visually stunning** personal finance manager that empowers working professionals to track income, expenses, and budgets with modern UI/UX and powerful analytics.

### Success Metrics
| Metric | Target |
|--------|--------|
| Feature Completeness | 100% of must-have requirements |
| UI Polish Level | Premium/Production-grade |
| Judge First Impression | "Wow" factor within 3 seconds |
| Demo Flow Time | Under 2 minutes |

---

## 3. Target Users

### Primary Persona
**Working Professionals** managing salaries and expenses

**Characteristics:**
- Age: 25-45 years
- Income: Regular salary + occasional freelance
- Pain Points: Losing track of daily expenses, no budget visibility
- Goals: Control spending, save more, understand where money goes

### User Context
- **Single-user** isolated accounts (each user has private data)
- **Personal + Office** expense divisions (hackathon requirement)
- **Online-only** usage (no offline sync required)

---

## 4. Functional Requirements

### 4.1 Authentication (MUST HAVE)

| Requirement | Description |
|-------------|-------------|
| REQ-AUTH-001 | User registration with email + password |
| REQ-AUTH-002 | User login with JWT token generation |
| REQ-AUTH-003 | Persistent login (token stored in localStorage) |
| REQ-AUTH-004 | Protected routes (redirect to login if unauthenticated) |
| REQ-AUTH-005 | Logout functionality |

---

### 4.2 Dashboard (MUST HAVE)

| Requirement | Description |
|-------------|-------------|
| REQ-DASH-001 | Summary cards: Total Income, Total Expense, Balance, Savings Rate |
| REQ-DASH-002 | Trend indicators (↑/↓ percentage vs previous period) |
| REQ-DASH-003 | Mini sparkline charts in summary cards |
| REQ-DASH-004 | Period selector: Month / Week / Year (segmented control) |
| REQ-DASH-005 | Bar chart: Income vs Expense comparison |
| REQ-DASH-006 | Donut chart: Expense breakdown by category |
| REQ-DASH-007 | Line chart: Spending trend over time |
| REQ-DASH-008 | Auto-generated monthly insight card |

---

### 4.3 Transaction Management (MUST HAVE)

| Requirement | Description |
|-------------|-------------|
| REQ-TXN-001 | Add Transaction modal with Income/Expense tabs |
| REQ-TXN-002 | Transaction fields: amount, category, description, date, division |
| REQ-TXN-003 | Transaction list with sorting and pagination (20 items/page) |
| REQ-TXN-004 | Edit transaction (within 12-hour window only) |
| REQ-TXN-005 | Delete transaction (within 12-hour window only, soft delete) |
| REQ-TXN-006 | Lock icon displayed on transactions older than 12 hours |
| REQ-TXN-007 | Filter by: Division (Personal/Office), Category, Date Range |
| REQ-TXN-008 | Search transactions by description |

---

### 4.4 Categories (MUST HAVE)

| Requirement | Description |
|-------------|-------------|
| REQ-CAT-001 | Preset categories with emojis (cannot be deleted) |
| REQ-CAT-002 | User can create custom categories |
| REQ-CAT-003 | User can edit/delete only their custom categories |
| REQ-CAT-004 | Each category has: name, emoji, type (income/expense), division |
| REQ-CAT-005 | Category summary showing total spent per category |

**Preset Categories:**

| Type | Division | Categories |
|------|----------|------------|
| Income | Personal | 💰 Salary, 💼 Freelance, 📈 Investment, 🎁 Gifts, 💵 Other |
| Income | Office | 💼 Business Income, 📊 Reimbursement |
| Expense | Personal | 🍔 Food, ⛽ Fuel, 💊 Medical, 🎬 Entertainment, 🏠 Utilities, 👔 Shopping, ✈️ Travel, 📚 Education |
| Expense | Office | 💼 Office Supplies, 🚗 Transport, 🍽️ Client Meals, 📱 Subscriptions |

---

### 4.5 Account Transfers (MUST HAVE)

| Requirement | Description |
|-------------|-------------|
| REQ-ACC-001 | Create accounts (Bank, Cash, Wallet) |
| REQ-ACC-002 | Transfer money between accounts |
| REQ-ACC-003 | Transfers stored as linked transactions (withdrawal + deposit) |
| REQ-ACC-004 | Display transfers with special transfer icon |

---

### 4.6 Budgets (HIGH PRIORITY - NICE TO HAVE)

| Requirement | Description |
|-------------|-------------|
| REQ-BUD-001 | Set monthly budget per category |
| REQ-BUD-002 | Progress bar showing spent vs budget |
| REQ-BUD-003 | Color-coded: Green (<60%), Yellow (60-80%), Red (>80%) |
| REQ-BUD-004 | Toast alert at 80% threshold |
| REQ-BUD-005 | Toast alert when budget exceeded |

---

### 4.7 Export (MEDIUM PRIORITY - NICE TO HAVE)

| Requirement | Description |
|-------------|-------------|
| REQ-EXP-001 | Export filtered transactions to CSV |
| REQ-EXP-002 | Download triggers immediately on button click |

---

### 4.8 Goal Tracking (LOW PRIORITY - NICE TO HAVE)

| Requirement | Description |
|-------------|-------------|
| REQ-GOAL-001 | Create savings goal with target amount and date |
| REQ-GOAL-002 | Progress bar showing current savings vs goal |
| REQ-GOAL-003 | Monthly savings needed calculation |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load time: < 2 seconds
- API response time: < 500ms
- Chart animations: 800ms smooth transitions

### 5.2 Security
- JWT-based authentication
- Password hashing (bcrypt)
- Protected API routes
- Input validation (Zod schemas)

### 5.3 Usability
- Dark mode default with light mode toggle
- Responsive design (desktop-first, mobile-usable)
- Skeleton loaders for async content
- Toast notifications for actions

### 5.4 Accessibility (Basic Level)
- Semantic HTML structure
- Keyboard navigation on forms/modals
- ARIA labels on icon buttons
- Color contrast (WCAG AA)

---

## 6. Business Rules

### 6.1 12-Hour Edit Restriction
```
IF (currentTime - transaction.createdAt) > 12 hours:
    - Hide Edit button, show 🔒 lock icon
    - Hide Delete button
    - Show tooltip: "Cannot modify transactions older than 12 hours"
```

### 6.2 Soft Delete
- Transactions are never permanently deleted
- `isDeleted: true` flag hides from UI
- `deletedAt` timestamp recorded
- Data preserved for audit/recovery

### 6.3 Transfer Logic
```
Transfer from Account A to Account B (₹5,000):
├── Transaction 1: Expense from A (-₹5,000)
├── Transaction 2: Income to B (+₹5,000)
└── Both linked via linkedTransactionId
```

### 6.4 Currency
- Single currency: **₹ INR**
- Format: Indian numbering system (₹1,23,456.00)
- Negative balances allowed (displayed in red)

### 6.5 Timezone
- All timestamps stored in **UTC**
- Display in user's local timezone
- Server generates `createdAt` (prevents client manipulation)

---

## 7. Out of Scope

The following features are **explicitly excluded** for this hackathon:

- ❌ Recurring transactions (cron job complexity)
- ❌ Bill reminders (notification infrastructure)
- ❌ AI/ML-based insights (model training)
- ❌ Multi-currency support (exchange rate complexity)
- ❌ Offline mode (sync complexity)
- ❌ Role-based admin (single-user only)
- ❌ Rate limiting (time constraint)
- ❌ Advanced audit logs (time constraint)
- ❌ PDF export (lower priority than CSV)

---

## 8. Success Criteria

### Demo Checklist
- [ ] Login/Register flow works smoothly
- [ ] Dashboard shows accurate summary data
- [ ] Charts render with animations
- [ ] Add transaction modal functions correctly
- [ ] Edit within 12 hours works, locked after
- [ ] Filters narrow down transaction list
- [ ] Dark/Light theme toggle works
- [ ] Responsive on tablet viewport
- [ ] No console errors
- [ ] Professional, polished appearance
