# AISETTINGS

Reusable AI Worker System + Studio UI for multi-project deployments. Extract from SantoAI, designed to be dropped into any project.

**What it is:** A modular configuration system for AI assistants that dispatches work to specialized "workers" (knowledge, scheduling, sales, CRM, follow-up, escalation, payments). Each worker has fine-grained permission controls.

**Ports:** TypeScript library (core types + utilities) + React components (Studio UI).

## Installation

```bash
npm install @aisettings/core
```

## Usage

### TypeScript (Core Types)

```typescript
import { 
  StudioConfig, 
  WORKERS, 
  defaultStudioConfig, 
  sanitizeConfig,
  getActiveWorkers 
} from "@aisettings/core";

// Get a default config
const config = defaultStudioConfig();

// Sanitize user input
const userConfig = sanitizeConfig(req.body);

// Get active workers for this config
const workers = getActiveWorkers(config);
```

### React (Chat Controller + Level 1 Intent Parsing)

```tsx
import { ChatController } from "@aisettings/core/components/chat";
import { variantConfig } from "@aisettings/core";

export default function App() {
  const config = variantConfig("ecommerce", "MyStore");

  return (
    <ChatController
      config={config}
      saasType="ecommerce"
      anthropicApiKey={process.env.REACT_APP_ANTHROPIC_API_KEY}
      useLLMParsing={true}  // Level 1: Claude API for natural language understanding
      height="600px"
    />
  );
}
```

**Level 1 enables natural language commands:**

```
User: "i need to bill acme 2.5k"
AI:   ✅ Invoice created for acme - $2500

Instead of: "create invoice for AcmeCorp - $2500"
```

See [LEVEL_1_SETUP.md](./LEVEL_1_SETUP.md) for full setup guide.

## SaaS Variants

**AISETTINGS adapts to 11 different SaaS business models.** Each comes with pre-configured workers, permissions, and intricate chat commands:

- **leadgen** — Lead creation, scoring, campaign management, call scheduling
- **whatsapp_omnichannel** — Message routing, broadcasts, contact sync, auto-replies
- **ecommerce** — Products, inventory, orders, shipping, discounts, refunds
- **logistics** — Shipments, tracking, driver assignment, route optimization
- **fe_pos** — Dominican invoicing (NCF), DGII compliance, tax reporting, payments
- **booking** — Appointments, resource availability, cancellations
- **crm** — Contacts, deals, activities, follow-ups
- **invoicing** — Invoice creation, payment tracking, reminders
- **marketplace** — Vendor management, product listings, commission tracking
- **support** — Tickets, knowledge base, escalations
- **generic** — Custom business logic

### Using Variants

```typescript
import { variantConfig, variantWorkers } from "@aisettings/core";

// Get a config for your SaaS type
const config = variantConfig("ecommerce", "MyStoreName");

// Get active workers for this type
const workers = variantWorkers("ecommerce");
```

## Architecture

### Worker System

7 internal workers handle different business functions:

1. **Knowledge** — FAQs, pricing, hours, services
2. **Scheduling** — Calendar, appointments, cancellations
3. **Sales** — Leads, orders, menu
4. **CRM** — Contacts, data sync
5. **Follow-up** — Reminders, campaigns
6. **Escalation** — Human handoff
7. **Payments** — *Integration ready*

Each worker:
- Has a set of **permissions** (which actions it can take)
- Has **tools** it calls to execute work
- Runs silently (no customer-facing conversation)

### Config Structure

A **StudioConfig** is a JSON document that describes an AI assistant:

- **Identity** — name, role, avatar, language, greeting
- **Goals** — primary + secondary objectives (resolve request, capture lead, etc.)
- **Business** — description, services, pricing, policies, custom fields
- **Personality** — preset (professional, friendly, luxury, etc.) + sliders (formality, warmth, empathy, etc.)
- **Style** — tone, words to use/avoid, closing, name usage
- **Rules** — always/never instructions, categorized, with priority + channel targeting
- **Behavior** — returning greeting, after-hours reply, confidence threshold, question limits
- **Actions** — permission levels per action (auto, confirm, approval, human, never)
- **Handoff** — triggers, keywords, assignment, message
- **Training** — examples (input/output pairs)
- **Settings** — model choice

### Permission System

Every action has a **PermissionLevel**:

- `auto` — AI does it alone
- `confirm` — AI asks customer "yes/no?"
- `approval` — AI asks employee for approval
- `human` — Only a person can do it
- `never` — AI explains it's not possible on this channel

Example:
```typescript
{
  answer_faqs: "auto",
  provide_pricing: "confirm",
  take_orders: "approval",
  transfer_to_employee: "never"
}
```

## Deployment Patterns

### FERD Brain (n8n WhatsApp bot)

```sql
CREATE TABLE ferd_workers (
  id uuid PRIMARY KEY,
  department_id uuid NOT NULL,
  worker_key text,
  config jsonb,
  created_at timestamptz DEFAULT now()
);
```

Dispatch WhatsApp messages to the right worker based on department. Reuse your existing n8n queues.

### Commerce OS (fe-multi-store)

```sql
CREATE TABLE store_workers (
  store_id uuid PRIMARY KEY,
  config jsonb,
  updated_at timestamptz
);
```

One config per store. Copy the Studio UI, wire to your Shopify/Odoo APIs.

### SantoAI (Multi-tenant CRM)

Already deployed. Use `/ia/studio` at https://santoai-nine.vercel.app.

## Types

### StudioConfig

Main configuration object. Can be serialized to JSON, stored in Supabase, validated via `sanitizeConfig()`.

### Worker

```typescript
{
  key: string;              // "knowledge", "scheduling", etc.
  permissions: PermissionKey[];  // Actions this worker can take
  tools: string[];          // Tool names it calls
  needsIntegration?: boolean;    // Requires env setup
}
```

### PermissionLevel

Union: `"auto" | "confirm" | "approval" | "human" | "never"`

## Utilities

- `defaultStudioConfig()` — Returns a sensible default config
- `sanitizeConfig(data)` — Validates + truncates user input
- `derivePermissions(config)` — Extract boolean permissions from config
- `getActiveWorkers(config)` — List workers with at least one active permission
- `profileCompleteness(config)` — Percentage of business info filled (0–100)

## Examples

See `/examples` directory for full integration examples (Vercel Edge Functions, Next.js Server Actions, Supabase RLS policies).

## Contributing

This is a reference implementation. Feel free to fork and customize for your project.

## License

MIT
