# feat: Implement find_spending_outliers MCP tool and widget

## Problem/Goal

Implement the `find_spending_outliers` MCP tool and `spending-outliers` widget to identify categories with unusual spending patterns (both increases and decreases) compared to their trailing 4-period average. This enables ChatGPT to help users identify where spending is going well or poorly compared to historical patterns.

## Implementation Guidance

### 1. Create Service Function (`services/categories.ts`)

Add to existing `services/categories.ts` file:

- `findSpendingOutliers(periodType: "month" | "quarter", direction: "increase" | "decrease" | "both", thresholdPercent?: number)`: 
  - Read from `finance-data/generated_finance_data.json` via `loadFinanceData()` pattern
  - Default `thresholdPercent` to 20 if not provided
  - For each category:
    - Calculate current period spending (use `calculatePeriodSpending()` helper)
    - Calculate trailing 4-period average:
      - Get spending for last 4 periods (previous period, 2 periods ago, 3 periods ago, 4 periods ago)
      - Calculate average of these 4 periods
    - Calculate change: `currentPeriodSpending - trailingAverage`
    - Calculate percentage change: `((currentPeriodSpending - trailingAverage) / trailingAverage) * 100` (0 decimal places)
    - Determine direction: "increase" if current > average, "decrease" if current < average
    - Filter by `direction` parameter (if "increase", only include increases; if "decrease", only include decreases; if "both", include both)
    - Filter by `thresholdPercent`: only include if absolute percentage change >= threshold
    - Calculate spending trend comparison using `calculateTrendComparison()` for the current period
  - Return array of `SpendingOutlier` objects matching the interface in `PRODUCT_SPEC.md` (lines 360-373)
  - Sort by absolute percentage change (descending) to show most significant outliers first
  - Handle edge cases: missing data, zero spending, insufficient historical data

- Helper function `calculateTrailingAverage(categoryId: string, currentPeriod: string, periodType: "month" | "quarter", transactions: Transaction[])`:
  - Calculate spending for last 4 periods
  - Return average of these 4 periods

### 2. Register MCP Tool (`app/mcp/route.ts`)

Add tool registration following the pattern from `get_category_trends` tool (lines 182-220):

- Register `find_spending_outliers` tool with Zod schema:
  - `period` (optional enum: "month" | "quarter", default: "month")
  - `direction` (optional enum: "increase" | "decrease" | "both", default: "both")
  - `threshold_percent` (optional number): Minimum change percentage to be considered outlier (default: 20)
- Call `findSpendingOutliers()` service function
- Return `structuredContent` with array of spending outliers
- Register widget resource:
  - Fetch HTML from `/mcp-components/spending-outliers` using `getAppsSdkCompatibleHtml()`
  - Create `ContentWidget` object with `templateUri: "ui://widget/spending-outliers-template.html"`
  - Register resource with `server.registerResource()`
  - Add `widgetMeta()` to tool `_meta`

### 3. Create Widget Component (`app/mcp-components/spending-outliers/page.tsx`)

Create widget page following pattern from `app/mcp-components/category-trends/page.tsx`:

- Use `"use client"` directive
- Import `useWidgetProps` from `../hooks/use-widget-props`
- Define `SpendingOutliersProps` interface matching the tool output structure
- Use `useWidgetProps<SpendingOutliersProps>()` to read tool data
- Import and render display component from `app/components/spending-outliers.tsx`
- Pass props to display component

### 4. Create Display Component (`app/components/spending-outliers.tsx`)

Create display component following the standardized trend display pattern from `PRODUCT_SPEC.md` (lines 153-166):

- Accept props: array of `SpendingOutlier` objects
- Group outliers by direction (increases vs. decreases) for better organization
- For each outlier:
  - Display category name
  - Display current period spending vs. trailing 4-period average
  - Display change amount and percentage (0 decimal places, e.g., "+$500 (+25%)" or "-$200 (-15%)")
  - Render standardized trend bar chart with 4 bars:
    1. Current period (primary bar, highlighted)
    2. Last period
    3. Same period last quarter
    4. Same period last year
  - Add triangle/arrow indicators (▲ for increases, ▼ for decreases) next to each comparison bar
  - Display percentage change next to arrow (0 decimal places)
  - Color coding: Green for decreases in spending, red for increases
- Use system fonts and system colors (OpenAI design guidelines)
- Style following existing widget patterns
- Show empty state if no outliers found

### 5. Data Models

Add TypeScript interface to `services/categories.ts`:

- `SpendingOutlier` (from `PRODUCT_SPEC.md` lines 360-373)

Note: Reuse `TrendComparison` interface from `services/categories.ts` for the `spendingTrend` field.

## Acceptance Criteria

- `find_spending_outliers` tool is registered in `app/mcp/route.ts` with correct Zod schema
- Tool accepts optional `period`, `direction`, and `threshold_percent` parameters (defaults to "month", "both", and 20)
- Service function `findSpendingOutliers()` correctly calculates current period spending for each category
- Service function correctly calculates trailing 4-period average for each category
- Service function correctly calculates percentage change (0 decimal places) and direction
- Service function correctly filters by `direction` parameter (increase/decrease/both)
- Service function correctly filters by `threshold_percent` (only includes outliers above threshold)
- Service function calculates accurate spending trend comparison using `calculateTrendComparison()`
- Outliers are sorted by absolute percentage change (descending)
- Widget component renders in ChatGPT interface via MCP resource
- Display component groups outliers by direction (increases vs. decreases)
- Display component shows current period spending vs. trailing average for each outlier
- Display component shows change amount and percentage correctly
- Display component shows standardized 4-bar trend chart for each outlier
- Triangle/arrow indicators display correctly with percentage changes
- Color coding (green for decreases, red for increases) is applied correctly
- Component follows OpenAI design guidelines (system fonts, system colors)
- Handles edge cases: missing data, zero spending, insufficient historical data, no outliers found
- Works for both "month" and "quarter" period types
- Works correctly for all direction filters (increase, decrease, both)

