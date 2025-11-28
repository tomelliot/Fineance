import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { getCategoryTrends } from "@/services/categories";

export const revalidate = 0;

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  console.log("getAppsSdkCompatibleHtml", baseUrl, path);
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = createMcpHandler(async (server) => {
  // Register health_check tool
  server.registerTool(
    "health_check",
    {
      title: "Health Check",
      description: "Check the health status of the MCP server",
      inputSchema: z.object({
        message: z
          .string()
          .optional()
          .describe("Optional message to include in response"),
      }),
    },
    async ({ message }) => {
      console.log(`[TOOL] health_check`, { message });
      return {
        content: [
          {
            type: "text",
            text: `MCP server is healthy${message ? `: ${message}` : ""}`,
          },
        ],
      };
    }
  );

  // Health Widget
  const healthWidgetHtml = await getAppsSdkCompatibleHtml(
    baseURL,
    "/mcp-components/health"
  );

  const healthWidget: ContentWidget = {
    id: "health",
    title: "Health Status",
    templateUri: "ui://widget/health-template.html",
    invoking: "Checking health...",
    invoked: "Health check complete",
    html: healthWidgetHtml,
    description: "Display health status of the MCP server",
    widgetDomain: baseURL,
  };

  server.registerResource(
    "health-widget",
    healthWidget.templateUri,
    {
      title: healthWidget.title,
      description: healthWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": healthWidget.description,
        "openai/widgetPrefersBorder": false,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${healthWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": healthWidget.description,
            "openai/widgetPrefersBorder": false,
            "openai/widgetDomain": healthWidget.widgetDomain,
          },
        },
      ],
    })
  );

  // Register show_health tool
  server.registerTool(
    "show_health",
    {
      title: "Show Health Status",
      description: "Display health status in a widget",
      inputSchema: z.object({
        status: z.string().default("healthy").describe("Health status message"),
      }),
      _meta: widgetMeta(healthWidget),
    },
    async ({ status }) => {
      console.log(`[TOOL] show_health`, { status });
      return {
        content: [
          {
            type: "text",
            text: `Health status: ${status}`,
          },
        ],
        structuredContent: {
          status,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(healthWidget),
      };
    }
  );

  // Category Trends Widget
  const categoryTrendsWidgetHtml = await getAppsSdkCompatibleHtml(
    baseURL,
    "/mcp-components/category-trends"
  );

  const categoryTrendsWidget: ContentWidget = {
    id: "category-trends",
    title: "Category Trends",
    templateUri: "ui://widget/category-trends-template.html",
    invoking: "Analyzing category spending trends...",
    invoked: "Category trends analysis complete",
    html: categoryTrendsWidgetHtml,
    description:
      "Display spending trends for categories with historical comparisons",
    widgetDomain: baseURL,
  };

  server.registerResource(
    "category-trends-widget",
    categoryTrendsWidget.templateUri,
    {
      title: categoryTrendsWidget.title,
      description: categoryTrendsWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": categoryTrendsWidget.description,
        "openai/widgetPrefersBorder": false,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${categoryTrendsWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": categoryTrendsWidget.description,
            "openai/widgetPrefersBorder": false,
            "openai/widgetDomain": categoryTrendsWidget.widgetDomain,
          },
        },
      ],
    })
  );

  // Register get_category_trends tool
  server.registerTool(
    "get_category_trends",
    {
      title: "Get Category Trends",
      description:
        "Get spending trends for one or more categories with standardized comparisons (last period, same period last quarter, same period last year)",
      inputSchema: z.object({
        category_id: z
          .string()
          .optional()
          .describe("Specific category ID, or omit to return all categories"),
        period: z
          .enum(["month", "quarter"])
          .default("month")
          .optional()
          .describe("Period type: month or quarter (default: month)"),
      }),
      _meta: widgetMeta(categoryTrendsWidget),
    },
    async ({ category_id, period = "month" }) => {
      console.log(`[TOOL] get_category_trends`, { category_id, period });
      const trends = getCategoryTrends(category_id, period);
      return {
        content: [
          {
            type: "text",
            text: `Category trends: ${trends.length} category${
              trends.length !== 1 ? "ies" : ""
            } found`,
          },
        ],
        structuredContent: {
          trends,
        },
        _meta: widgetMeta(categoryTrendsWidget),
      };
    }
  );
});

// Wrap handler with error logging
const wrappedHandler = async (req: Request) => {
  try {
    console.log(`[MCP] Request received:`, {
      method: req.method,
      url: req.url,
    });
    const response = await handler(req);
    console.log(`[MCP] Request completed:`, {
      method: req.method,
      status: response.status,
    });
    return response;
  } catch (error) {
    console.error(`[MCP] Unhandled error in handler:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      method: req.method,
      url: req.url,
    });
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET = wrappedHandler;
export const POST = wrappedHandler;
