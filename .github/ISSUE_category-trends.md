# feat: Implement category-trends MCP tool and widget

## Problem/Goal

Implement the `get_category_trends` MCP tool and `category-trends` widget to display spending trends for one or more categories with standardized comparisons (last period, same period last quarter, same period last year). This enables ChatGPT to show users how their category spending compares to historical periods.

## Implementation Guidance

### 1. Create Service Function (`services/categories.ts`)

Create a new service file `services/categories.ts` with:

- `getCategoryTrends(categoryId?: string, periodType: "month" | "quarter")`: 
  - Read from `finance-data/generated_finance_data.json` via `loadFinanceData()` pattern (see `services/finance-data.ts`)
  - Filter transactions by category (if `categoryId` provided) or return all categories
  - Calculate spending for current period based on `periodType` (month or quarter)
  - Calculate trend comparison:
    - Last period spending (previous month/quarter)
    - Same period last quarter spending (3 months/quarters ago)
    - Same period last year spending (12 months/quarters ago)
  - Calculate percentage changes (0 decimal places, e.g., 15, -8) and direction ("increase" | "decrease")
  - Return array of `CategoryTrend` objects matching the interface in `PRODUCT_SPEC.md` (lines 332-339)
  - Handle edge cases: missing data, zero spending, etc.

- Helper function `calculateTrendComparison(currentPeriod: string, periodType: "month" | "quarter", categoryId: string, transactions: Transaction[])`: 
  - Calculate the four period values (current, last period, same period last quarter, same period last year)
  - Calculate percentage changes with 0 decimal places
  - Return `TrendComparison` object matching interface in `PRODUCT_SPEC.md` (lines 287-309)

### 2. Register MCP Tool (`app/mcp/route.ts`)

Add tool registration following the pattern from `show_health` tool (lines 107-133):

- Register `get_category_trends` tool with Zod schema:
  - `category_id` (optional string): Specific category ID, or omit to return all categories
  - `period` (optional enum: "month" | "quarter", default: "month")
- Call `getCategoryTrends()` service function
- Return `structuredContent` with array of category trends
- Register widget resource:
  - Fetch HTML from `/mcp-components/category-trends` using `getAppsSdkCompatibleHtml()`
  - Create `ContentWidget` object with `templateUri: "ui://widget/category-trends-template.html"`
  - Register resource with `server.registerResource()`
  - Add `widgetMeta()` to tool `_meta`

### 3. Create Widget Component (`app/mcp-components/category-trends/page.tsx`)

Create widget page following pattern from `app/mcp-components/health/page.tsx`:

- Use `"use client"` directive
- Import `useWidgetProps` from `../hooks/use-widget-props`
- Define `CategoryTrendsProps` interface matching the tool output structure
- Use `useWidgetProps<CategoryTrendsProps>()` to read tool data
- Import and render display component from `app/components/category-trends.tsx`
- Pass props to display component

### 4. Create Display Component (`app/components/category-trends.tsx`)

Create display component following the standardized trend display pattern from `PRODUCT_SPEC.md` (lines 153-166):

- Accept props: array of `CategoryTrend` objects
- For each category:
  - Display category name and current period total (large, primary number)
  - Render standardized trend bar chart with 4 bars:
    1. Current period (primary bar, highlighted)
    2. Last period
    3. Same period last quarter
    4. Same period last year
  - Add triangle/arrow indicators (▲ for increases, ▼ for decreases) next to each comparison bar
  - Display percentage change next to arrow (0 decimal places, e.g., "+15%" or "-8%")
  - Color coding: Green for decreases in spending, red for increases
  - Display target amount indicator if `target` is set
- Use system fonts and system colors (OpenAI design guidelines)
- Style following existing widget patterns

### 5. Data Models

Define TypeScript interfaces in `services/categories.ts`:

- `TrendComparison` (from `PRODUCT_SPEC.md` lines 287-309)
- `CategoryTrend` (from `PRODUCT_SPEC.md` lines 332-339)

## Acceptance Criteria

- `get_category_trends` tool is registered in `app/mcp/route.ts` with correct Zod schema
- Tool accepts optional `category_id` and `period` parameters (defaults to all categories and "month")
- Service function `getCategoryTrends()` correctly calculates spending for current period
- Service function calculates accurate trend comparisons (last period, same period last quarter, same period last year)
- Percentage changes are calculated with 0 decimal places and correct direction
- Widget component renders in ChatGPT interface via MCP resource
- Display component shows standardized 4-bar trend chart for each category
- Triangle/arrow indicators display correctly with percentage changes
- Color coding (green for decreases, red for increases) is applied correctly
- Target amount indicator displays when category has a target set
- Component follows OpenAI design guidelines (system fonts, system colors)
- Handles edge cases: missing data, zero spending, single category, all categories
- Works for both "month" and "quarter" period types

