# feat: Implement get_monthly_snapshot MCP tool and widget

## Problem/Goal

Implement the `get_monthly_snapshot` MCP tool and `monthly-snapshot` widget to display current month financial overview with income vs. spending, money left to spend, largest spending category, and standardized trend comparisons (last month, same month last quarter, same month last year). This enables ChatGPT to show users an at-a-glance view of their current month financial status.

## Implementation Guidance

### 1. Create Service Function (`services/snapshots.ts`)

Create a new service file `services/snapshots.ts` with:

- `getMonthlySnapshot(month?: string)`: 
  - Read from `finance-data/generated_finance_data.json` via `loadFinanceData()` pattern (see `services/finance-data.ts`)
  - Default to current month (use `"2025-10-31"` as reference date like other services)
  - Calculate income for the month (sum of transactions with `type: "income"` and positive amounts)
  - Calculate spending for the month (sum of transactions with `amount < 0`, convert to positive)
  - Calculate remaining: `income - spending`
  - Find largest spending category (use `getCategorySummaries(1)` or calculate directly)
  - Calculate spending trend comparison using `calculateTrendComparison()` from `services/categories.ts`:
    - Pass empty string or "all" as categoryId to calculate total spending trend
    - Use "month" as periodType
  - Return `MonthlySnapshot` object matching the interface in `PRODUCT_SPEC.md` (lines 314-326)
  - Handle edge cases: missing data, zero income/spending, etc.

### 2. Register MCP Tool (`app/mcp/route.ts`)

Add tool registration following the pattern from `get_category_trends` tool (lines 182-220):

- Register `get_monthly_snapshot` tool with Zod schema:
  - `month` (optional string): YYYY-MM format, defaults to current month
- Call `getMonthlySnapshot()` service function
- Return `structuredContent` with monthly snapshot data
- Register widget resource:
  - Fetch HTML from `/mcp-components/monthly-snapshot` using `getAppsSdkCompatibleHtml()`
  - Create `ContentWidget` object with `templateUri: "ui://widget/monthly-snapshot-template.html"`
  - Register resource with `server.registerResource()`
  - Add `widgetMeta()` to tool `_meta`

### 3. Create Widget Component (`app/mcp-components/monthly-snapshot/page.tsx`)

Create widget page following pattern from `app/mcp-components/category-trends/page.tsx`:

- Use `"use client"` directive
- Import `useWidgetProps` from `../hooks/use-widget-props`
- Define `MonthlySnapshotProps` interface matching the tool output structure
- Use `useWidgetProps<MonthlySnapshotProps>()` to read tool data
- Import and render display component from `app/components/monthly-snapshot.tsx`
- Pass props to display component

### 4. Create Display Component (`app/components/monthly-snapshot.tsx`)

Create display component following the standardized trend display pattern from `PRODUCT_SPEC.md` (lines 153-166):

- Accept props: `MonthlySnapshot` object
- Display income vs. spending (month-to-date) with clear labels
- Display money left to spend this month (highlight if negative)
- Display largest spending category with amount
- Render standardized trend bar chart with 4 bars:
  1. Current month (primary bar, highlighted)
  2. Last month
  3. Same month last quarter
  4. Same month last year
- Add triangle/arrow indicators (▲ for increases, ▼ for decreases) next to each comparison bar
- Display percentage change next to arrow (0 decimal places, e.g., "+15%" or "-8%")
- Color coding: Green for decreases in spending, red for increases
- Use system fonts and system colors (OpenAI design guidelines)
- Style following existing widget patterns

### 5. Data Models

Define TypeScript interface in `services/snapshots.ts`:

- `MonthlySnapshot` (from `PRODUCT_SPEC.md` lines 314-326)

Note: Reuse `TrendComparison` interface from `services/categories.ts` for the `spendingTrend` field.

## Acceptance Criteria

- `get_monthly_snapshot` tool is registered in `app/mcp/route.ts` with correct Zod schema
- Tool accepts optional `month` parameter (defaults to current month in YYYY-MM format)
- Service function `getMonthlySnapshot()` correctly calculates income for the month
- Service function correctly calculates spending for the month
- Service function correctly calculates remaining (income - spending)
- Service function correctly identifies largest spending category
- Service function calculates accurate spending trend comparison using `calculateTrendComparison()` from `services/categories.ts`
- Widget component renders in ChatGPT interface via MCP resource
- Display component shows income vs. spending clearly
- Display component shows money left to spend (with visual indicator if negative)
- Display component shows largest spending category
- Display component shows standardized 4-bar trend chart for spending
- Triangle/arrow indicators display correctly with percentage changes
- Color coding (green for decreases, red for increases) is applied correctly
- Component follows OpenAI design guidelines (system fonts, system colors)
- Handles edge cases: missing data, zero income/spending, no transactions
- Works correctly for different months when `month` parameter is provided

