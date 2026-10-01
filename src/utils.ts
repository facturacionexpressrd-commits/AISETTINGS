/**
 * AI Worker System utilities — pure functions for config management
 */

import type { StudioConfig, Worker, PermissionKey, PermissionLevel, PresetKey } from "./types";
import { WORKERS, SLIDERS, PRESETS, PERMISSION_LEVELS } from "./types";

export function defaultStudioConfig(): StudioConfig {
  return {
    identity: {
      name: "AI Assistant",
      role: "Customer Support",
      department: "Support",
      description: "Helpful AI assistant",
      avatarUrl: "",
      primaryLanguage: "es",
      autoDetect: true,
      disclosure: "when_asked",
      customIntro: "",
      greeting: "¡Hola! ¿Cómo puedo ayudarte?",
    },
    goals: {
      primary: "resolve_request",
      secondary: ["accurate_info", "transfer_when_needed"],
    },
    business: {
      description: "",
      locations: "",
      serviceAreas: "",
      phones: "",
      emails: "",
      website: "",
      holidayHours: "",
      services: "",
      products: "",
      pricing: "",
      promotions: "",
      paymentMethods: "",
      departments: "",
      bookingPolicy: "",
      cancellationPolicy: "",
      refundPolicy: "",
      shippingPolicy: "",
      importantInfo: "",
      emergencyInfo: "",
      custom: [],
      summary: "",
    },
    personality: {
      preset: "friendly",
      sliders: {
        formality: 5,
        warmth: 7,
        energy: 6,
        directness: 5,
        length: 5,
        sales: 3,
        empathy: 7,
        humor: 4,
        technical: 3,
      },
      emoji: "minimal",
      questions: "balanced",
    },
    style: {
      addressAs: "tu",
      wordsToUse: [],
      wordsToAvoid: [],
      brandTerms: "",
      closing: "",
      useCustomerName: true,
      mirrorTone: false,
    },
    rules: [],
    behavior: {
      returningGreeting: "¡Bienvenido de vuelta!",
      afterHoursReply: false,
      afterHoursMessage: "",
      maxQuestions: 3,
      oneQuestionAtATime: false,
      summarizeBeforeActing: false,
      confidenceThreshold: 0.7,
      uncertainty: "clarify",
    },
    actions: {
      answer_faqs: "auto",
      provide_pricing: "confirm",
      qualify_leads: "confirm",
      book_appointments: "confirm",
      cancel_appointments: "approval",
      reschedule_appointments: "approval",
      create_contacts: "auto",
      follow_up_leads: "auto",
      send_approved_links: "confirm",
      transfer_to_employee: "never",
      take_orders: "approval",
    },
    handoff: {
      triggers: ["customer_request", "complaint"],
      keywords: ["hablar con", "agent", "representative"],
      assignTo: null,
      message: "Te pasaré con un especialista.",
    },
    training: {
      examples: [],
    },
    settings: {
      model: "gpt-4o",
    },
  };
}

export function sanitizeConfig(data: unknown): StudioConfig {
  const defaults = defaultStudioConfig();
  if (typeof data !== "object" || data === null) return defaults;
  const obj = data as any;

  return {
    identity: {
      name: typeof obj.identity?.name === "string" ? obj.identity.name.slice(0, 40) : defaults.identity.name,
      role: typeof obj.identity?.role === "string" ? obj.identity.role.slice(0, 60) : defaults.identity.role,
      department: typeof obj.identity?.department === "string" ? obj.identity.department.slice(0, 60) : defaults.identity.department,
      description: typeof obj.identity?.description === "string" ? obj.identity.description.slice(0, 600) : defaults.identity.description,
      avatarUrl: typeof obj.identity?.avatarUrl === "string" ? obj.identity.avatarUrl.slice(0, 500).trim() : defaults.identity.avatarUrl,
      primaryLanguage: obj.identity?.primaryLanguage === "en" ? "en" : "es",
      autoDetect: Boolean(obj.identity?.autoDetect),
      disclosure: ["always", "when_asked", "custom"].includes(String(obj.identity?.disclosure)) ? (obj.identity.disclosure as any) : "when_asked",
      customIntro: typeof obj.identity?.customIntro === "string" ? obj.identity.customIntro.slice(0, 300) : defaults.identity.customIntro,
      greeting: typeof obj.identity?.greeting === "string" ? obj.identity.greeting.slice(0, 300) : defaults.identity.greeting,
    },
    goals: {
      primary: (obj.goals?.primary as any) ?? defaults.goals.primary,
      secondary: Array.isArray(obj.goals?.secondary) ? obj.goals.secondary.slice(0, 8) : defaults.goals.secondary,
    },
    business: {
      description: typeof obj.business?.description === "string" ? obj.business.description.slice(0, 3000) : defaults.business.description,
      locations: typeof obj.business?.locations === "string" ? obj.business.locations.slice(0, 3000) : defaults.business.locations,
      serviceAreas: typeof obj.business?.serviceAreas === "string" ? obj.business.serviceAreas.slice(0, 3000) : defaults.business.serviceAreas,
      phones: typeof obj.business?.phones === "string" ? obj.business.phones.slice(0, 3000) : defaults.business.phones,
      emails: typeof obj.business?.emails === "string" ? obj.business.emails.slice(0, 3000) : defaults.business.emails,
      website: typeof obj.business?.website === "string" ? obj.business.website.slice(0, 3000) : defaults.business.website,
      holidayHours: typeof obj.business?.holidayHours === "string" ? obj.business.holidayHours.slice(0, 3000) : defaults.business.holidayHours,
      services: typeof obj.business?.services === "string" ? obj.business.services.slice(0, 3000) : defaults.business.services,
      products: typeof obj.business?.products === "string" ? obj.business.products.slice(0, 3000) : defaults.business.products,
      pricing: typeof obj.business?.pricing === "string" ? obj.business.pricing.slice(0, 3000) : defaults.business.pricing,
      promotions: typeof obj.business?.promotions === "string" ? obj.business.promotions.slice(0, 3000) : defaults.business.promotions,
      paymentMethods: typeof obj.business?.paymentMethods === "string" ? obj.business.paymentMethods.slice(0, 3000) : defaults.business.paymentMethods,
      departments: typeof obj.business?.departments === "string" ? obj.business.departments.slice(0, 3000) : defaults.business.departments,
      bookingPolicy: typeof obj.business?.bookingPolicy === "string" ? obj.business.bookingPolicy.slice(0, 3000) : defaults.business.bookingPolicy,
      cancellationPolicy: typeof obj.business?.cancellationPolicy === "string" ? obj.business.cancellationPolicy.slice(0, 3000) : defaults.business.cancellationPolicy,
      refundPolicy: typeof obj.business?.refundPolicy === "string" ? obj.business.refundPolicy.slice(0, 3000) : defaults.business.refundPolicy,
      shippingPolicy: typeof obj.business?.shippingPolicy === "string" ? obj.business.shippingPolicy.slice(0, 3000) : defaults.business.shippingPolicy,
      importantInfo: typeof obj.business?.importantInfo === "string" ? obj.business.importantInfo.slice(0, 3000) : defaults.business.importantInfo,
      emergencyInfo: typeof obj.business?.emergencyInfo === "string" ? obj.business.emergencyInfo.slice(0, 3000) : defaults.business.emergencyInfo,
      custom: Array.isArray(obj.business?.custom)
        ? obj.business.custom
            .filter((c: unknown) => typeof c === "object" && c !== null)
            .slice(0, 20)
            .map((c: any) => ({
              label: typeof c.label === "string" ? c.label.slice(0, 60) : "",
              value: typeof c.value === "string" ? c.value.slice(0, 1000) : "",
            }))
        : defaults.business.custom,
      summary: typeof obj.business?.summary === "string" ? obj.business.summary.slice(0, 2000) : defaults.business.summary,
    },
    personality: {
      preset: PRESETS.includes(obj.personality?.preset) ? (obj.personality.preset as PresetKey) : "friendly",
      sliders: {
        formality: clampSlider(obj.personality?.sliders?.formality),
        warmth: clampSlider(obj.personality?.sliders?.warmth),
        energy: clampSlider(obj.personality?.sliders?.energy),
        directness: clampSlider(obj.personality?.sliders?.directness),
        length: clampSlider(obj.personality?.sliders?.length),
        sales: clampSlider(obj.personality?.sliders?.sales),
        empathy: clampSlider(obj.personality?.sliders?.empathy),
        humor: clampSlider(obj.personality?.sliders?.humor),
        technical: clampSlider(obj.personality?.sliders?.technical),
      },
      emoji: ["none", "minimal", "moderate", "frequent"].includes(String(obj.personality?.emoji)) ? (obj.personality.emoji as any) : "minimal",
      questions: ["low", "balanced", "high"].includes(String(obj.personality?.questions)) ? (obj.personality.questions as any) : "balanced",
    },
    style: {
      addressAs: obj.style?.addressAs === "usted" ? "usted" : "tu",
      wordsToUse: Array.isArray(obj.style?.wordsToUse) ? obj.style.wordsToUse.filter((w: unknown) => typeof w === "string").slice(0, 50) : [],
      wordsToAvoid: Array.isArray(obj.style?.wordsToAvoid) ? obj.style.wordsToAvoid.filter((w: unknown) => typeof w === "string").slice(0, 50) : [],
      brandTerms: typeof obj.style?.brandTerms === "string" ? obj.style.brandTerms.slice(0, 500) : defaults.style.brandTerms,
      closing: typeof obj.style?.closing === "string" ? obj.style.closing.slice(0, 200) : defaults.style.closing,
      useCustomerName: Boolean(obj.style?.useCustomerName),
      mirrorTone: Boolean(obj.style?.mirrorTone),
    },
    rules: Array.isArray(obj.rules)
      ? obj.rules
          .filter((r: unknown) => typeof r === "object" && r !== null && "instruction" in r)
          .slice(0, 100)
          .map((r: any) => ({
            id: typeof r.id === "string" ? r.id : `r${Date.now()}`,
            kind: r.kind === "never" ? "never" : "always",
            name: typeof r.name === "string" ? r.name.slice(0, 80) : "",
            instruction: typeof r.instruction === "string" ? r.instruction.slice(0, 400) : "",
            category: (r.category as any) ?? "general",
            priority: typeof r.priority === "number" ? Math.max(1, Math.min(5, r.priority)) : 3,
            enabled: Boolean(r.enabled),
            channels: Array.isArray(r.channels) ? r.channels.filter((c: unknown) => typeof c === "string") : [],
          }))
      : defaults.rules,
    behavior: {
      returningGreeting: typeof (obj.behavior as any)?.returningGreeting === "string" ? (obj.behavior as any).returningGreeting.slice(0, 300) : defaults.behavior.returningGreeting,
      afterHoursReply: Boolean((obj.behavior as any)?.afterHoursReply),
      afterHoursMessage: typeof (obj.behavior as any)?.afterHoursMessage === "string" ? (obj.behavior as any).afterHoursMessage.slice(0, 500) : defaults.behavior.afterHoursMessage,
      maxQuestions: typeof (obj.behavior as any)?.maxQuestions === "number" ? Math.max(1, Math.min(5, (obj.behavior as any).maxQuestions)) : defaults.behavior.maxQuestions,
      oneQuestionAtATime: Boolean((obj.behavior as any)?.oneQuestionAtATime),
      summarizeBeforeActing: Boolean((obj.behavior as any)?.summarizeBeforeActing),
      confidenceThreshold: typeof (obj.behavior as any)?.confidenceThreshold === "number" ? Math.max(0.5, Math.min(0.95, (obj.behavior as any).confidenceThreshold)) : defaults.behavior.confidenceThreshold,
      uncertainty: (["clarify", "handoff", "needs_confirmation"].includes(String((obj.behavior as any)?.uncertainty)) ? (obj.behavior as any).uncertainty : defaults.behavior.uncertainty) as any,
    },
    actions: Object.fromEntries(
      Object.entries(defaults.actions).map(([k, v]) => [
        k,
        PERMISSION_LEVELS.includes((obj.actions as any)?.[k]) ? (obj.actions as any)[k] : v,
      ])
    ) as any,
    handoff: {
      triggers: Array.isArray((obj.handoff as any)?.triggers) ? (obj.handoff as any).triggers.filter((t: unknown) => typeof t === "string") : defaults.handoff.triggers,
      keywords: Array.isArray((obj.handoff as any)?.keywords)
        ? (obj.handoff as any).keywords
            .filter((k: unknown) => typeof k === "string")
            .slice(0, 40)
        : defaults.handoff.keywords,
      assignTo: typeof (obj.handoff as any)?.assignTo === "string" ? (obj.handoff as any).assignTo : null,
      message: typeof (obj.handoff as any)?.message === "string" ? (obj.handoff as any).message.slice(0, 300) : defaults.handoff.message,
    },
    training: {
      examples: Array.isArray((obj.training as any)?.examples)
        ? (obj.training as any).examples
            .filter((e: unknown) => typeof e === "object" && e !== null && "input" in e && "output" in e)
            .slice(0, 1000)
            .map((e: any) => ({
              input: String(e.input).slice(0, 500),
              output: String(e.output).slice(0, 1000),
              category: typeof e.category === "string" ? e.category : undefined,
            }))
        : defaults.training.examples,
    },
    settings: {
      model: typeof (obj.settings as any)?.model === "string" ? (obj.settings as any).model : defaults.settings.model,
    },
  };
}

function clampSlider(value: unknown): number {
  if (typeof value !== "number") return 5;
  return Math.max(0, Math.min(10, Math.round(value)));
}

export function derivePermissions(config: StudioConfig): Record<PermissionKey, boolean> {
  return Object.fromEntries(
    Object.entries(config.actions).map(([k, level]) => [
      k,
      level === "auto" || level === "confirm",
    ])
  ) as any;
}

export function getActiveWorkers(config: StudioConfig): Worker[] {
  return WORKERS.filter((w) => {
    if (w.needsIntegration) return false;
    if (w.key === "escalation") return true;
    const levels = w.permissions.map((k) => config.actions[k]);
    const on = levels.filter((l) => l === "auto" || l === "confirm").length;
    return on > 0;
  });
}

export function profileCompleteness(config: StudioConfig): number {
  const fields = [
    config.identity.name.length > 0,
    config.identity.description.length > 0,
    config.business.description.length > 0,
    config.business.summary.length > 0,
    config.business.phones.length > 0,
    config.business.emails.length > 0,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}
