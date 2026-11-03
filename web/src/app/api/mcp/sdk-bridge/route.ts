import { PayPalMCPToolkit } from "@paypal/agent-toolkit/mcp";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const accessToken =
    process.env.PAYPAL_ACCESS_TOKEN || "sandbox-judge-demo-token";

  const toolkit = new PayPalMCPToolkit({
    accessToken,
    configuration: {
      actions: {
        orders: { create: true, get: true, capture: true },
        invoices: { create: true, list: true, get: true },
        shipment: { create: true, get: true },
        transactions: { list: true },
        reporting: { insights: true },
      },
      context: {
        sandbox: true,
      },
    },
  });

  const sdkTools = toolkit.getTools().map((tool) => ({
    method: tool.method,
    name: tool.name,
    description: tool.description,
  }));

  return NextResponse.json({
    package: "@paypal/agent-toolkit/mcp",
    sandbox: true,
    sdk_tool_count: sdkTools.length,
    tools: sdkTools,
  });
}
