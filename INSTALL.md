# Installation Guide for AISETTINGS

## As an npm Package

### 1. Install from GitHub

```bash
npm install github:facturacionexpressrd-commits/AISETTINGS
```

Or in `package.json`:
```json
{
  "dependencies": {
    "@aisettings/core": "github:facturacionexpressrd-commits/AISETTINGS"
  }
}
```

### 2. Import & Use

```typescript
import { 
  StudioConfig, 
  defaultStudioConfig, 
  sanitizeConfig,
  getActiveWorkers 
} from "@aisettings/core";

const config = defaultStudioConfig();
const workers = getActiveWorkers(config);
```

## Copy the Studio UI (React Components)

Until v1.1, copy the UI components manually from SantoAI:

1. **From SantoAI repo:**
   - Copy `/src/app/(app)/ia/studio/` folder
   - Copy `/src/components/ui.tsx` (the primitives)
   - Copy `/src/lib/ai/studio.ts` (if you want the full type defs)

2. **Into your project:**
   - Paste into `/src/app/settings/ai-assistant/` (or wherever)
   - Update import paths to point to your components/lib
   - Update the Server Actions to call your own database

3. **Wire to your database:**
   ```typescript
   // Create table
   CREATE TABLE ai_configs (
     id uuid PRIMARY KEY,
     config jsonb NOT NULL,
     created_at timestamptz DEFAULT now(),
     updated_at timestamptz
   );

   // Update in Server Action
   export async function saveAIConfig(config: StudioConfig) {
     await supabase
       .from("ai_configs")
       .upsert({ config, updated_at: new Date() });
   }
   ```

## Per-Project Setup

### FERD Brain (n8n)

```sql
CREATE TABLE ferd_ai_workers (
  department_id uuid PRIMARY KEY,
  config jsonb,
  n8n_webhook_url text,
  created_at timestamptz DEFAULT now()
);
```

```typescript
import { initFerdWorkers, routeToWorker } from "@aisettings/core/examples/ferd-integration";

const workers = await initFerdWorkers();
const result = await routeToWorker(message, departmentId, workers);
```

### Commerce OS (Multi-store)

```sql
CREATE TABLE store_ai_configs (
  store_id uuid PRIMARY KEY REFERENCES stores(id),
  config jsonb NOT NULL,
  updated_by uuid NOT NULL,
  updated_at timestamptz DEFAULT now()
);
```

```typescript
import { createStoreConfig, updateStoreConfig } from "@aisettings/core/examples/commerce-os-integration";

const config = createStoreConfig(storeId, storeName);
await updateStoreConfig(storeId, config, userId);
```

### Spend Dat Capital (Alerts)

```typescript
import { StudioConfig, WORKERS } from "@aisettings/core";

// Use only the "followup" worker
const followupWorker = WORKERS.find(w => w.key === "followup");

// Send alerts based on config
```

## Codex Integration

To use in Codex projects:

1. **Create new project in Codex**
2. **In package.json:**
   ```json
   {
     "dependencies": {
       "@aisettings/core": "github:facturacionexpressrd-commits/AISETTINGS"
     }
   }
   ```
3. **Run `npm install`**
4. **Import types:**
   ```typescript
   import type { StudioConfig } from "@aisettings/core";
   ```

## Troubleshooting

**"Cannot find module @aisettings/core"**
- Ensure npm install ran: `rm -rf node_modules && npm install`
- Check GitHub URL is correct (it's under `facturacionexpressrd-commits` org, not personal)

**TypeScript errors**
- Run `npm run build` in AISETTINGS repo to generate dist/
- Make sure tsconfig.json has `"declaration": true`

**UI components won't import**
- They're not in this package yet (coming v1.1)
- Copy them manually from SantoAI for now

## Next: Contributing

Found a bug? Fork the repo, fix it, and open a PR.

Want to add React components? Copy SantoAI's Studio UI, generalize it, add to `src/components/`.
