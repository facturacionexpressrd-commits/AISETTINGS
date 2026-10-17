# Agent presets: host integration guide

AISETTINGS presets are product and safety blueprints. They describe what an agent is intended to do; they are not an agent runtime, Shopify integration, authentication system, or permission grant. The host SaaS owns data access, tool execution, approvals, retention, and audit records.

## Available presets

| Preset key | Best fit | Primary capabilities |
| --- | --- | --- |
| `ecomos_operator` | One assistant for a merchant's broader store workflow | Research, catalog, orders, inventory, marketing, analytics, customer care, workspace help |
| `ecomos_product_scout` | Decide which products to validate before investing | Product research, supplier comparison, unit economics, evidence-based ranking |
| `ecomos_store_operations` | Handle daily catalog, order, and inventory work | Product edits and publish/unpublish, order exceptions, inventory risk, replenishment proposals |
| `ecomos_growth_marketer` | Learn from store and campaign performance | Analytics, creative drafts, campaign experiments, budget-aware proposals |
| `ecomos_customer_care` | Help answer order and delivery questions | Policy-grounded response drafts, order lookup, human escalation |

Each preset can be listed with `listAgentPresets("commerce")`, fetched by key with `getAgentPreset(key)`, and rendered as an implementation choice. A host can enable a subset of its capabilities.

## Capability contract

Each capability can provide:

- `requiredTools`: adapter names the host needs to implement before enabling the capability.
- `inputs`: minimum business context expected for useful results.
- `outputs`: result shape that the interface should make visible to the user.
- `risk`: a planning hint for product and security review.
- `defaultPermission`: a recommended `PermissionLevel`, not authorization.
- `approvalReason`: why the host should require review for consequential operations.

A host should check that a capability's tools exist before showing it as active. Missing tools should produce a clear unavailable state, never a simulated success.

### Product Scout result shape

A product research result should include:

1. Product idea, target customer, and market.
2. Evidence signals with source, URL or source ID, observation date, geography, and limitations.
3. Supplier offers normalized by unit cost, minimum order, shipping, lead time, and quote date.
4. Unit economics with known values separated from assumptions. Include product cost, shipping, payment/platform fees, fulfillment, returns allowance, and other merchant-provided costs where available.
5. Contribution margin calculation and currency. If inputs are missing, show a partial calculation and name the missing values.
6. Separate scores for demand evidence, competition, economics, operational fit, and evidence quality.
7. Confidence, risk notes, unanswered checks, and a low-cost validation plan.

The host should define scoring weights and any merchant-specific thresholds. Do not embed universal margin targets or market guarantees in the preset. Do not claim a trend, supplier price, or sales volume without attributable evidence.

## Recommended host workflow

1. **Choose the preset.** Store its key and the merchant's enabled capabilities in the host app's own configuration. Treat user configuration as untrusted and validate it.
2. **Resolve identity and scope.** On every request, authenticate the user, resolve the active tenant/store, and check the user's role and capability access on the server.
3. **Build minimal context.** Fetch only data needed for that request, scoped to the authorized store. Avoid customer-level information for aggregate research or analytics.
4. **Call the model with bounded tools.** Expose only the adapters required for the enabled capability. Validate tool arguments against schemas and reject unknown tools or parameters.
5. **Separate reads from writes.** Read-only lookup and analysis can be available without write authority. Write tools should create drafts or proposals by default.
6. **Show a reviewable proposal.** Display the exact target record, current value, proposed value, reason, financial/customer impact, and validation warnings.
7. **Enforce approval server-side.** Bind approval to the authenticated user, store, action, and exact parameters. Recheck authorization and current record state immediately before execution. Never trust a model-generated statement that approval occurred.
8. **Execute and verify.** Call the host integration only after approval. Re-fetch the affected state and report the actual result, including failures or partial completion.
9. **Record an audit event.** Keep the request, capability, tool names, approval identity, sanitized parameters, result, and timestamp according to the host's retention policy. Do not log secrets or unnecessary personal data.

## Suggested permission posture

| Work | Suggested default | Host behavior |
| --- | --- | --- |
| Product research and aggregate analytics | `auto` | Permit read-only tools inside the authorized store and connected sources |
| Drafting catalog content, campaign proposals, or customer replies | `confirm` or `approval` | Save drafts; do not publish or send automatically |
| Editing product fields or publishing/unpublishing products | `approval` | Show a before-and-after diff; approve the exact product, fields or sales channels, and final values |
| Inventory edits, order changes, customer messages, refunds, purchases, or ad spend | `approval` | Require an authorized human to approve the exact operation |
| Changing security, user access, billing, integrations, or workspace-wide settings | `human` or `approval` | Use the host's dedicated high-risk workflow; do not allow generic natural-language execution |

Permission labels are recommendations. A host must translate them into its own policy checks and must fail closed when authorization cannot be verified.

## Commerce action boundaries

Never allow a preset or model to:

- Access another tenant or store by changing an ID supplied in model output.
- Issue refunds, cancel or edit orders, send customer messages, publish or unpublish products, alter inventory, create purchase commitments, or spend advertising budget without host authorization and the required approval.
- Permanently delete products through a general agent tool. Taking a product down should mean unpublishing it from explicitly selected sales channels; permanent deletion needs a separate host-admin workflow.
- Change account access, security controls, billing, or integration credentials through an unrestricted tool.
- Run arbitrary SQL, shell commands, browser automation, or generic HTTP requests as a shortcut to a missing adapter.
- Claim that an external action completed unless the host tool returned a verified success and the resulting state was checked.

## Data handling

Before sending context to an external model provider, the host should tell the user what categories of data may be sent and which provider processes them. Send the minimum context necessary. Exclude credentials, tokens, payment data, and customer identifiers by default. Store-level business metrics and product data should be scoped to the active store and should not be reused across merchants. Define retention and deletion behavior in the host product.

## Adding another preset

1. Add a stable key and clear target user to `src/agent-presets.ts`.
2. Reuse existing capability contracts where possible; add a new capability only when it represents a distinct business outcome or host tool contract.
3. List required tools, minimum inputs, visible outputs, risk, and approval reason for each capability.
4. Add an end-to-end workflow and data boundaries for the preset.
5. Add tests for lookup, category listing, and the new preset's contract when the repository's test setup is available.
6. Update this guide and the README, and verify package exports still expose the preset APIs.
