# Level 1: LLM Intent Parsing Setup Guide

Level 1 enables natural language understanding in your SaaS chat interface. Users can speak naturally instead of memorizing exact command syntax.

## Quick Start (2 minutes)

### 1. Install AISETTINGS

```bash
npm install @aisettings/core
```

### 2. Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create a new API key
3. Store it in `.env.local`:

```env
REACT_APP_ANTHROPIC_API_KEY=sk-ant-v1-xxx...
```

### 3. Use ChatController with LLM Parsing

```tsx
import { ChatController } from '@aisettings/core/components/chat';
import { variantConfig } from '@aisettings/core';

export default function MyApp() {
  const config = variantConfig('ecommerce', 'MyStore');

  return (
    <ChatController
      config={config}
      saasType="ecommerce"
      anthropicApiKey={process.env.REACT_APP_ANTHROPIC_API_KEY}
      useLLMParsing={true}  // 👈 Enable Level 1
      height="600px"
    />
  );
}
```

That's it. The chat now understands natural language.

## How It Works

```
User: "i need to bill acme 2.5k"
           ↓
    1. Try LLM (Claude API)
       → Extracts action: "create_invoice"
       → Extracts params: {customer: "acme", amount: 2500}
       → Confidence: 0.92 ✓
           ↓
    Execute: create_invoice({customer: "acme", amount: 2500})
           ↓
    Response: "✅ Invoice created for acme - $2500"
```

If the LLM is unavailable or confidence < 0.6, it falls back to regex pattern matching automatically.

## Configuration

### Enable / Disable LLM Parsing

```tsx
// With LLM (recommended)
<ChatController
  anthropicApiKey={process.env.REACT_APP_ANTHROPIC_API_KEY}
  useLLMParsing={true}
/>

// Without LLM (regex only)
<ChatController
  useLLMParsing={false}
/>

// Auto-detection: uses LLM if apiKey provided, otherwise regex
<ChatController
  anthropicApiKey={process.env.REACT_APP_ANTHROPIC_API_KEY}
  // useLLMParsing not specified → auto
/>
```

### Custom Confidence Threshold

```tsx
import { parseMessage } from '@aisettings/core';

const result = await parseMessage(
  "user message",
  'ecommerce',
  config,
  {
    apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
    preferLLM: true,
    minConfidence: 0.7,  // 👈 Require 70% confidence
  }
);
```

## Supported SaaS Types

Level 1 works with all SaaS variants in AISETTINGS:

- **leadgen** — Lead creation, qualification, scoring
- **whatsapp_omnichannel** — Message routing, broadcasts, templates
- **ecommerce** — Products, inventory, orders, discounts
- **logistics** — Shipments, tracking, driver assignment
- **fe_pos** — Invoices, NCF validation, tax reports, payments
- **booking** — Appointments, resources, calendar
- **crm** — Contacts, deals, activities
- **invoicing** — Invoice creation, payment tracking
- **marketplace** — Vendor management, listings
- **support** — Tickets, knowledge base, escalation
- **generic** — Custom business logic

## Natural Language Examples

### FE POS (Invoicing)

```
✅ "i need to bill acme 2.5k"
✅ "send invoice to acme corp for twenty-five hundred"
✅ "invoice acme 2500"
✅ "record 2500 payment from acme"
✅ "validate ncf 001-01-0001234"
✅ "december tax report please"
✅ "create invoice for AcmeCorp - $2500"  (exact syntax still works)
```

### E-commerce

```
✅ "we've got a new blue tee for $25"
✅ "only 150 blue shirts left in stock"
✅ "i need to create an order for maria"
✅ "maria ordered 2 jeans and a hoodie"
✅ "20% off the blue t-shirt"
```

### Logistics

```
✅ "shipment from santo domingo to santiago"
✅ "can you check on SHIP-89234?"
✅ "where's the package going to santiago?"
✅ "assign this to carlos"
✅ "optimize the route for this delivery"
```

## Cost

- ~$0.01 per complex command parsed by Claude
- No cost when regex matches
- No cost when LLM unavailable (automatic fallback)

## Production Checklist

- [ ] API key stored in environment variable (not hardcoded)
- [ ] API key has appropriate rate limits
- [ ] Fallback to regex works when LLM is down
- [ ] Confidence threshold tuned for your domain
- [ ] Test with 5-10 real user phrases from your SaaS type
- [ ] Monitor LLM API errors in production
- [ ] Consider caching common phrases (future enhancement)

## Troubleshooting

### LLM parsing not working

**Check 1: API key set?**
```tsx
console.log('API Key:', process.env.REACT_APP_ANTHROPIC_API_KEY ? '✓' : '✗');
```

**Check 2: `useLLMParsing={true}`?**
```tsx
<ChatController useLLMParsing={true} />
```

**Check 3: Network access?**
```tsx
import { parseWithClaude } from '@aisettings/core';
const test = await parseWithClaude("test", 'ecommerce', config, apiKey);
console.log('LLM Status:', test ? '✓' : '✗');
```

### Confidence too low

Increase the confidence threshold or adjust the system prompt for your industry.

### Regex still matching when LLM available

This is expected — if regex matches first, it's used. LLM is tried before regex for unstructured input.

## Next Steps: Level 2-7

Once Level 1 is working, consider these enhancements:

- **Level 2**: Agent Autonomy — AI makes decisions (approve/decline) without user confirmation
- **Level 3**: Real-Time API Integrations — Connect to live data (inventory, CRM, email)
- **Level 4**: Multi-Agent Orchestration — Coordinate specialized agents for complex workflows
- **Level 5**: Workflow Automation — Schedule and batch operations
- **Level 6**: Permission/Role System — Fine-grained access control per user
- **Level 7**: Proactive Insights — AI surfaces recommendations without being asked

## Support

For issues or feature requests, see the [AISETTINGS README](./README.md).
