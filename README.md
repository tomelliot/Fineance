# 4-Fineance

Plan your finances with ChatGPT.

## Overview

This is a Next.js ChatGPT Apps SDK application that serves both as an MCP server and a React component host for personal financial planning.

This is a prototype project. Do not maintain backwards compatibility. Focus on keeping things simple and proving functionality.

## Features

- **Category Trends Analysis** - Analyze spending trends for categories with standardized historical comparisons (last period, same period last quarter, same period last year). Supports both monthly and quarterly period analysis.

- **Monthly Financial Snapshot** - Get a comprehensive monthly financial overview showing income vs. spending, remaining budget, largest spending category, and trend comparisons. Includes a carousel view of the last 12 months for historical context.

- **Spending Outliers Detection** - Identify categories with unusual spending patterns (increases or decreases) compared to their trailing 4-period average. Configurable by direction (increase/decrease/both) and customizable threshold percentage.

- **Interactive ChatGPT Widgets** - All features are exposed as interactive widgets within ChatGPT conversations, providing rich visualizations and data analysis directly in the chat interface.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Project Structure

See `.cursor/rules/project-structure.mdc` for detailed project structure documentation.
