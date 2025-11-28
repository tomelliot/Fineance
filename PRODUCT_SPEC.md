# Product Spec: Financial Trend Tracker (MCP Server)

## Product Vision

Help users understand their spending patterns and trends. This is an MCP server that provides tools and UX widgets to ChatGPT for personal financial planning.

---

## Architecture Overview

This is an **MCP server** that exposes:

- **Tools**: Functions ChatGPT can call to fetch financial data and perform actions
- **Widgets**: React components that render inside ChatGPT conversations to display financial insights

**Data Flow**:

1. User asks ChatGPT a financial question
2. ChatGPT calls an MCP tool (e.g., `get_category_trends`)
3. Tool returns `structuredContent` with data
4. ChatGPT displays a widget component that renders the data
5. User can interact with the widget (which may call additional tools)

---

## MCP Tools

All tools are defined in `app/mcp/route.ts` using snake_case naming.

### 1. Dashboard Tools

#### `get_monthly_snapshot`

- **Purpose**: Get current month financial overview with trend comparisons
- **Input Schema**:
  - `month` (optional): YYYY-MM format, defaults to current month
- **Returns**:
  - Income vs. spending (month-to-date)
  - Money left to spend this month
  - Largest spending category
  - **Trend comparison** (required):
    - Current month spending
    - Last month spending
    - Same month last quarter spending
    - Same month last year spending
    - Percentage changes for each comparison
- **Widget**: `monthly-snapshot`

---

### 2. Category Trend Analysis Tools

#### `get_category_trends`

- **Purpose**: Get spending trends for one or more categories with standardized comparisons
- **Input Schema**:
  - `category_id` (optional): Specific category, or returns all categories
  - `period`: "month" | "quarter" (default: "month")
- **Returns**:
  - For each category:
    - Current period spending
    - **Trend comparison** (required):
      - Last period spending
      - Same period last quarter spending
      - Same period last year spending
      - Percentage changes for each comparison (0 decimal places)
    - Target amount (if set)
- **Widget**: `category-trends`

#### `get_category_vs_target`

- **Purpose**: Show category spending against target line over time
- **Input Schema**:
  - `category_id`: string (required)
  - `months`: number (default: 12)
- **Returns**:
  - Monthly spending data for the category
  - Target line data (monthly target amount)
  - Over/under target status for each month
  - Current period trend comparison (last month, same month last quarter, same month last year)
- **Widget**: `category-vs-target`

#### `set_category_target`

- **Purpose**: Set spending target/budget for a category
- **Input Schema**:
  - `category_id`: string (required)
  - `target_amount`: number (monthly target)
- **Returns**: Updated category with target and status (over/under target)

---

### 3. Outlier Detection Tools

#### `find_spending_outliers`

- **Purpose**: Find categories with unusual spending patterns (both increases and decreases)
- **Input Schema**:
  - `period`: "month" | "quarter" (default: "month")
  - `direction`: "increase" | "decrease" | "both" (default: "both")
  - `threshold_percent` (optional): Minimum change percentage to be considered outlier (default: 20)
- **Returns**:
  - List of outlier categories with:
    - Category ID and name
    - Current period spending
    - Average of trailing 4 periods (month or quarter)
    - Change amount and percentage (0 decimal places)
    - Direction: "increase" | "decrease"
    - Trend comparison data (last period, same period last quarter, same period last year)
- **Widget**: `spending-outliers`

---

### 4. Overall Spending Trend Tools

#### `get_total_spending_trend`

- **Purpose**: Get overall spending trend with standardized comparisons
- **Input Schema**:
  - `period`: "month" | "quarter" (default: "month")
- **Returns**:
  - Current period total spending
  - **Trend comparison** (required):
    - Last period spending
    - Same period last quarter spending
    - Same period last year spending
    - Percentage changes for each comparison (0 decimal places)
  - Income comparison (if available)
- **Widget**: `total-spending-trend`

#### `get_income_vs_spending_trend`

- **Purpose**: Get income vs. spending trend with standardized comparisons
- **Input Schema**:
  - `period`: "month" | "quarter" (default: "month")
  - `projection_months` (optional): Number of months to project (default: 3)
- **Returns**:
  - Current period income and spending
  - **Trend comparison** (required):
    - Last period income and spending
    - Same period last quarter income and spending
    - Same period last year income and spending
    - Percentage changes for each comparison (0 decimal places)
  - Projected values (dotted line) based on current trends
- **Widget**: `income-spending-trend`

---

## MCP Widget Components

All widgets are React components in `app/mcp-components/[widget-name]/page.tsx` that follow OpenAI design guidelines.

### Standardized Trend Display Pattern

All widgets that display spending trends follow this standardized UX pattern:

- **Simple bar chart** showing 4 bars:
  1. Current period (primary bar, highlighted)
  2. Last period
  3. Same period last quarter
  4. Same period last year
- **Triangle/arrow indicators** next to each comparison bar:
  - ▲ (up arrow) for increases
  - ▼ (down arrow) for decreases
  - Percentage change displayed next to arrow (0 decimal places, e.g., "+15%" or "-8%")
- **Color coding**: Green for decreases in spending, red for increases (or vice versa based on context)

### 1. `monthly-snapshot`

- **Tool**: `get_monthly_snapshot`
- **Purpose**: Current month at-a-glance with trend comparison
- **Displays**:
  - Income vs. Spending (month-to-date)
  - Money left to spend this month
  - Largest spending category
  - **Standardized trend bar chart**: Current month vs. last month, same month last quarter, same month last year
  - Triangle/arrow indicators with percentage changes (0 decimal places)
- **Component Path**: `app/mcp-components/monthly-snapshot/page.tsx`
- **Display Component**: `app/components/monthly-snapshot.tsx`

### 2. `category-trends`

- **Tool**: `get_category_trends`
- **Purpose**: Category spending trends with standardized comparisons
- **Displays**:
  - For each category:
    - Category name and current period total (large, primary number)
    - **Standardized trend bar chart**: Current period vs. last period, same period last quarter, same period last year
    - Triangle/arrow indicators with percentage changes (0 decimal places)
    - Target amount indicator (if set)
- **Component Path**: `app/mcp-components/category-trends/page.tsx`
- **Display Component**: `app/components/category-trends.tsx`

### 3. `category-vs-target`

- **Tool**: `get_category_vs_target`
- **Purpose**: Show category spending against target line over time
- **Displays**:
  - Line chart showing:
    - Monthly spending (solid line)
    - Target line (dashed line)
  - Over/under target status for each month
  - **Standardized trend bar chart** for current period: Current vs. last period, same period last quarter, same period last year
  - Triangle/arrow indicators with percentage changes (0 decimal places)
- **Component Path**: `app/mcp-components/category-vs-target/page.tsx`
- **Display Component**: `app/components/category-vs-target.tsx`

### 4. `spending-outliers`

- **Tool**: `find_spending_outliers`
- **Purpose**: Display categories with unusual spending patterns
- **Displays**:
  - List of outlier categories grouped by direction (increases vs. decreases)
  - For each outlier:
    - Category name
    - Current period spending vs. trailing 4-period average
    - Change amount and percentage (0 decimal places)
    - **Standardized trend bar chart**: Current period vs. last period, same period last quarter, same period last year
    - Triangle/arrow indicators with percentage changes
- **Component Path**: `app/mcp-components/spending-outliers/page.tsx`
- **Display Component**: `app/components/spending-outliers.tsx`

### 5. `total-spending-trend`

- **Tool**: `get_total_spending_trend`
- **Purpose**: Overall spending trend visualization
- **Displays**:
  - Total spending for current period (large, primary number)
  - **Standardized trend bar chart**: Current period vs. last period, same period last quarter, same period last year
  - Triangle/arrow indicators with percentage changes (0 decimal places)
  - Income comparison (if available)
- **Component Path**: `app/mcp-components/total-spending-trend/page.tsx`
- **Display Component**: `app/components/total-spending-trend.tsx`

### 6. `income-spending-trend`

- **Tool**: `get_income_vs_spending_trend`
- **Purpose**: Income vs. spending trend with projections
- **Displays**:
  - **Standardized trend bar chart** for income: Current period vs. last period, same period last quarter, same period last year
  - **Standardized trend bar chart** for spending: Current period vs. last period, same period last quarter, same period last year
  - Triangle/arrow indicators with percentage changes (0 decimal places)
  - Projected values (dotted line) based on current trends for next 3 months
- **Component Path**: `app/mcp-components/income-spending-trend/page.tsx`
- **Display Component**: `app/components/income-spending-trend.tsx`

---

## Service Layer Functions

All service functions are in `services/finance-data.ts` (or new service files as needed).

### Existing Services

- `getCategorySummaries(months: number)`: Get category totals for a time period
- `getMonthlyExpensesByCategory()`: Get monthly expenses by category for last 12 months

### New Services Needed

#### `services/trends.ts`

- `calculateTrendComparison(currentPeriod: string, periodType: "month" | "quarter")`: Calculate standardized trend comparison (last period, same period last quarter, same period last year)
- `getTotalSpendingTrend(period: string, periodType: "month" | "quarter")`: Get overall spending with trend comparison
- `getIncomeVsSpendingTrend(period: string, periodType: "month" | "quarter", projectionMonths?: number)`: Get income vs spending with trend comparison and projections
- `projectIncomeVsSpending(historicalMonths, projectionMonths)`: Project future spending based on trends

#### `services/categories.ts`

- `getCategoryTrends(categoryId?: string, periodType: "month" | "quarter")`: Get category trends with standardized comparison (last period, same period last quarter, same period last year)
- `getCategoryVsTarget(categoryId: string, months: number)`: Get category spending vs target over time with current period trend comparison
- `setCategoryTarget(categoryId: string, targetAmount: number)`: Save category budget
- `findSpendingOutliers(periodType: "month" | "quarter", direction: "increase" | "decrease" | "both", thresholdPercent?: number)`: Find categories that are outliers compared to trailing 4 periods

#### `services/snapshots.ts`

- `getMonthlySnapshot(month?: string)`: Get monthly snapshot with standardized trend comparison (last month, same month last quarter, same month last year)

---

## Data Models

### Standardized Trend Comparison

All tools that return spending data include this standardized comparison structure:

```typescript
interface TrendComparison {
  current: number;
  lastPeriod: number;
  samePeriodLastQuarter: number;
  samePeriodLastYear: number;
  changes: {
    vsLastPeriod: {
      amount: number;
      percent: number; // 0 decimal places (e.g., 15, -8)
      direction: "increase" | "decrease";
    };
    vsLastQuarter: {
      amount: number;
      percent: number; // 0 decimal places
      direction: "increase" | "decrease";
    };
    vsLastYear: {
      amount: number;
      percent: number; // 0 decimal places
      direction: "increase" | "decrease";
    };
  };
}
```

### Monthly Snapshot

```typescript
interface MonthlySnapshot {
  month: string; // YYYY-MM
  income: number;
  spending: number;
  remaining: number;
  largestCategory: {
    categoryId: string;
    categoryName: string;
    total: number;
  };
  spendingTrend: TrendComparison; // Required standardized comparison
}
```

### Category Trend

```typescript
interface CategoryTrend {
  categoryId: string;
  categoryName: string;
  period: string; // YYYY-MM or YYYY-Q format
  spendingTrend: TrendComparison; // Required standardized comparison
  target?: number;
  status?: "over" | "under" | "on_target";
}
```

### Category vs Target

```typescript
interface CategoryVsTarget {
  categoryId: string;
  categoryName: string;
  monthlyData: Array<{
    month: string; // YYYY-MM
    spending: number;
    target: number;
    status: "over" | "under" | "on_target";
  }>;
  currentPeriodTrend: TrendComparison; // Required standardized comparison
}
```

### Spending Outlier

```typescript
interface SpendingOutlier {
  categoryId: string;
  categoryName: string;
  period: string; // YYYY-MM or YYYY-Q format
  currentPeriodSpending: number;
  trailingAverage: number; // Average of trailing 4 periods
  change: {
    amount: number;
    percent: number; // 0 decimal places
    direction: "increase" | "decrease";
  };
  spendingTrend: TrendComparison; // Required standardized comparison
}
```

### Total Spending Trend

```typescript
interface TotalSpendingTrend {
  period: string; // YYYY-MM or YYYY-Q format
  spendingTrend: TrendComparison; // Required standardized comparison
  income?: number; // Optional income comparison
}
```

---

## Implementation Notes

### Tool Registration Pattern

Each tool in `app/mcp/route.ts` follows this pattern:

1. Register tool with Zod schema
2. Return `structuredContent` with widget metadata
3. Register corresponding resource with `templateUri` pointing to widget HTML

### Widget Component Pattern

Each widget in `app/mcp-components/[widget-name]/page.tsx`:

1. Uses `useWidgetProps<T>()` to read tool data from `structuredContent`
2. Extracts display logic to `app/components/[component-name].tsx`
3. Follows OpenAI design guidelines (system fonts, system colors)
4. Can call additional tools via `useCallTool()` hook

### Service Layer Pattern

Services in `services/`:

- Export async functions that handle data processing
- Read from `finance-data/generated_finance_data.json`
- Return typed data structures
- Handle date filtering and calculations

---

## Success Metrics (for ChatGPT Integration)

- ChatGPT can show spending trends with standardized comparisons (last period, same period last quarter, same period last year)
- ChatGPT can identify spending outliers (both increases and decreases) using `find_spending_outliers`
- ChatGPT can show category spending against targets using `get_category_vs_target`
- All trend widgets display standardized bar charts with triangle/arrow indicators and percentage changes (0 decimal places)
- Users can set category targets through ChatGPT conversation
- Widgets render correctly in ChatGPT interface
- Tools return accurate financial calculations with consistent trend comparisons

---

## What Makes This Different (MCP Context)

- **Trend-focused**: Every spending metric includes standardized comparisons (last period, same period last quarter, same period last year)
- **Outlier detection**: Automatically identifies where spending is going well or poorly compared to historical patterns
- **Standardized UX**: All trend displays use consistent bar charts with triangle/arrow indicators and percentage changes
- **Target tracking**: Visual comparison of actual spending vs. targets over time
- **Conversational**: Users interact through ChatGPT, not a standalone app
- **Tool-based**: ChatGPT intelligently calls tools based on user questions
- **Widget-rich**: Rich visualizations render inline in conversations
- **Forward-looking**: 3-month projections help users course-correct
- **Actionable**: Tools enable category target management through chat
