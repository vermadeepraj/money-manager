# Backend Guidelines - Anti-Gravity Money Manager

> **Tech Stack**: Node.js + Express 5 + MongoDB + Mongoose 9 + Zod 4
> **Related Docs**: [FRONTEND.md](./FRONTEND.md) | [DATABASE.md](./DATABASE.md) | [Root AGENTS.md](../AGENTS.md)

---

## Build Commands

```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start with nodemon (port 5000)
npm start            # Production start
npm run seed         # Seed default categories
```

---

## Directory Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── middleware/
│   ├── auth.js                # JWT verification
│   ├── validate.js            # Zod validation factory
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── User.js
│   ├── Transaction.js
│   ├── Category.js
│   ├── Account.js
│   ├── Budget.js
│   └── Goal.js
├── routes/
│   ├── auth.js                # /api/v1/auth
│   ├── transactions.js        # /api/v1/transactions
│   ├── categories.js          # /api/v1/categories
│   ├── accounts.js            # /api/v1/accounts
│   ├── budgets.js             # /api/v1/budgets
│   ├── goals.js               # /api/v1/goals
│   └── insights.js            # /api/v1/insights
├── services/                  # [RECOMMENDED] Extract business logic
├── utils/
│   ├── schemas.js             # Zod validation schemas
│   ├── helpers.js             # canModifyTransaction, getPeriodDates
│   └── seedCategories.js      # Seed script
├── server.js                  # Entry point
└── package.json
```

---

## API Endpoints Summary

| Route | Endpoints | Auth |
|-------|-----------|------|
| `/api/v1/auth` | POST `/register`, `/login`, `/refresh`, `/logout`, GET `/me` | Public (except /me) |
| `/api/v1/transactions` | GET `/`, `/summary`, `/trend`, `/export`, POST `/`, PUT `/:id`, DELETE `/:id`, PATCH `/:id/restore` | Private |
| `/api/v1/categories` | GET `/`, POST `/`, PUT `/:id`, DELETE `/:id` | Private |
| `/api/v1/accounts` | GET `/`, POST `/`, PUT `/:id`, DELETE `/:id`, POST `/transfer` | Private |
| `/api/v1/budgets` | GET `/`, POST `/`, PUT `/:id`, DELETE `/:id` | Private |
| `/api/v1/goals` | GET `/`, POST `/`, PUT `/:id`, DELETE `/:id`, POST `/:id/add` | Private |
| `/api/v1/insights` | GET `/` | Private |

---

## Route Handler Pattern

```javascript
const express = require('express');
const Model = require('../models/Model');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createSchema, updateSchema } = require('../utils/schemas');

const router = express.Router();

// Apply auth to all routes
router.use(auth);

/**
 * @route   GET /api/v1/resource
 * @desc    List all resources (paginated)
 * @access  Private
 */
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        
        const items = await Model.find({ 
            userId: req.user.userId,
            isDeleted: false 
        })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
        
        res.json({
            success: true,
            data: { items }
        });
    } catch (error) {
        next(error);  // Always pass to error handler
    }
});

/**
 * @route   POST /api/v1/resource
 * @desc    Create new resource
 * @access  Private
 */
router.post('/', validate(createSchema), async (req, res, next) => {
    try {
        const item = await Model.create({
            ...req.body,
            userId: req.user.userId
        });
        
        res.status(201).json({
            success: true,
            data: { item }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
```

---

## API Response Format

### Success Response (Standardize to this)
```javascript
// Single item
{ success: true, data: { transaction: {...} } }

// List with pagination
{ 
    success: true, 
    data: { 
        transactions: [...],
        pagination: { page, limit, total, pages, hasNext, hasPrev }
    }
}

// Action confirmation
{ success: true, data: { message: 'Deleted successfully' } }
```

### Error Response
```javascript
{
    success: false,
    error: {
        message: 'Human-readable error message',
        code: 'ERROR_CODE',
        statusCode: 400,
        details: [...]  // Optional: validation errors
    }
}
```

### Current Inconsistencies to Fix
| Issue | Current | Should Be |
|-------|---------|-----------|
| Login token field | `token` (register) vs `accessToken` (login) | Standardize to `accessToken` |
| Error codes | `NO_REFRESH_TOKEN` vs `UNAUTHORIZED` | Use consistent codes |

---

## Error Codes

| Code | HTTP | When to Use |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Zod/Mongoose validation failed |
| `INVALID_ID` | 400 | Invalid MongoDB ObjectId |
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `TOKEN_EXPIRED` | 401 | JWT expired |
| `FORBIDDEN` | 403 | Not allowed (ownership, time limit) |
| `EDIT_WINDOW_EXPIRED` | 403 | 12-hour edit limit exceeded |
| `UNDO_EXPIRED` | 403 | 30-second undo window expired |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate (email, budget category) |
| `SERVER_ERROR` | 500 | Internal error |

---

## Middleware Chain

```
Request → CORS → JSON Parser → Cookie Parser → Auth → Validate → Handler → Error Handler
```

### Auth Middleware
```javascript
// Extracts userId from JWT, attaches to req.user
req.user = { userId: '...', email: '...' };
```

### Validate Middleware
```javascript
// Usage: router.post('/', validate(schema), handler)
// Validates req.body against Zod schema
// Replaces req.body with validated/transformed data
```

### Error Handler
```javascript
// Catches all errors, returns consistent format
// Handles: Mongoose ValidationError, CastError, duplicate key
// Handles: JWT errors (invalid, expired)
// Hides stack traces in production
```

---

## Zod Validation Schemas

```javascript
// utils/schemas.js - Naming convention: createXxxSchema, updateXxxSchema

const createTransactionSchema = z.object({
    type: z.enum(['income', 'expense', 'transfer']),
    amount: z.number().positive(),
    categoryId: z.string().length(24),
    description: z.string().max(200).optional().default(''),
    date: z.string().datetime(),
    division: z.enum(['personal', 'office']),
    accountId: z.string().length(24).optional().nullable(),
});

const updateTransactionSchema = createTransactionSchema.partial();
```

**Cross-Reference**: Frontend Zod schemas should mirror these for consistent validation.

---

## Authentication Flow

### Access Token (Short-lived)
- Stored in memory (frontend authStore)
- Expires in 15 minutes
- Sent via `Authorization: Bearer <token>`

### Refresh Token (Long-lived)
- Stored in httpOnly cookie
- Expires in 7 days
- Used to get new access token

### Recommended: Store Refresh Tokens in Database
```javascript
// models/RefreshToken.js - CREATE THIS
const refreshTokenSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    deviceInfo: { type: String },  // User agent
    createdAt: { type: Date, default: Date.now, expires: '7d' }  // TTL index
});
```

Benefits:
- Can revoke specific tokens
- Can see active sessions
- Can detect token theft

---

## Business Rules

### 12-Hour Edit Window
```javascript
// utils/helpers.js
const canModifyTransaction = (createdAt) => {
    const hoursElapsed = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    return hoursElapsed < 12;
};

// In route handler:
if (!canModifyTransaction(transaction.createdAt)) {
    return res.status(403).json({
        success: false,
        error: { message: 'Cannot modify transactions older than 12 hours', code: 'EDIT_WINDOW_EXPIRED' }
    });
}
```

### 30-Second Undo Window
```javascript
// PATCH /:id/restore - Only within 30 seconds of deletion
const timeSinceDelete = Date.now() - new Date(transaction.deletedAt).getTime();
if (timeSinceDelete > 30 * 1000) {
    return res.status(403).json({
        success: false,
        error: { message: 'Undo window expired', code: 'UNDO_EXPIRED' }
    });
}
```

### Soft Delete vs Hard Delete
| Collection | Delete Type | Reason |
|------------|-------------|--------|
| Transaction | Soft | User data, needs undo, audit trail |
| Category | Soft | May have linked transactions |
| Account | Soft | May have linked transactions |
| Goal | Soft | User data, may want to restore |
| Budget | **Hard** | Settings, not user content, no undo needed |
| User | N/A | Not deletable |

---

## Environment Variables

```bash
# .env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/moneymanager

# JWT (Use different secrets!)
JWT_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret  # Should differ from JWT_SECRET
JWT_EXPIRES_IN=15m

# CORS
FRONTEND_URL=http://localhost:5173
```

### Recommended: Environment Validation
```javascript
// config/env.js - CREATE THIS
const { z } = require('zod');

const envSchema = z.object({
    PORT: z.string().default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    MONGODB_URI: z.string().url(),
    JWT_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    FRONTEND_URL: z.string().url(),
});

const env = envSchema.parse(process.env);
module.exports = env;
```

---

## Recommendations

### 1. Security Packages (Add These)
```bash
npm install helmet express-rate-limit express-mongo-sanitize
```

```javascript
// server.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

app.use(helmet());  // Security headers
app.use(mongoSanitize());  // Prevent NoSQL injection

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Stricter limit for auth
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
```

### 2. Services Layer (Extract Business Logic)
```javascript
// services/transactionService.js
class TransactionService {
    async create(userId, data) {
        const category = await Category.findById(data.categoryId);
        if (!category) throw { statusCode: 404, code: 'NOT_FOUND' };
        
        const transaction = await Transaction.create({ ...data, userId });
        
        // Auto-update account balance (FIX THIS BUG)
        if (data.accountId) {
            const balanceChange = data.type === 'income' ? data.amount : -data.amount;
            await Account.findByIdAndUpdate(data.accountId, { $inc: { balance: balanceChange } });
        }
        
        return transaction;
    }
}

// In route:
router.post('/', validate(schema), async (req, res, next) => {
    try {
        const transaction = await transactionService.create(req.user.userId, req.body);
        res.status(201).json({ success: true, data: { transaction } });
    } catch (error) {
        next(error);
    }
});
```

### 3. Fix Account Balance Bug (CRITICAL)
Currently, account balances are NOT updated when creating income/expense transactions. Only transfers update balances. This is inconsistent.

```javascript
// In transaction creation - ADD THIS:
if (accountId && type !== 'transfer') {
    const balanceChange = type === 'income' ? amount : -amount;
    await Account.findByIdAndUpdate(accountId, { 
        $inc: { balance: balanceChange } 
    });
}

// In transaction deletion - ADD THIS:
if (transaction.accountId && transaction.type !== 'transfer') {
    const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
    await Account.findByIdAndUpdate(transaction.accountId, { 
        $inc: { balance: balanceChange } 
    });
}
```

### 4. Password Reset Flow (Implement This)
```javascript
// POST /api/v1/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: true });  // Don't reveal if email exists
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;  // 10 minutes
    await user.save();
    
    // Send email with resetToken (implement email service)
    res.json({ success: true, data: { message: 'Reset email sent' } });
});

// POST /api/v1/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) throw { statusCode: 400, message: 'Invalid or expired token' };
    
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    res.json({ success: true, data: { message: 'Password reset successful' } });
});
```

---

## Cross-References

- **Database Schemas**: See [DATABASE.md](./DATABASE.md) for Mongoose models and indexes
- **Frontend API Usage**: See [FRONTEND.md](./FRONTEND.md) for how API is consumed
- **Aggregation Queries**: See [DATABASE.md](./DATABASE.md) for optimized patterns
