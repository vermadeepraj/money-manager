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

### Summary Card
```
┌────────────────────────────────────┐
│  📊 Total Income                   │
│                                    │
│  ₹1,45,000        ↑ 12.5%         │
│  [═══════ sparkline ═══════]       │
└────────────────────────────────────┘

- Glassmorphism background
- Icon + Label top-left
- Large amount (tabular-nums)
- Trend indicator (green ↑ or red ↓)
- Mini sparkline (last 7 days)
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
- Action icons (hidden if locked: show 🔒)
```

### Modal
```
┌─────────────────────────────────────────┐
│  ✕                   Add Transaction    │
├─────────────────────────────────────────┤
│  [ Income ]  [ Expense ]    ← Tabs      │
│                                         │
│  Amount          ₹ [___________]        │
│  Category        [Select... ▼]          │
│  Description     [_______________]      │
│  Date            [📅 Pick date...]      │
│  Division        ○ Personal ○ Office    │
│                                         │
│           [ Cancel ]  [ Save ]          │
└─────────────────────────────────────────┘

- Glassmorphism or solid dark card
- Close button top-left
- Tabs for Income/Expense
- Form with clear labels
- Primary action button (Save) is accent color
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

- Active segment: solid accent background
- Inactive: transparent/ghost
- Smooth transition between states
```

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

### Dashboard Layout
```
┌────────────────────────────────────────────────────────────────┐
│  [Sidebar]                                                     │
│  ┌──────┐  ┌──────────────────────────────────────────────────┐│
│  │ 🏠   │  │ Header: Money Manager    🔍 Search   🌙 ⚙️ 👤   ││
│  │ 📋   │  ├──────────────────────────────────────────────────┤│
│  │ 🏷️   │  │                                                  ││
│  │ 💰   │  │  [Summary Cards Row - 4 cards]                   ││
│  │ 🏦   │  │                                                  ││
│  │      │  │  [Period Selector: Week | Month | Year]          ││
│  │      │  │                                                  ││
│  │      │  │  ┌─────────────────┐  ┌─────────────────┐       ││
│  │      │  │  │  Bar Chart      │  │  Donut Chart    │       ││
│  │      │  │  │  Income/Expense │  │  Categories     │       ││
│  │      │  │  └─────────────────┘  └─────────────────┘       ││
│  │      │  │                                                  ││
│  │      │  │  ┌─────────────────┐  ┌─────────────────┐       ││
│  │      │  │  │  Line Chart     │  │  Insight Card   │       ││
│  │      │  │  │  Trend          │  │  "You spent..." │       ││
│  │      │  │  └─────────────────┘  └─────────────────┘       ││
│  └──────┘  └──────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

### Transactions Page
```
┌──────────────────────────────────────────────────────────┐
│  [Sidebar]  │  Header                                    │
│             ├────────────────────────────────────────────┤
│             │  Transactions            [+ Add Transaction]│
│             │                                             │
│             │  ┌──────────────────────────────────────┐  │
│             │  │  Filter Panel (collapsible)          │  │
│             │  │  Search | Division | Category | Date │  │
│             │  └──────────────────────────────────────┘  │
│             │                                             │
│             │  ┌──────────────────────────────────────┐  │
│             │  │  Transaction Table                   │  │
│             │  │  • Sortable columns                  │  │
│             │  │  • Row actions (edit/delete)         │  │
│             │  │  • Pagination                        │  │
│             │  └──────────────────────────────────────┘  │
│             │                                             │
│             │  < 1  2  3 ... 10 >                        │
└─────────────┴────────────────────────────────────────────┘
```

---

## 12. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Sidebar hidden, hamburger menu, stacked cards |
| Tablet | 640-1024px | Collapsed sidebar, 2-column grid |
| Desktop | 1024-1280px | Full sidebar, 3-column grid |
| Large | > 1280px | Wider content area, spacious layout |

### Mobile Adaptations
- Sidebar becomes slide-out drawer
- Summary cards stack vertically (1 column)
- Charts take full width
- Transaction table becomes card list
- Filter panel collapsed by default

---

## 13. Loading States

### Skeleton Loaders
- Summary cards: Pulsing rectangle placeholders
- Transaction list: Pulsing rows
- Charts: Pulsing chart area

### Skeleton Colors
```css
/* Dark Mode */
--skeleton-base: rgba(255, 255, 255, 0.05);
--skeleton-highlight: rgba(255, 255, 255, 0.1);

/* Pulse animation */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
| Error | Red | ✕ | "Failed to save. Please try again." |
| Warning | Amber | ⚠ | "You've used 80% of your Food budget" |
| Info | Blue | ℹ | "Tip: You can filter by date range" |

### Position: **Bottom-right**
### Duration: **4 seconds** (auto-dismiss)
### Behavior: Swipe to dismiss on mobile

---

## 15. Empty States

### No Transactions
```
┌────────────────────────────────────┐
│                                    │
│         📋                         │
│                                    │
│    No transactions yet             │
│                                    │
│    Start tracking your finances    │
│    by adding your first            │
│    transaction.                    │
│                                    │
│    [+ Add Transaction]             │
│                                    │
└────────────────────────────────────┘
```

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

## 16. Error States

### Form Validation
- Error message below field (red text)
- Input border turns red
- Shake animation on submit with errors

### API Errors
- Toast notification with error message
- Retry button where applicable
- Fallback UI for component failures

---

## 17. Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are clearly visible (accent color ring)
- [ ] ARIA labels on icon-only buttons
- [ ] Semantic HTML (nav, main, article, section)
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Form inputs have associated labels
- [ ] Modals trap focus and close on Escape
- [ ] Error messages are announced to screen readers
