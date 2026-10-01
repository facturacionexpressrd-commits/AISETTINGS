/**
 * Variant Usage Examples
 * One line per SaaS type → full config ready to use
 */

import {
  variantConfig,
  variantWorkers,
  VARIANT_DESCRIPTIONS,
  type SaaS
} from "@aisettings/core";

/**
 * FERD Brain — Invoicing SaaS
 * Focus: DGII compliance, invoice generation, tax docs
 */
export function setupFerd() {
  const config = variantConfig("invoicing", "FERD");

  // Customize further if needed
  config.business.description = "Platform de facturación electrónica para RD";
  config.business.services = "Facturación electrónica NCF, FacturaPlus, Retención de impuestos";

  const workers = variantWorkers("invoicing");
  console.log("FERD workers:", workers.map(w => w.key));
  // → ["knowledge", "crm", "escalation"]

  return { config, workers };
}

/**
 * Commerce OS — E-Commerce SaaS
 * Focus: Product catalog, orders, customer service
 */
export function setupCommerceOS() {
  const config = variantConfig("ecommerce", "TiendaXYZ");

  config.business.products = "Zapatos, ropa, accesorios";
  config.business.pricing = "Consulta nuestro catálogo para precios actualizados";
  config.business.paymentMethods = "Tarjeta crédito, transferencia, PayPal";

  const workers = variantWorkers("ecommerce");
  console.log("Commerce OS workers:", workers.map(w => w.key));
  // → ["knowledge", "sales", "crm", "escalation"]

  return { config, workers };
}

/**
 * Booking Platform (new project)
 * Focus: Appointments, calendar, scheduling
 */
export function setupBookingPlatform() {
  const config = variantConfig("booking", "ReservaFácil");

  config.business.services = "Consultas médicas, sesiones de masaje, clases particulares";
  config.business.locationS = "Santo Domingo, Santiago";
  config.business.holidayHours = "Cerrado domingos y festivos";

  const workers = variantWorkers("booking");
  console.log("Booking workers:", workers.map(w => w.key));
  // → ["knowledge", "scheduling", "crm", "escalation"]

  return { config, workers };
}

/**
 * CRM Platform (new project)
 * Focus: Lead management, sales pipeline, follow-up
 */
export function setupCRM() {
  const config = variantConfig("crm", "SalesHub");

  config.business.services = "Gestión de leads, pipeline de ventas, análisis";
  config.business.description = "Plataforma CRM para equipos de ventas";

  const workers = variantWorkers("crm");
  console.log("CRM workers:", workers.map(w => w.key));
  // → ["sales", "crm", "followup", "escalation"]

  return { config, workers };
}

/**
 * SantoAI Marketplace (multi-tenant)
 * Focus: Vendor matching, catalog, orders
 */
export function setupMarketplace() {
  const config = variantConfig("marketplace", "MercadoLocal");

  config.business.description = "Conectamos compradores locales con pequeños negocios";
  config.business.services = "Directorio de vendedores, transacciones seguras";

  const workers = variantWorkers("marketplace");
  console.log("Marketplace workers:", workers.map(w => w.key));
  // → ["knowledge", "sales", "crm", "followup"]

  return { config, workers };
}

/**
 * Support/Help Desk (simple)
 * Focus: FAQs, ticket routing
 */
export function setupHelpDesk() {
  const config = variantConfig("support", "Support Center");

  config.business.phones = "+1-800-HELP-123";
  config.business.emails = "support@company.com";
  config.business.website = "https://help.company.com";

  const workers = variantWorkers("support");
  console.log("Support workers:", workers.map(w => w.key));
  // → ["knowledge", "escalation"]

  return { config, workers };
}

/**
 * Spend Dat Capital (Options alerts)
 * No predefined variant yet, but here's how to extend
 */
export function setupSpendDat() {
  // Create a custom variant if needed
  const config = variantConfig("generic", "Spend Dat Capital");

  // Override with what matters
  config.identity.role = "Market Analyst";
  config.identity.greeting = "¿Qué opciones te interesan hoy?";
  config.business.services = "Análisis de opciones, alertas de mercado, recomendaciones";

  // Keep only followup worker active
  config.actions.follow_up_leads = "auto";
  Object.keys(config.actions).forEach(key => {
    if (key !== "follow_up_leads") {
      config.actions[key as any] = "never";
    }
  });

  return config;
}

/**
 * Dynamic setup based on SaaS type
 * Use this if your app is multi-tenant or lets users pick
 */
export function setupAI(saasType: SaaS, businessName: string) {
  const config = variantConfig(saasType, businessName);
  const workers = variantWorkers(saasType);
  const description = VARIANT_DESCRIPTIONS[saasType];

  console.log(`${businessName} (${saasType}): ${description}`);
  console.log(`Active workers: ${workers.map(w => w.key).join(", ")}`);

  return { config, workers, description };
}

/**
 * Example: store these in your database per tenant
 */
export interface TenantAISetup {
  tenant_id: string;
  saas_type: SaaS;
  config: ReturnType<typeof variantConfig>;
  created_at: string;
}

export async function initTenant(tenantId: string, saasType: SaaS, businessName: string) {
  const { config } = setupAI(saasType, businessName);

  // In real code: save to Supabase
  // await supabase.from("tenant_ai_setups").insert({
  //   tenant_id: tenantId,
  //   saas_type: saasType,
  //   config: config,
  //   created_at: new Date().toISOString()
  // });

  return { tenant_id: tenantId, saas_type: saasType, config };
}
