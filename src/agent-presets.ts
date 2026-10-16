/**
 * Reusable agent profiles that a host SaaS can offer as selectable starting points.
 *
 * Presets describe capabilities, integrations, and safe default approval levels.
 * They do not execute tools or grant access by themselves: the host application
 * must provide the integrations and enforce authorization on its own backend.
 */
import type { PermissionLevel } from "./types";

export type AgentPresetCategory = "commerce";

export type AgentPresetCapability = {
  key: string;
  name: string;
  description: string;
  /** Recommended approval level for this capability in the host application. */
  defaultPermission: PermissionLevel;
};

export type AgentPreset = {
  key: string;
  name: string;
  category: AgentPresetCategory;
  description: string;
  /** Skills a host application can enable or map to its own tools. */
  capabilities: AgentPresetCapability[];
  /** Integrations the host should connect before enabling the related capability. */
  integrations: string[];
  /** Product and safety rules intended to be included in the host agent's instructions. */
  guardrails: string[];
};

/**
 * EcomOS Operator is a commerce operations agent template for SaaS products and apps.
 * Product Scout is included for product discovery and evaluation; the host decides
 * which data sources and execution tools are available to the agent.
 */
export const AGENT_PRESETS: AgentPreset[] = [
  {
    key: "ecomos_operator",
    name: "EcomOS Operator",
    category: "commerce",
    description:
      "An AI operator for ecommerce businesses. It can research product opportunities, help manage a store, and coordinate day-to-day commerce work through tools supplied by the host app.",
    capabilities: [
      {
        key: "product_scout",
        name: "Product Scout",
        description:
          "Research product opportunities and return a shortlist with dated evidence, demand signals, competition, estimated costs, margin assumptions, and risks.",
        defaultPermission: "auto",
      },
      {
        key: "catalog_management",
        name: "Catalog Management",
        description:
          "Review products and prepare catalog changes, descriptions, pricing, and product drafts.",
        defaultPermission: "confirm",
      },
      {
        key: "order_operations",
        name: "Order Operations",
        description:
          "Find orders, summarize issues, and prepare fulfillment or customer-service actions.",
        defaultPermission: "confirm",
      },
      {
        key: "inventory_and_suppliers",
        name: "Inventory and Suppliers",
        description:
          "Review stock and supplier information, and prepare replenishment recommendations.",
        defaultPermission: "confirm",
      },
      {
        key: "marketing_operations",
        name: "Marketing Operations",
        description:
          "Analyze campaigns and prepare marketing content or campaign changes.",
        defaultPermission: "confirm",
      },
      {
        key: "store_analytics",
        name: "Store Analytics",
        description:
          "Summarize sales, product, customer, and campaign performance from connected data.",
        defaultPermission: "auto",
      },
      {
        key: "workspace_control",
        name: "Workspace Control",
        description:
          "Help navigate the host SaaS and prepare changes to settings, automations, or team workflows.",
        defaultPermission: "approval",
      },
    ],
    integrations: [
      "Shopify or another commerce platform",
      "Product research sources, such as supplier catalogs or market data",
      "Optional advertising and analytics platforms",
    ],
    guardrails: [
      "Show the source and date for product research; label estimates and assumptions clearly.",
      "Include product cost, shipping, fees, and an estimated margin when the connected data supports it.",
      "Keep product, inventory, order, campaign, and workspace changes in draft until the user or an authorized operator approves them.",
      "Require explicit host-app authorization for each store and tenant; never treat this preset as an access grant.",
      "Do not publish products, place supplier orders, refund customers, spend ad budget, or change security settings without an approval flow enforced by the host application.",
    ],
  },
];

/** Return a preset by key, or undefined when the host does not recognize the key. */
export function getAgentPreset(key: string): AgentPreset | undefined {
  return AGENT_PRESETS.find((preset) => preset.key === key);
}

/** List all available presets, optionally filtered by category. */
export function listAgentPresets(category?: AgentPresetCategory): AgentPreset[] {
  return category
    ? AGENT_PRESETS.filter((preset) => preset.category === category)
    : [...AGENT_PRESETS];
}
