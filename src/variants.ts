/**
 * SaaS Variants — customize workers + config per business type
 * One file, no factories. Pick your type, get the right setup.
 */

import type { StudioConfig, Worker, PermissionKey } from "./types";
import { WORKERS, PERMISSION_KEYS } from "./types";
import { defaultStudioConfig } from "./utils";

export type SaaS = "ecommerce" | "invoicing" | "booking" | "crm" | "marketplace" | "support" | "generic";

/**
 * Worker sets per SaaS type
 * Only these workers are active by default
 */
const VARIANT_WORKERS: Record<SaaS, string[]> = {
  ecommerce: ["knowledge", "sales", "crm", "escalation"],          // catalog, orders, contacts, handoff
  invoicing: ["knowledge", "crm", "escalation"],                   // docs, contacts, human
  booking: ["knowledge", "scheduling", "crm", "escalation"],       // hours, calendar, contacts, handoff
  crm: ["sales", "crm", "followup", "escalation"],                // leads, contacts, campaigns, handoff
  marketplace: ["knowledge", "sales", "crm", "followup"],          // vendor info, matching, profiles, nurture
  support: ["knowledge", "escalation"],                            // FAQs, handoff to agent
  generic: ["knowledge", "sales", "crm", "followup", "escalation"], // all but payments
};

/**
 * Business fields relevant per SaaS type
 * Others default to empty strings
 */
const VARIANT_FIELDS: Record<SaaS, (keyof StudioConfig["business"])[]> = {
  ecommerce: ["products", "pricing", "paymentMethods", "shippingPolicy", "cancellationPolicy", "refundPolicy"],
  invoicing: ["description", "services", "pricing", "bookingPolicy"],
  booking: ["services", "locations", "phones", "emails", "website", "holidayHours", "bookingPolicy", "cancellationPolicy"],
  crm: ["services", "emails", "phones", "departments"],
  marketplace: ["services", "products", "description", "website"],
  support: ["phones", "emails", "website", "emergencyInfo"],
  generic: ["description", "locations", "services", "products", "pricing", "phones", "emails", "website"],
};

/**
 * Default permissions per SaaS type
 * What users can do by default
 */
const VARIANT_PERMISSIONS: Record<SaaS, Record<PermissionKey, "auto" | "confirm" | "approval" | "human" | "never">> = {
  ecommerce: {
    answer_faqs: "auto",
    provide_pricing: "auto",
    qualify_leads: "confirm",
    book_appointments: "never",
    cancel_appointments: "never",
    reschedule_appointments: "never",
    create_contacts: "auto",
    follow_up_leads: "confirm",
    send_approved_links: "confirm",
    transfer_to_employee: "approval",
    take_orders: "approval",
  },
  invoicing: {
    answer_faqs: "auto",
    provide_pricing: "confirm",
    qualify_leads: "never",
    book_appointments: "never",
    cancel_appointments: "never",
    reschedule_appointments: "never",
    create_contacts: "auto",
    follow_up_leads: "never",
    send_approved_links: "auto",
    transfer_to_employee: "approval",
    take_orders: "never",
  },
  booking: {
    answer_faqs: "auto",
    provide_pricing: "auto",
    qualify_leads: "never",
    book_appointments: "confirm",
    cancel_appointments: "confirm",
    reschedule_appointments: "confirm",
    create_contacts: "auto",
    follow_up_leads: "confirm",
    send_approved_links: "auto",
    transfer_to_employee: "approval",
    take_orders: "never",
  },
  crm: {
    answer_faqs: "auto",
    provide_pricing: "confirm",
    qualify_leads: "auto",
    book_appointments: "never",
    cancel_appointments: "never",
    reschedule_appointments: "never",
    create_contacts: "auto",
    follow_up_leads: "auto",
    send_approved_links: "confirm",
    transfer_to_employee: "approval",
    take_orders: "never",
  },
  marketplace: {
    answer_faqs: "auto",
    provide_pricing: "auto",
    qualify_leads: "auto",
    book_appointments: "never",
    cancel_appointments: "never",
    reschedule_appointments: "never",
    create_contacts: "auto",
    follow_up_leads: "auto",
    send_approved_links: "auto",
    transfer_to_employee: "approval",
    take_orders: "approval",
  },
  support: {
    answer_faqs: "auto",
    provide_pricing: "never",
    qualify_leads: "never",
    book_appointments: "never",
    cancel_appointments: "never",
    reschedule_appointments: "never",
    create_contacts: "auto",
    follow_up_leads: "never",
    send_approved_links: "never",
    transfer_to_employee: "approval",
    take_orders: "never",
  },
  generic: {
    answer_faqs: "auto",
    provide_pricing: "confirm",
    qualify_leads: "confirm",
    book_appointments: "confirm",
    cancel_appointments: "approval",
    reschedule_appointments: "approval",
    create_contacts: "auto",
    follow_up_leads: "confirm",
    send_approved_links: "confirm",
    transfer_to_employee: "approval",
    take_orders: "approval",
  },
};

/**
 * Default greeting + identity per type
 */
const VARIANT_IDENTITY: Record<
  SaaS,
  {
    role: string;
    greeting: string;
    description: string;
  }
> = {
  ecommerce: {
    role: "Sales Associate",
    greeting: "¡Hola! ¿Qué producto buscas hoy?",
    description: "Ayuda con catálogo, pedidos y entregas",
  },
  invoicing: {
    role: "Accounting Assistant",
    greeting: "Buenas, ¿pregunta sobre facturación?",
    description: "Soporte para facturas, impuestos y documentos",
  },
  booking: {
    role: "Appointment Scheduler",
    greeting: "¡Hola! ¿Quieres agendar una cita?",
    description: "Ayuda con reservas y calendario",
  },
  crm: {
    role: "Sales Support",
    greeting: "Buenas, ¿en qué puedo ayudarte?",
    description: "Gestión de clientes y oportunidades",
  },
  marketplace: {
    role: "Marketplace Support",
    greeting: "¿Qué necesitas en nuestro marketplace?",
    description: "Conecta compradores y vendedores",
  },
  support: {
    role: "Support Agent",
    greeting: "¡Hola! ¿Cómo puedo ayudarte?",
    description: "Soporte técnico y atención al cliente",
  },
  generic: {
    role: "Customer Assistant",
    greeting: "¡Hola! ¿Cómo puedo ayudarte?",
    description: "Asistente de atención al cliente",
  },
};

/**
 * Create a config tailored for a SaaS type
 */
export function variantConfig(saasType: SaaS, businessName: string): StudioConfig {
  const base = defaultStudioConfig();
  const identity = VARIANT_IDENTITY[saasType];
  const fields = VARIANT_FIELDS[saasType];
  const perms = VARIANT_PERMISSIONS[saasType];

  // Set identity
  base.identity.name = `${businessName} AI`;
  base.identity.role = identity.role;
  base.identity.greeting = identity.greeting;
  base.identity.description = identity.description;

  // Clear irrelevant business fields
  const allFields = Object.keys(base.business) as (keyof typeof base.business)[];
  for (const field of allFields) {
    if (typeof base.business[field] === "string") {
      base.business[field] = "";
    }
  }

  // Repopulate only relevant fields
  for (const field of fields) {
    // just mark as active by setting a placeholder
    // user fills in real value
    if (field === "products") base.business.products = "[Tu catálogo de productos]";
    if (field === "services") base.business.services = "[Tu lista de servicios]";
    if (field === "pricing") base.business.pricing = "[Tu información de precios]";
    // etc.
  }

  // Set permissions
  for (const [key, level] of Object.entries(perms)) {
    base.actions[key as PermissionKey] = level;
  }

  return base;
}

/**
 * Get workers for a SaaS type
 */
export function variantWorkers(saasType: SaaS): Worker[] {
  const workerKeys = VARIANT_WORKERS[saasType];
  return WORKERS.filter((w) => workerKeys.includes(w.key));
}

/**
 * Quick reference: what each type is best for
 */
export const VARIANT_DESCRIPTIONS: Record<SaaS, string> = {
  ecommerce: "Online store, product catalog, orders, shipments",
  invoicing: "Billing, invoices, tax docs, compliance",
  booking: "Appointments, reservations, calendar, availability",
  crm: "Leads, sales pipeline, customer relationships, follow-up",
  marketplace: "Platform connecting buyers/sellers/vendors",
  support: "Help desk, FAQs, ticket routing, chat support",
  generic: "All-purpose assistant (no strong domain)",
};
