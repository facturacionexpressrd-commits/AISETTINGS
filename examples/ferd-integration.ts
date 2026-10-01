/**
 * FERD Brain Integration Example
 * Hook AISETTINGS into your existing n8n dispatcher
 */

import {
  StudioConfig,
  WORKERS,
  sanitizeConfig,
  getActiveWorkers,
  type PermissionKey
} from "@aisettings/core";

/**
 * FERD departments map to workers
 * Reuse your existing department agents
 */
const DEPT_TO_WORKER = {
  "dgii-compliance": "knowledge",        // Answer DGII FAQs, look up procedures
  "invoicing": "knowledge",               // Pricing, invoice templates
  "sales": "sales",                       // Qualify leads, quote requests
  "follow-up": "followup",                // Auto-follow campaigns
  "escalation": "escalation",             // Hand to human expert
} as const;

/**
 * Store worker config per FERD department
 */
export interface FerdWorkerConfig {
  department_id: string;
  worker_key: string;
  config: StudioConfig;
  n8n_webhook_url: string;  // Your existing n8n webhook
  active: boolean;
}

/**
 * Initialize FERD worker system
 * Call once at startup to hydrate your queue dispatcher
 */
export async function initFerdWorkers(): Promise<FerdWorkerConfig[]> {
  // In real code: fetch from Supabase
  // CREATE TABLE ferd_workers (
  //   id uuid PRIMARY KEY,
  //   department_id uuid NOT NULL UNIQUE,
  //   config jsonb DEFAULT null,
  //   created_at timestamptz DEFAULT now()
  // );

  return [
    {
      department_id: "dgii-compliance",
      worker_key: "knowledge",
      config: {
        identity: {
          name: "DGII Compliance Bot",
          role: "Tax Compliance",
          department: "DGII",
          description: "Specializes in Dominican Republic tax law and DGII regulations",
          avatarUrl: "",
          primaryLanguage: "es",
          autoDetect: true,
          disclosure: "always",
          customIntro: "Soy especialista en cumplimiento DGII",
          greeting: "¿Pregunta sobre impuestos?",
        },
        // ... rest of config
      } as any,
      n8n_webhook_url: "https://your-n8n.com/webhook/dgii",
      active: true,
    },
  ];
}

/**
 * Route a WhatsApp message to the right worker
 * Call from your message ingest handler
 */
export async function routeToWorker(
  message: { text: string; fromPhone: string },
  department_id: string,
  workers: FerdWorkerConfig[]
): Promise<{ worker_key: string; response: string } | null> {
  const worker = workers.find((w) => w.department_id === department_id);
  if (!worker || !worker.active) return null;

  const config = sanitizeConfig(worker.config);
  const active = getActiveWorkers(config);

  // Check which worker permissions apply
  for (const w of active) {
    // In real code: query your n8n webhook for this worker
    // It returns data (FAQ answer, price, etc.)
    const result = await callWorkerTool(w, message, config);
    if (result) {
      return {
        worker_key: w.key,
        response: result,
      };
    }
  }

  return null;
}

/**
 * Call a single worker's tool
 * This is where you invoke your actual n8n workflow
 */
async function callWorkerTool(
  worker: (typeof WORKERS)[number],
  message: { text: string; fromPhone: string },
  config: StudioConfig
): Promise<string | null> {
  // Example: knowledge worker searches FAQ
  if (worker.key === "knowledge") {
    const hasFaqPermission = config.actions["answer_faqs"] !== "never";
    if (!hasFaqPermission) return null;

    // Invoke your n8n search webhook
    const faq = await fetch("https://your-n8n.com/webhook/search-faq", {
      method: "POST",
      body: JSON.stringify({ query: message.text }),
    }).then((r) => r.json());

    return faq.answer ?? null;
  }

  // Example: sales worker qualifies lead
  if (worker.key === "sales") {
    const hasLeadPermission = config.actions["qualify_leads"] !== "never";
    if (!hasLeadPermission) return null;

    const lead = await fetch("https://your-n8n.com/webhook/qualify-lead", {
      method: "POST",
      body: JSON.stringify({ text: message.text, phone: message.fromPhone }),
    }).then((r) => r.json());

    return lead.qualification ?? null;
  }

  return null;
}

/**
 * Check if an action is allowed for a user
 * Call before running any tool
 */
export function canAction(
  config: StudioConfig,
  action: PermissionKey
): boolean {
  const level = config.actions[action];
  return level === "auto" || level === "confirm";
}
