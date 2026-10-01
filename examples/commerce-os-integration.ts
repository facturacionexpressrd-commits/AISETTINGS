/**
 * Commerce OS Integration Example
 * Multi-store worker system with per-store configs
 */

import {
  StudioConfig,
  defaultStudioConfig,
  sanitizeConfig,
  getActiveWorkers
} from "@aisettings/core";

/**
 * Per-store AI configuration
 */
export interface StoreAIConfig {
  store_id: string;
  config: StudioConfig;
  updated_by: string;
  updated_at: string;
}

/**
 * Initialize default config for a new store
 */
export function createStoreConfig(storeId: string, storeName: string): StoreAIConfig {
  const config = defaultStudioConfig();

  // Customize for this store
  config.identity.name = `${storeName} Support Bot`;
  config.identity.role = "Customer Service";
  config.business.description = `Support bot for ${storeName}`;

  // Enable store-specific permissions
  config.actions.answer_faqs = "auto";
  config.actions.provide_pricing = "auto";
  config.actions.take_orders = "confirm";
  config.actions.book_appointments = "confirm";

  return {
    store_id: storeId,
    config,
    updated_by: "system",
    updated_at: new Date().toISOString(),
  };
}

/**
 * Supabase schema for store configs
 *
 * create table store_ai_configs (
 *   store_id uuid primary key references stores(id),
 *   config jsonb not null,
 *   updated_by uuid not null,
 *   updated_at timestamptz default now(),
 *   constraint config_valid check (config->'identity'->>'name' != '')
 * );
 *
 * alter table store_ai_configs enable row level security;
 *
 * create policy "stores can read their own config"
 *   on store_ai_configs for select
 *   using (auth.uid() = updated_by);
 */

/**
 * Update store config (Server Action in Next.js)
 */
export async function updateStoreConfig(
  storeId: string,
  rawConfig: unknown,
  userId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    // Validate config
    const config = sanitizeConfig(rawConfig);

    // In real code: use Supabase
    // const { error } = await supabase
    //   .from("store_ai_configs")
    //   .upsert({ store_id: storeId, config, updated_by: userId, updated_at: new Date().toISOString() });

    if (Math.random() > 0.5) {
      return { ok: false, error: "Database update failed" };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/**
 * Get store config
 */
export async function getStoreConfig(storeId: string): Promise<StoreAIConfig | null> {
  // In real code: fetch from Supabase
  // const { data, error } = await supabase
  //   .from("store_ai_configs")
  //   .select("*")
  //   .eq("store_id", storeId)
  //   .single();

  return {
    store_id: storeId,
    config: defaultStudioConfig(),
    updated_by: "system",
    updated_at: new Date().toISOString(),
  };
}

/**
 * Invoke AI for a store
 * Routes through active workers
 */
export async function askStoreAI(
  storeId: string,
  question: string,
  context?: Record<string, string>
): Promise<{ answer: string; worker: string }> {
  const cfg = await getStoreConfig(storeId);
  if (!cfg) {
    return { answer: "Store not configured", worker: "error" };
  }

  const config = sanitizeConfig(cfg.config);
  const workers = getActiveWorkers(config);

  // Route to the first active worker
  // In real code: pick based on question intent
  if (workers.length === 0) {
    return { answer: "No workers active", worker: "none" };
  }

  const worker = workers[0]!;

  // Call worker tools
  let answer = "";
  if (worker.key === "knowledge") {
    answer = await fetchFAQ(question);
  } else if (worker.key === "sales") {
    answer = await searchProducts(question, storeId);
  }

  return { answer, worker: worker.key };
}

async function fetchFAQ(question: string): Promise<string> {
  // Call your knowledge base
  return "Here's the FAQ answer...";
}

async function searchProducts(question: string, storeId: string): Promise<string> {
  // Query store inventory
  return "Here are matching products...";
}
