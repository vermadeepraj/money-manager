# UI/UX Design Specification
## Money Manager Web Application

---

## 1. Design Philosophy

### Core Principles
| Principle | Implementation |
|-----------|----------------|
| **Premium Feel** | Glassmorphism, careful typography, thoughtful spacing |
| **Trust & Stability** | Fintech blue palette, clean layouts, predictable behavior |
| **Data Clarity** | Tabular numbers, clear hierarchy, scannable tables |
| **Delightful Interactions** | Subtle animations, responsive feedback, smooth transitions |

### First Impression Goal
> The judge should think "This looks like a real product" within 3 seconds of seeing the dashboard.

---

## 2. Color System

### Dark Mode (Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0A0E27` | Page background |
| `--bg-secondary` | `#131837` | Card backgrounds |
| `--bg-glass` | `rgba(255,255,255,0.05)` | Glassmorphism panels |
| `--border-subtle` | `rgba(255,255,255,0.1)` | Card borders |
| `--accent` | `#3B82F6` | Primary actions, links |
| `--accent-hover` | `#2563EB` | Hover state |
| `--success` | `#10B981` | Income, positive |
| `--danger` | `#EF4444` | Expense, negative |
| `--warning` | `#F59E0B` | Alerts, budgets near limit |
| `--text-primary` | `#F1F5F9` | Headings, primary text |
| `--text-secondary` | `#94A3B8` | Captions, labels |
| `--text-muted` | `#64748B` | Disabled, placeholders |

### Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#F8FAFC` | Page background |
| `--bg-secondary` | `#FFFFFF` | Card backgrounds |
| `--bg-glass` | `rgba(0,0,0,0.02)` | Subtle panels |
| `--border-subtle` | `rgba(0,0,0,0.08)` | Card borders |
| `--text-primary` | `#1E293B` | Headings, primary text |
| `--text-secondary` | `#64748B` | Captions, labels |

### Semantic Colors (Both Modes)
```
Income:  #10B981 (Emerald Green)
Expense: #EF4444 (Rose Red)
Transfer: #8B5CF6 (Violet)
Budget Warning: #F59E0B (Amber)
Budget Exceeded: #EF4444 (Rose Red)
```

---

## 3. Typography

### Font Family
**Inter** (Google Fonts) — clean, highly readable, designed for UI

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | 36px | 700 | 1.2 | Dashboard total balance |
| H1 | 30px | 600 | 1.3 | Page titles |
| H2 | 24px | 600 | 1.35 | Section headers |
| H3 | 20px | 600 | 1.4 | Card titles |
| Body | 16px | 400 | 1.5 | Regular text |
| Small | 14px | 400 | 1.5 | Labels, captions |
| Caption | 12px | 500 | 1.4 | Timestamps, badges |

### Number Formatting
```css
/* Financial numbers use tabular figures for alignment */
.amount {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
```

---

## 4. Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps |
| `space-2` | 8px | Icon-text gaps |
| `space-3` | 12px | Small padding |
| `space-4` | 16px | Card padding |
| `space-5` | 20px | Section gaps |
| `space-6` | 24px | Large padding |
| `space-8` | 32px | Section margins |
| `space-10` | 40px | Page margins |
| `space-12` | 48px | Major sections |

### Density: **Airy/Spacious**
- Generous whitespace between elements
- Cards have 24px padding
- List items have 16px vertical gaps

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Buttons, inputs |
| `radius-md` | 8px | Small cards, badges |
| `radius-lg` | 12px | Cards, modals |
| `radius-xl` | 16px | Large panels |
| `radius-full` | 9999px | Pills, avatars |

---

## 6. Shadows

### Dark Mode
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3); /* Accent glow */
```

### Light Mode
```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
```

---

## 7. Glassmorphism

### Glass Card Style
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
```

### Usage
- Dashboard summary cards
- Transaction modal
- Floating panels
- Sidebar (optional)

---

## 8. Animation Guidelines

### Timing
| Animation | Duration | Easing |
|-----------|----------|--------|
| Hover states | 100ms | ease-out |
| Page transitions | 200ms | ease-in-out |
| Modal open/close | 150ms | ease-out |
| Chart draw | 800ms | ease-out |
| Number count-up | 500ms | ease-out |
| Toast enter | 200ms | ease-out |
| Toast exit | 150ms | ease-in |

### Micro-interactions
- **Buttons:** Subtle scale (0.98) on press
- **Cards:** Slight lift on hover (translateY -2px + shadow increase)
- **Icons:** Color transition on hover
- **Inputs:** Border color transition on focus

### Chart Animations
- Charts "draw themselves" on initial load
- Data updates animate smoothly (bars grow/shrink)
- Donut slices animate in sequentially

### Number Animations (Refined)
- **Count-up on first dashboard load only** (~500ms)
- Period changes: instant update with optional light fade
- Avoids animation fatigue

---

## 9. Icon System

### Library: **Lucide React**

### Stroke Style
| State | Style |
|-------|-------|
| Default/Inactive | Outline (stroke-width: 1.5) |
| Active/Selected | Filled variant or heavier stroke |

### Category Emojis
```
🍔 Food & Dining
⛽ Fuel & Transport
💊 Medical & Health
🎬 Entertainment
🏠 Housing & Utilities
👔 Shopping & Clothing
✈️ Travel
📚 Education
💼 Business
💰 Salary/Income
🎁 Gifts
📱 Subscriptions
💵 Other
```

### UI Icons (Lucide)
```
Dashboard: LayoutDashboard
Transactions: Receipt
Categories: Tags
Budgets: PiggyBank
Accounts: Wallet
Goals: Target
Settings: Settings
Add: Plus
Edit: Pencil
Delete: Trash2
Lock: Lock
Search: Search
Filter: Filter
Calendar: CalendarDays
ChevronDown: ChevronDown
Sun/Moon: Sun, Moon (theme toggle)
Logout: LogOut
```

---

## 10. Component Patterns

### Summary Card (Refined)
```
┌────────────────────────────────────┐
│  💰 Balance                        │
│                                    │
│  ₹1,45,000        ↑ 12.5%         │
│  [═══════ sparkline ═══════]       │
└────────────────────────────────────┘

Cards display: Balance, Total Expense, Budget Status, Savings Rate
```

### Transaction Row
```
┌──────────────────────────────────────────────────────────┐
│  🍔  Coffee at Starbucks     Personal • Food    ₹450    │
│      Today, 9:30 AM                           [✏️] [🗑️] │
└──────────────────────────────────────────────────────────┘

- Emoji left-aligned
- Description + metadata
- Division badge + Category badge
- Amount (green income, red expense)
- Action icons (🔒 if locked after 12 hours)
```

### Locked Transaction Indicator (Refined)
- Show 🔒 icon replacing edit/delete buttons
- **Desktop:** Tooltip on hover: "Cannot edit after 12 hours"
- **Mobile:** Tap to reveal popover/toast with same message
- No row graying or countdown badges

### Add Transaction Modal (Refined)
```
┌─────────────────────────────────────────┐
│  ✕                   Add Transaction    │
├─────────────────────────────────────────┤
│  [ Income ]  [ Expense ]    ← Tabs      │
│                                         │
│  Amount          ₹ [___________]        │
│                  (Live Indian format)   │
│                                         │
│  Category        [Visual Emoji Grid]    │
│  ┌────────────────────────────────────┐ │
│  │ 🍔 🛒 ⛽ 💊 🎬 🏠 👔 ✈️ 📚 💼 │ │
│  │ 💰 🎁 📱 💵 ...                    │ │
│  └────────────────────────────────────┘ │
│                                         │
│  Description     [_______________]      │
│  Date            [📅 Pick date...]      │
│  Division        ○ Personal ○ Office    │
│                                         │
│           [ Cancel ]  [ Save ]          │
└─────────────────────────────────────────┘
```

### Filter Panel
```
┌─────────────────────────────────────────┐
│  🔍 [Search transactions...]            │
│                                         │
│  Division:  [All ▼]                     │
│  Category:  [All Categories ▼]          │
│  Date:      [📅 Start] → [📅 End]       │
│                                         │
│  [ Reset Filters ]                      │
└─────────────────────────────────────────┘
```

### Period Selector (Segmented Control)
```
┌──────────────────────────────────┐
│  [ Week ]  [▓Month▓]  [ Year ]   │
└──────────────────────────────────┘

- Placed in dashboard header
- Affects everything: summary cards, charts, recent transactions
- Active segment: solid accent background
- Inactive: transparent/ghost
```

### Delete Confirmation (Refined)
- **Immediate delete** (soft delete)
- Toast notification: "Transaction deleted" with **Undo** button
- Undo available for ~5 seconds
- No modal confirmation dialog

---

## 11. Page Layouts

### Login/Register Page
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│            ░░░ Gradient Background ░░░                  │
│                                                         │
│         ┌───────────────────────────────┐              │
│         │   💰 Money Manager            │              │
│         │                               │  ← Glass     │
│         │   Email    [______________]   │     Card     │
│         │   Password [______________]   │              │
│         │                               │              │
│         │       [ Login ]               │              │
│         │                               │              │
│         │   Don't have account? Sign up │              │
│         └───────────────────────────────┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Dashboard Layout (Refined)
```
┌────────────────────────────────────────────────────────────────┐
│  [Sidebar]                                                     │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐│
│  │ 💰 Logo  │  │ Header: Dashboard    [Week|Month|Year] 🌙 👤 ││
│  │          │  ├──────────────────────────────────────────────┤│
│  │[Personal]│  │                                              ││
│  │[Office  ]│  │  [4 Summary Cards: Balance, Expense,         ││
│  │          │  │   Budget Status, Savings Rate]               ││
│  │ 🏠 Dash  │  │                                              ││
│  │ 📋 Trans │  │  Quick Add Widget  +  Recent Transactions    ││
│  │          │  │  [+ Add]              (last 5-7 entries)     ││
│  │ ▼ Manage │  │                                              ││
│  │  🏷️ Cat  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐        ││
│  │  💰 Budg │  │  │Bar Chart│ │Donut    │ │Line     │        ││
│  │  🏦 Acct │  │  │Inc/Exp  │ │Category │ │Trend    │        ││
│  │  🎯 Goal │  │  └─────────┘ └─────────┘ └─────────┘        ││
│  │          │  │                                              ││
│  │ ───────  │  │  ┌──────────────────────────────────────┐   ││
│  │ ⚙️ Set   │  │  │  💡 Insight Card (full width)        │   ││
│  │ 🚪 Log   │  │  │  "You spent 20% more on Food..."     │   ││
│  └──────────┘  │  └──────────────────────────────────────┘   ││
│                └──────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘

Section Order: Summary Cards → Recent Transactions → Charts → Insight
```

### First-Time User Dashboard (Refined)
```
┌──────────────────────────────────────────────────────────┐
│  [Sidebar]  │  Header                                    │
│             ├────────────────────────────────────────────┤
│             │                                             │
│             │    ┌────────────────────────────────────┐  │
│             │    │                                    │  │
│             │    │         💰                         │  │
│             │    │                                    │  │
│             │    │    Welcome to Money Manager!       │  │
│             │    │                                    │  │
│             │    │    Start tracking your finances    │  │
│             │    │    by adding your first            │  │
│             │    │    transaction.                    │  │
│             │    │                                    │  │
│             │    │    [+ Add Your First Transaction]  │  │
│             │    │                                    │  │
│             │    └────────────────────────────────────┘  │
│             │                                             │
└─────────────┴────────────────────────────────────────────┘

- Full-screen onboarding card with single CTA
- Shown until first transaction is added
```

### Transactions Page (Refined)
```
┌──────────────────────────────────────────────────────────┐
│  [Sidebar]  │  Header: Transactions    [+ Add Transaction]│
│             ├────────────────────────────────────────────┤
│             │                                             │
│             │  ┌──────────────────────────────────────┐  │
│             │  │  Filter Panel (collapsible)          │  │
│             │  │  Search | Division | Category | Date │  │
│             │  └──────────────────────────────────────┘  │
│             │                                             │
│             │  ┌──────────────────────────────────────┐  │
│             │  │  Desktop: shadcn/ui Table            │  │
│             │  │  Mobile: shadcn/ui Card list         │  │
│             │  │  • Sortable columns                  │  │
│             │  │  • Row actions (edit/delete)         │  │
│             │  │  • Pagination                        │  │
│             │  └──────────────────────────────────────┘  │
│             │                                             │
│             │  < 1  2  3 ... 10 >                        │
└─────────────┴────────────────────────────────────────────┘

Hybrid Layout:
- Desktop: Data table (rows/columns, sortable)
- Mobile: Card-based list (touch-friendly)
```

### Goal Progress Display (Refined)
```
┌────────────────────────────────────────────────┐
│  🎯 Emergency Fund                             │
│                                                │
│  ₹15,000 / ₹50,000                            │
│  [████████░░░░░░░░░░░░░░░░░░░░░░] 30%          │
│                                                │
│  📅 45 days remaining                          │
│                                                │
│  [+ Add Amount]                                │
└────────────────────────────────────────────────┘

- Rich cards with progress bar, saved vs target, days remaining
- Dashboard shows small summary widget for primary goal
```

---

## 12. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Sidebar hidden (hamburger menu), stacked cards |
| Tablet | 640-1024px | Collapsed sidebar, 2-column grid |
| Desktop | 1024-1280px | Full sidebar, 3-column grid |
| Large | > 1280px | Wider content area, spacious layout |

### Mobile Adaptations (Refined)
- **Sidebar:** Hamburger menu → full-height slide-out drawer
- Summary cards stack vertically (1 column)
- Charts take full width
- **Transaction table becomes card list** (hybrid layout)
- Filter panel collapsed by default
- Division toggle remains in drawer sidebar

---

## 13. Loading States (Refined)

### Skeleton Loaders
- **Shape-matched skeletons** that mirror actual component shapes
- Subtle **shimmer effect** (gradient animation)
- Shimmer: slow, low-contrast, calm (especially in dark mode)

### Skeleton Colors
```css
/* Dark Mode */
--skeleton-base: rgba(255, 255, 255, 0.05);
--skeleton-highlight: rgba(255, 255, 255, 0.1);

/* Shimmer animation */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}
```

### Button Loading
- Spinner icon + "Loading..." text
- Button disabled during loading

---

## 14. Notifications (Toasts)

### Library: **Sonner**

### Toast Types
| Type | Color | Icon | Example |
|------|-------|------|---------|
| Success | Green | ✓ | "Transaction added successfully" |
| Error | Red | ✕ | "Save failed. Check connection and retry." |
| Warning | Amber | ⚠ | "You've used 80% of your Food budget" |
| Info | Blue | ℹ | "Tip: You can filter by date range" |

### Delete with Undo (Refined)
```
┌────────────────────────────────────────┐
│  ✓ Transaction deleted     [Undo]     │
└────────────────────────────────────────┘

- Immediate delete (soft delete)
- Undo available for ~5 seconds
- Toast auto-dismisses after timeout
```

### Position: **Bottom-right**
### Duration: **4 seconds** (auto-dismiss)
### Behavior: Swipe to dismiss on mobile

---

## 15. Empty States

### No Transactions (First-Time User)
- Full-screen onboarding card (see Dashboard Layout)
- Single CTA: "Add Your First Transaction"

### No Search Results
```
┌────────────────────────────────────┐
│                                    │
│         🔍                         │
│                                    │
│    No transactions found           │
│                                    │
│    Try adjusting your filters      │
│    or search terms.                │
│                                    │
│    [Reset Filters]                 │
│                                    │
└────────────────────────────────────┘
```

---

## 16. Error States (Refined)

### Form Validation
- Error message below field (red text)
- Input border turns red
- Shake animation on submit with errors

### API Errors
- Toast notification with **helpful, action-oriented** message
- Example: "Save failed. Check your connection and retry."
- Retry button where applicable
- Fallback UI for component failures

### Error Message Tone
- **Helpful/Action-oriented** (not formal or overly casual)
- Professional, clear, guides user on next steps

---

## 17. Accessibility

### Focus Indicators (Refined)
```css
/* Keyboard focus ring */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Checklist
- [x] All interactive elements are keyboard accessible
- [x] Focus states: 2px solid accent ring via `:focus-visible`
- [x] ARIA labels on icon-only buttons
- [x] Semantic HTML (nav, main, article, section)
- [x] Color contrast ratio ≥ 4.5:1 for text
- [x] Form inputs have associated labels
- [x] Modals trap focus and close on Escape
- [x] Error messages are announced to screen readers

---

## 18. UX Decision Summary (24 Frozen Decisions)

| # | Area | Decision |
|---|------|----------|
| 1 | Dashboard | Includes Recent Transactions (last 5-7) |
| 2 | Actions | Quick Add widget on Dashboard + Header button (no FAB) |
| 3 | Transactions | 🔒 icon + tooltip for 12-hour lock |
| 4 | Division | Global Personal/Office workspace toggle |
| 5 | Division | Toggle placed in sidebar below logo |
| 6 | Dashboard | Order: Summary → Recent → Charts → Insight |
| 7 | Onboarding | Full-screen card with single CTA |
| 8 | Dashboard | Period selector in header, affects everything |
| 9 | Delete | Immediate + Toast with Undo (5s) |
| 10 | Charts | 3-column grid + Insight full-width |
| 11 | Forms | Visual emoji grid for categories |
| 12 | Budgets | Toast on threshold + persistent indicator |
| 13 | Navigation | Grouped sidebar (Manage section collapsible) |
| 14 | Transactions | Hybrid: Table (desktop), Cards (mobile) |
| 15 | Theme | Toggle in header (top-right) |
| 16 | Summary | Cards: Balance, Expense, Budget Status, Savings Rate |
| 17 | Mobile | Hamburger → slide-out drawer |
| 18 | Amount | Live Indian formatting (₹1,23,456) |
| 19 | Numbers | Count-up on first load only |
| 20 | Transfers | Single modal with all fields |
| 21 | Goals | Rich cards + Dashboard summary widget |
| 22 | Loading | Shape-matched skeleton + subtle shimmer |
| 23 | Errors | Helpful/Action-oriented tone |
| 24 | Focus | 2px solid accent via :focus-visible |
