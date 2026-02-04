# AGENTS.md - Anti-Gravity Money Manager

> Entry point for AI coding agents. For detailed guidelines, see the `.agents/` folder.

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [.agents/FRONTEND.md](.agents/FRONTEND.md) | React, Zustand, Tailwind, components |
| [.agents/BACKEND.md](.agents/BACKEND.md) | Express, routes, middleware, auth |
| [.agents/DATABASE.md](.agents/DATABASE.md) | MongoDB, Mongoose, schemas, queries |

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Zustand 5, shadcn/ui, react-hook-form, Zod |
| **Backend** | Node.js, Express 5, Mongoose 9, JWT, Zod |
| **Database** | MongoDB Atlas |

---

## Quick Start

```bash
# Backend (Terminal 1)
cd backend
npm install
npm run seed      # First time only - seeds categories
npm run dev       # Starts on port 5000

# Frontend (Terminal 2)
cd frontend
npm install
npm run dev       # Starts on port 5173
```

---

## Environment Setup

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/moneymanager
JWT_SECRET=your-32-char-minimum-secret
JWT_REFRESH_SECRET=different-32-char-secret
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Project Structure

```
anti-gravity/
├── backend/
│   ├── config/          # Database connection
│   ├── middleware/      # auth, validate, errorHandler
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Zod schemas, helpers
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # UI and feature components
│   │   ├── pages/       # Route pages
│   │   ├── stores/      # Zustand stores
│   │   ├── lib/         # api.js, utils.js
│   │   └── App.jsx
│   └── index.html
├── docs/                # Detailed architecture docs
└── .agents/             # Agent-specific guidelines
```

---

## Key Conventions

### Code Style
- **Indentation**: 4 spaces
- **Strings**: Single quotes
- **Semicolons**: Yes (backend), No (frontend)

### Naming
- **Components**: `PascalCase` (e.g., `AddTransactionModal.jsx`)
- **Stores**: `useXxxStore` (e.g., `useAuthStore`)
- **Utils**: `camelCase` (e.g., `formatCurrency`)

### API Response Format
```javascript
// Success
{ success: true, data: { ... } }

// Error
{ success: false, error: { message, code, statusCode } }
```

---

## Common Tasks

| Task | Steps |
|------|-------|
| **Add API endpoint** | 1. Zod schema in `utils/schemas.js` → 2. Route in `routes/` → 3. API fn in `lib/api.js` → 4. Store action |
| **Add component** | Create in `components/{feature}/`, use shadcn primitives, use `cn()` for classes |
| **Add page** | Create in `pages/`, add route in `App.jsx`, wrap lazy imports with `Suspense` |
| **Add store** | Create `useXxxStore` in `stores/`, follow existing pattern |

---

## Critical Business Rules

1. **12-Hour Edit Window**: Transactions can only be modified within 12 hours of creation
2. **30-Second Undo**: Soft-deleted items can be restored within 30 seconds
3. **Division Filter**: All data is filtered by `personal` or `office` division
4. **Soft Delete**: Transactions, Categories, Accounts, Goals use soft delete

---

## Known Issues & Recommendations

See detailed docs for full recommendations. Key items:

| Issue | Priority | Location |
|-------|----------|----------|
| Account balance not auto-updated on transaction create | **Critical** | [BACKEND.md](.agents/BACKEND.md) |
| N+1 queries in budgets/insights | High | [DATABASE.md](.agents/DATABASE.md) |
| Missing security packages (helmet, rate-limit) | High | [BACKEND.md](.agents/BACKEND.md) |
| Missing stores (budgetStore, goalStore) | Medium | [FRONTEND.md](.agents/FRONTEND.md) |
| No ErrorBoundary component | Medium | [FRONTEND.md](.agents/FRONTEND.md) |

---

## Feature Status

| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| Auth | Complete | Complete | **Done** |
| Dashboard | Complete | Complete | **Done** |
| Transactions | Complete | Complete | **Done** |
| Categories | Complete | Complete | **Done** |
| Accounts | Complete | Complete | **Done** |
| Budgets | Placeholder | Complete | **Needs Frontend** |
| Goals | Placeholder | Complete | **Needs Frontend** |

---

## Need More Detail?

- **Frontend patterns, stores, forms**: [.agents/FRONTEND.md](.agents/FRONTEND.md)
- **Backend routes, auth, services**: [.agents/BACKEND.md](.agents/BACKEND.md)
- **Database schemas, queries, indexes**: [.agents/DATABASE.md](.agents/DATABASE.md)
- **Full architecture docs**: `docs/` folder
