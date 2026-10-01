/**
 * AI Worker System — reusable types for studio configuration
 * Extracted from SantoAI, designed for multi-project use
 */

export type PermissionLevel = "auto" | "confirm" | "approval" | "human" | "never";
export const PERMISSION_LEVELS: PermissionLevel[] = ["auto", "confirm", "approval", "human", "never"];

export type PermissionKey =
  | "answer_faqs"
  | "provide_pricing"
  | "qualify_leads"
  | "book_appointments"
  | "cancel_appointments"
  | "reschedule_appointments"
  | "create_contacts"
  | "follow_up_leads"
  | "send_approved_links"
  | "transfer_to_employee"
  | "take_orders";

export const PERMISSION_KEYS: PermissionKey[] = [
  "answer_faqs",
  "provide_pricing",
  "qualify_leads",
  "book_appointments",
  "cancel_appointments",
  "reschedule_appointments",
  "create_contacts",
  "follow_up_leads",
  "send_approved_links",
  "transfer_to_employee",
  "take_orders",
];

export type SliderKey = "formality" | "warmth" | "energy" | "directness" | "length" | "sales" | "empathy" | "humor" | "technical";
export const SLIDERS: SliderKey[] = ["formality", "warmth", "energy", "directness", "length", "sales", "empathy", "humor", "technical"];

export type PresetKey = "professional" | "friendly" | "luxury" | "energetic" | "concierge" | "sales" | "support" | "custom";
export const PRESETS: PresetKey[] = ["professional", "friendly", "luxury", "energetic", "concierge", "sales", "support", "custom"];

export type GoalKey = "resolve_request" | "accurate_info" | "capture_lead" | "book_appointment" | "complete_purchase" | "resolve_support" | "collect_info" | "transfer_when_needed";
export const GOALS: GoalKey[] = ["resolve_request", "accurate_info", "capture_lead", "book_appointment", "complete_purchase", "resolve_support", "collect_info", "transfer_when_needed"];

export type RuleCategory = "general" | "sales" | "support" | "scheduling" | "payments" | "compliance" | "communication" | "security";
export const RULE_CATEGORIES: RuleCategory[] = ["general", "sales", "support", "scheduling", "payments", "compliance", "communication", "security"];

export type ChannelType = "whatsapp" | "instagram" | "messenger" | "gmail" | "website";
export const CHANNELS: ChannelType[] = ["whatsapp", "instagram", "messenger", "gmail", "website"];

export type HandoffTrigger = "customer_request" | "complaint" | "refund" | "negative_sentiment" | "legal" | "payment_problem" | "high_value_lead";
export const HANDOFF_TRIGGERS: HandoffTrigger[] = ["customer_request", "complaint", "refund", "negative_sentiment", "legal", "payment_problem", "high_value_lead"];

export type StudioRule = {
  id: string;
  kind: "always" | "never";
  name: string;
  instruction: string;
  category: RuleCategory;
  priority: number;
  enabled: boolean;
  channels: ChannelType[];
};

export type StudioConfig = {
  identity: {
    name: string;
    role: string;
    department: string;
    description: string;
    avatarUrl: string;
    primaryLanguage: "es" | "en";
    autoDetect: boolean;
    disclosure: "always" | "when_asked" | "custom";
    customIntro: string;
    greeting: string;
  };
  goals: { primary: GoalKey; secondary: GoalKey[] };
  business: {
    description: string;
    locations: string;
    serviceAreas: string;
    phones: string;
    emails: string;
    website: string;
    holidayHours: string;
    services: string;
    products: string;
    pricing: string;
    promotions: string;
    paymentMethods: string;
    departments: string;
    bookingPolicy: string;
    cancellationPolicy: string;
    refundPolicy: string;
    shippingPolicy: string;
    importantInfo: string;
    emergencyInfo: string;
    custom: { label: string; value: string }[];
    summary: string;
  };
  personality: {
    preset: PresetKey;
    sliders: Record<SliderKey, number>;
    emoji: "none" | "minimal" | "moderate" | "frequent";
    questions: "low" | "balanced" | "high";
  };
  style: {
    addressAs: "tu" | "usted";
    wordsToUse: string[];
    wordsToAvoid: string[];
    brandTerms: string;
    closing: string;
    useCustomerName: boolean;
    mirrorTone: boolean;
  };
  rules: StudioRule[];
  behavior: {
    returningGreeting: string;
    afterHoursReply: boolean;
    afterHoursMessage: string;
    maxQuestions: number;
    oneQuestionAtATime: boolean;
    summarizeBeforeActing: boolean;
    confidenceThreshold: number;
    uncertainty: "clarify" | "handoff" | "needs_confirmation";
  };
  actions: Record<PermissionKey, PermissionLevel>;
  handoff: {
    triggers: HandoffTrigger[];
    keywords: string[];
    assignTo: string | null;
    message: string;
  };
  training: {
    examples: { input: string; output: string; category?: string }[];
  };
  settings: {
    model: string;
  };
};

export type Worker = {
  key: string;
  permissions: PermissionKey[];
  tools: string[];
  needsIntegration?: boolean;
};

export const WORKERS: Worker[] = [
  { key: "knowledge", permissions: ["answer_faqs", "provide_pricing"], tools: ["searchKnowledge", "getBusinessHours", "getServicePricing", "getServices"] },
  { key: "scheduling", permissions: ["book_appointments", "cancel_appointments", "reschedule_appointments"], tools: ["checkCalendar", "createAppointment", "cancelAppointment", "rescheduleAppointment"] },
  { key: "sales", permissions: ["qualify_leads", "take_orders"], tools: ["updateLeadStatus", "getMenu", "calculateOrder", "createOrder", "getOrderStatus"] },
  { key: "crm", permissions: ["create_contacts"], tools: ["createContact", "updateContact"] },
  { key: "followup", permissions: ["follow_up_leads"], tools: ["createFollowUp"] },
  { key: "escalation", permissions: ["transfer_to_employee"], tools: ["escalateToHuman", "assignEmployee"] },
  { key: "payments", permissions: [], tools: [], needsIntegration: true },
];

export function workerStatus(c: StudioConfig, w: Worker): "active" | "limited" | "off" | "integration" {
  if (w.needsIntegration) return "integration";
  if (w.key === "escalation") return "active";
  const levels = w.permissions.map((k) => c.actions[k]);
  const on = levels.filter((l) => l === "auto" || l === "confirm").length;
  return on === 0 ? "off" : on === levels.length ? "active" : "limited";
}
