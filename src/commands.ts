/**
 * Intricate Chat Commands — powerful SaaS control through chat
 * Each variant has specific commands that map to business actions
 */

import type { SaaS } from "./variants";

export type CommandType = "action" | "query" | "config" | "analytics" | "help";

export interface Command {
  pattern: RegExp;
  action: string;
  params: string[];
  description: string;
}

/**
 * LeadGen commands
 * Control: prospect list, qualification, scoring, campaigns
 */
export const LEADGEN_COMMANDS: Command[] = [
  { pattern: /^create lead (.+?)$/i, action: "create_lead", params: ["name"], description: "Create new prospect" },
  { pattern: /^qualify (.+?) as (.+?)$/i, action: "qualify_lead", params: ["name", "score"], description: "Score lead (hot/warm/cold)" },
  { pattern: /^add (.+?) to (.+?) campaign$/i, action: "add_to_campaign", params: ["prospect", "campaign"], description: "Start nurture sequence" },
  { pattern: /^send email to (.+?)$/i, action: "send_email", params: ["prospect"], description: "Send follow-up email" },
  { pattern: /^schedule call with (.+?) on (.+?) at (.+?)$/i, action: "schedule_call", params: ["prospect", "date", "time"], description: "Book call with lead" },
  { pattern: /^show hot leads$/i, action: "list_hot_leads", params: [], description: "Top prospects ready to sell" },
  { pattern: /^lead score for (.+?)$/i, action: "get_lead_score", params: ["name"], description: "Check prospect quality" },
];

/**
 * WhatsApp Omnichannel commands
 * Control: message routing, channel sync, team assignment, broadcast
 */
export const WHATSAPP_OMNICHANNEL_COMMANDS: Command[] = [
  { pattern: /^route (.+?) to (.+?)$/i, action: "route_message", params: ["customer", "team"], description: "Assign conversation to team" },
  { pattern: /^broadcast (.+?)$/i, action: "send_broadcast", params: ["message"], description: "Send to all subscribers" },
  { pattern: /^sync (.+?) contacts$/i, action: "sync_contacts", params: ["channel"], description: "Update contact from platform" },
  { pattern: /^merge (.+?) and (.+?)$/i, action: "merge_conversations", params: ["conv1", "conv2"], description: "Combine duplicate chats" },
  { pattern: /^template (.+?)$/i, action: "send_template", params: ["name"], description: "Send saved message template" },
  { pattern: /^show queue$/i, action: "view_queue", params: [], description: "Pending messages by channel" },
  { pattern: /^set (.+?) to auto-reply (.+?)$/i, action: "set_auto_reply", params: ["channel", "message"], description: "Configure automated response" },
];

/**
 * E-commerce SaaS commands
 * Control: products, inventory, orders, customers
 */
export const ECOMMERCE_COMMANDS: Command[] = [
  { pattern: /^add product (.+?) \$(.+?)$/i, action: "create_product", params: ["name", "price"], description: "Create new SKU" },
  { pattern: /^update (.+?) stock to (.+?)$/i, action: "set_inventory", params: ["product", "quantity"], description: "Adjust stock level" },
  { pattern: /^create order for (.+?) - (.+?)$/i, action: "create_order", params: ["customer", "items"], description: "Manual order entry" },
  { pattern: /^ship order (.+?)$/i, action: "ship_order", params: ["order_id"], description: "Generate shipping label" },
  { pattern: /^discount (.+?) by (.+?)%$/i, action: "apply_discount", params: ["product", "percent"], description: "Price reduction" },
  { pattern: /^show top sellers$/i, action: "analytics_top_products", params: [], description: "Best-performing SKUs" },
  { pattern: /^refund order (.+?)$/i, action: "refund_order", params: ["order_id"], description: "Process return" },
];

/**
 * Logistics SaaS commands
 * Control: shipments, tracking, routes, driver assignment
 */
export const LOGISTICS_COMMANDS: Command[] = [
  { pattern: /^create shipment from (.+?) to (.+?)$/i, action: "create_shipment", params: ["origin", "destination"], description: "New delivery job" },
  { pattern: /^track (.+?)$/i, action: "track_shipment", params: ["tracking_id"], description: "Real-time shipment status" },
  { pattern: /^assign (.+?) to (.+?)$/i, action: "assign_driver", params: ["shipment", "driver"], description: "Allocate to driver" },
  { pattern: /^optimize route for (.+?)$/i, action: "optimize_route", params: ["shipments"], description: "Best delivery sequence" },
  { pattern: /^show unassigned deliveries$/i, action: "list_unassigned", params: [], description: "Pending driver allocation" },
  { pattern: /^delay shipment (.+?) to (.+?)$/i, action: "reschedule_delivery", params: ["shipment", "date"], description: "Postpone delivery" },
  { pattern: /^fleet status$/i, action: "fleet_analytics", params: [], description: "Driver availability + locations" },
];

/**
 * Facturación Express POS commands
 * Control: invoices, compliance, customers, taxes, analytics
 */
export const FE_POS_COMMANDS: Command[] = [
  { pattern: /^create invoice for (.+?) - \$(.+?)$/i, action: "create_invoice", params: ["customer", "amount"], description: "Generate NCF" },
  { pattern: /^validate ncf (.+?)$/i, action: "validate_ncf", params: ["ncf"], description: "Check DGII compliance" },
  { pattern: /^payment received from (.+?) - \$(.+?)$/i, action: "record_payment", params: ["customer", "amount"], description: "Log sale" },
  { pattern: /^generate tax report for (.+?)$/i, action: "tax_report", params: ["month"], description: "DGII submission file" },
  { pattern: /^apply retention to (.+?)$/i, action: "apply_retention", params: ["invoice"], description: "Withhold tax" },
  { pattern: /^show daily sales$/i, action: "daily_analytics", params: [], description: "Revenue by hour/category" },
  { pattern: /^export (.+?) to excel$/i, action: "export_data", params: ["report_type"], description: "Spreadsheet download" },
];

/**
 * Parse chat message to find matching command
 */
export function parseCommand(
  text: string,
  saasType: SaaS
): { type: string; params: Record<string, any> } | null {
  const commands = getCommandsForType(saasType);

  for (const cmd of commands) {
    const match = text.match(cmd.pattern);
    if (match) {
      const params: Record<string, any> = {};
      cmd.params.forEach((paramName, i) => {
        params[paramName] = match[i + 1];
      });
      return { type: cmd.action, params };
    }
  }

  return null;
}

/**
 * Get command list for a SaaS type
 */
export function getCommandsForType(saasType: SaaS): Command[] {
  switch (saasType) {
    case "leadgen":
      return LEADGEN_COMMANDS;
    case "whatsapp_omnichannel":
      return WHATSAPP_OMNICHANNEL_COMMANDS;
    case "ecommerce":
      return ECOMMERCE_COMMANDS;
    case "logistics":
      return LOGISTICS_COMMANDS;
    case "fe_pos":
      return FE_POS_COMMANDS;
    default:
      return [];
  }
}

/**
 * Generate help text for a SaaS type
 */
export function getCommandHelp(saasType: SaaS): string {
  const commands = getCommandsForType(saasType);
  if (commands.length === 0) return "No commands defined for this SaaS type.";

  const help = commands
    .map((cmd) => `• ${cmd.description} — \`${cmd.pattern.source.replace(/\\/g, "")}\``)
    .join("\n");

  return `**Available commands:**\n${help}`;
}
