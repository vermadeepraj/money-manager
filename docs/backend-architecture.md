# Backend Architecture
## Money Manager Web Application

---

## 1. Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js 18+ | JavaScript runtime |
| Framework | Express.js 4.x | HTTP server |
| Database | MongoDB Atlas | Cloud database |
| ODM | Mongoose 8.x | MongoDB object modeling |
| Auth | jsonwebtoken | JWT generation/verification |
| Hashing | bcryptjs | Password hashing |
| Validation | Zod | Schema validation |
| CORS | cors | Cross-origin requests |
| Environment | dotenv | Configuration |

---

## 2. Folder Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── middleware/
│   ├── auth.js                  # JWT verification
│   ├── validate.js              # Zod validation middleware
│   └── errorHandler.js          # Global error handler
├── models/
│   ├── User.js
│   ├── Transaction.js
│   ├── Category.js
│   ├── Budget.js
│   └── Account.js
├── routes/
│   ├── auth.js
│   ├── transactions.js
│   ├── categories.js
│   ├── budgets.js
│   └── accounts.js
├── utils/
│   ├── schemas.js               # Zod validation schemas
│   ├── seedCategories.js        # Seed default categories
│   └── helpers.js               # Utility functions
├── server.js                    # Entry point
├── package.json
├── .env
└── .env.example
```

---

## 3. Server Configuration

### Entry Point (server.js)
```javascript
// Initialization order:
1. Load environment variables (dotenv)
2. Connect to MongoDB
3. Seed default categories (if not exist)
4. Apply middleware stack
5. Mount routes
6. Apply error handler
7. Start server
```

### Middleware Stack (in order)
```javascript
1. cors()                         // Allow frontend origin
2. express.json()                 // Parse JSON bodies
3. express.urlencoded()           // Parse URL-encoded
4. Request logger                 // Log method, path, status
```

---

## 4. Authentication Flow

### Registration
```
POST /api/v1/auth/register
├── Validate input (email, password, name)
├── Check if email exists
├── Hash password (bcrypt, 10 rounds)
├── Create user
├── Generate JWT (24h expiry)
└── Return { user, token }
```

### Login
```
POST /api/v1/auth/login
├── Validate input (email, password)
├── Find user by email
├── Compare password hash
├── Generate JWT (24h expiry)
└── Return { user, token }
```

### JWT Structure
```javascript
{
  userId: ObjectId,
  email: string,
  iat: timestamp,
  exp: timestamp (24 hours)
}
```

### Auth Middleware Flow
```
Request with Authorization: Bearer <token>
├── Extract token from header
├── Verify token (jsonwebtoken)
├── Attach userId to req.user
└── Call next()

If invalid/missing:
└── Return 401 Unauthorized
```

---

## 5. API Routes

### Auth Routes (/api/v1/auth)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /register | ❌ | Create new user |
| POST | /login | ❌ | Authenticate user |
| GET | /me | ✅ | Get current user |

---

### Transaction Routes (/api/v1/transactions)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | ✅ | List transactions (paginated, filtered) |
| POST | / | ✅ | Create transaction |
| GET | /summary | ✅ | Get aggregated stats |
| PUT | /:id | ✅ | Update transaction (12hr limit) |
| DELETE | /:id | ✅ | Soft delete (12hr limit) |

#### GET /transactions Query Parameters
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| sort | string | -date | Sort field (prefix - for desc) |
| search | string | - | Search in description |
| division | string | all | Filter: personal, office, all |
| category | string | all | Filter by categoryId |
| startDate | string | - | ISO date |
| endDate | string | - | ISO date |
| type | string | all | Filter: income, expense, all |

#### Response Format
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### Category Routes (/api/v1/categories)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | ✅ | List all categories |
| POST | / | ✅ | Create custom category |
| PUT | /:id | ✅ | Update custom category |
| DELETE | /:id | ✅ | Delete custom category |

---

### Budget Routes (/api/v1/budgets)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | ✅ | List user budgets with spending |
| POST | / | ✅ | Set budget for category |
| PUT | /:id | ✅ | Update budget amount |
| DELETE | /:id | ✅ | Remove budget |

#### GET /budgets Response
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "category": { "name": "Food", "emoji": "🍔" },
      "amount": 8000,
      "spent": 5250,
      "percentage": 65.6,
      "status": "normal | warning | exceeded"
    }
  ]
}
```

---

### Account Routes (/api/v1/accounts)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | ✅ | List accounts |
| POST | / | ✅ | Create account |
| PUT | /:id | ✅ | Update account |
| DELETE | /:id | ✅ | Soft delete account |
| POST | /transfer | ✅ | Transfer between accounts |

---

## 6. Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Human-readable message",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

### Error Codes
| Code | HTTP | Description |
|------|------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| UNAUTHORIZED | 401 | Missing/invalid token |
| FORBIDDEN | 403 | Not allowed (12hr limit) |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Email already exists |
| SERVER_ERROR | 500 | Internal error |

### Global Error Handler
```javascript
// middleware/errorHandler.js
- Catches all errors
- Logs error for debugging
- Returns consistent JSON format
- Hides internal details in production
```

---

## 7. Validation Schemas (Zod)

### User Schemas
```javascript
registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(50)
});

loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
```

### Transaction Schemas
```javascript
createTransactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().positive(),
  categoryId: z.string().length(24),
  description: z.string().max(200).optional(),
  date: z.string().datetime(),
  division: z.enum(['personal', 'office']),
  accountId: z.string().length(24).optional(),
  toAccountId: z.string().length(24).optional()  // For transfers
});

updateTransactionSchema = createTransactionSchema.partial();
```

### Category Schema
```javascript
createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  emoji: z.string().min(1).max(4),
  type: z.enum(['income', 'expense']),
  division: z.enum(['personal', 'office'])
});
```

---

## 8. Business Logic

### 12-Hour Edit Restriction
```javascript
// Check before update/delete
const canModify = (transaction) => {
  const hoursElapsed = (Date.now() - transaction.createdAt) / (1000 * 60 * 60);
  return hoursElapsed < 12;
};

if (!canModify(transaction)) {
  throw {
    statusCode: 403,
    code: 'EDIT_WINDOW_EXPIRED',
    message: 'Cannot modify transactions older than 12 hours'
  };
}
```

### Soft Delete Implementation
```javascript
// DELETE /transactions/:id
await Transaction.findByIdAndUpdate(id, {
  isDeleted: true,
  deletedAt: new Date()
});

// All queries filter deleted
Transaction.find({ userId, isDeleted: false });
```

### Transfer Creation
```javascript
// POST /accounts/transfer
// Creates two linked transactions:
const withdrawal = await Transaction.create({
  userId,
  type: 'transfer',
  amount: -amount,  // Negative
  accountId: fromAccountId,
  linkedTransactionId: null
});

const deposit = await Transaction.create({
  userId,
  type: 'transfer',
  amount: amount,   // Positive
  accountId: toAccountId,
  linkedTransactionId: withdrawal._id
});

// Update withdrawal with link
withdrawal.linkedTransactionId = deposit._id;
await withdrawal.save();
```

---

## 9. Aggregation Pipelines

### Transaction Summary
```javascript
// GET /transactions/summary?period=month
const summary = await Transaction.aggregate([
  { $match: { userId, isDeleted: false, date: { $gte: startOfMonth, $lte: endOfMonth } } },
  { $group: {
    _id: '$type',
    total: { $sum: '$amount' }
  }}
]);

// Returns: { totalIncome, totalExpense, balance, savingsRate }
```

### Category Breakdown
```javascript
// For donut chart
const breakdown = await Transaction.aggregate([
  { $match: { userId, isDeleted: false, type: 'expense', date: { ... } } },
  { $group: {
    _id: '$categoryId',
    total: { $sum: '$amount' }
  }},
  { $lookup: { from: 'categories', ... } },
  { $sort: { total: -1 } }
]);
```

### Trend Data
```javascript
// For line chart - daily totals
const trend = await Transaction.aggregate([
  { $match: { userId, isDeleted: false, date: { ... } } },
  { $group: {
    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
    income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
    expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
  }},
  { $sort: { _id: 1 } }
]);
```

---

## 10. Security Measures

| Measure | Implementation |
|---------|----------------|
| Password Hashing | bcrypt with 10 salt rounds |
| JWT Signing | HS256 with secret from env |
| Token Expiry | 24 hours |
| Input Validation | Zod schemas on all inputs |
| MongoDB Injection | Mongoose parameterized queries |
| XSS Prevention | JSON API (no HTML rendering) |
| CORS | Whitelist frontend origin |
| Error Messages | No stack traces in production |

---

## 11. Logging

### Console Log Format
```
[2026-02-03T10:30:00.000Z] POST /api/v1/transactions - 201 (45ms)
[2026-02-03T10:30:01.000Z] GET /api/v1/transactions?page=1 - 200 (23ms)
```

### Log Levels (Basic)
- **Info:** All requests
- **Error:** Failed requests with stack trace

---

## 12. Environment Variables

```env
# .env.example

# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/moneymanager

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173
```

---

## 13. Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seedCategories.js"
  }
}
```

---

## 14. Health Check

```
GET /api/v1/health
Response: { status: 'ok', timestamp: '...' }
```

Use for deployment verification and monitoring.
