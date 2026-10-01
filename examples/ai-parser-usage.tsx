/**
 * Level 1: LLM Intent Parsing
 * Claude understands natural language — no more regex patterns needed
 */

'use client';

import React from 'react';
import { ChatController, SaasChatController } from '@aisettings/core/components/chat';
import { variantConfig } from '@aisettings/core';

/**
 * Example 1: FE POS with LLM parsing
 * User can say things naturally, not just exact commands
 */
export function FEPOSWithAIExample() {
  const config = variantConfig('fe_pos', 'FERD');

  const tools = {
    create_invoice: async (params: any) => {
      return `✅ Invoice NCF-001-01-0001234 created for ${params.customer} - $${params.amount}`;
    },
    validate_ncf: async (params: any) => {
      return `✅ ${params.ncf} is valid and registered with DGII`;
    },
    record_payment: async (params: any) => {
      return `💳 Payment of $${params.amount} recorded from ${params.customer}`;
    },
    tax_report: async (params: any) => {
      return `📊 Tax report for ${params.month} generated. Ready for DGII submission.`;
    },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px' }}>
      <div>
        <h2>FE POS with AI Parsing</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Try natural language — Claude understands it all
        </p>
        <ChatController
          config={config}
          saasType="fe_pos"
          anthropicApiKey={process.env.REACT_APP_ANTHROPIC_API_KEY}
          useLLMParsing={true}
          height="500px"
        />
      </div>
      <div style={{ fontSize: '12px', color: '#666', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Try saying:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px', lineHeight: '1.6' }}>
{`✅ Exact commands still work:
"create invoice for AcmeCorp - $2500"

✅ Now also natural language:
"i need to bill acme 2.5k"
"send invoice to acme corp for twenty-five hundred"
"invoice acme 2500"
"record 2500 payment from acme"
"validate ncf 001-01-0001234"
"is that ncf valid?"
"generate tax report for january"
"december tax report please"
"what's our tax for december?"
"need to pay dgii"`}
        </pre>
      </div>
    </div>
  );
}

/**
 * Example 2: E-commerce with AI parsing
 * Natural language product management
 */
export function EcommerceWithAIExample() {
  const config = variantConfig('ecommerce', 'ShopPro');

  const tools = {
    create_product: async (params: any) => {
      return `✅ Product "${params.name}" created - $${params.price}. Live now.`;
    },
    set_inventory: async (params: any) => {
      return `📦 Stock updated: "${params.product}" → ${params.quantity} units`;
    },
    create_order: async (params: any) => {
      return `🛒 Order created for ${params.customer}. Items: ${params.items}`;
    },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px' }}>
      <div>
        <h2>E-commerce with AI</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Talk naturally about products and orders
        </p>
        <ChatController
          config={config}
          saasType="ecommerce"
          anthropicApiKey={process.env.REACT_APP_ANTHROPIC_API_KEY}
          useLLMParsing={true}
          height="500px"
        />
      </div>
      <div style={{ fontSize: '12px', color: '#666', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Try natural phrasing:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px', lineHeight: '1.6' }}>
{`✅ Exact syntax:
"add product Blue T-Shirt $24.99"
"update Blue T-Shirt stock to 150"

✅ Natural language:
"we've got a new blue tee for $25"
"only 150 blue shirts left in stock"
"how many blue shirts do we have?"
"i need to create an order for Maria"
"maria ordered 2 jeans and a hoodie"`}
        </pre>
      </div>
    </div>
  );
}

/**
 * Example 3: Logistics with AI understanding
 * Talk about shipments naturally
 */
export function LogisticsWithAIExample() {
  const config = variantConfig('logistics', 'FleetMaster');

  const tools = {
    create_shipment: async (params: any) => {
      return `📦 Shipment created: ${params.origin} → ${params.destination}`;
    },
    track_shipment: async (params: any) => {
      return `📍 ${params.tracking_id}: In transit. ETA 2:30 PM`;
    },
    assign_driver: async (params: any) => {
      return `👤 Assigned to ${params.driver}. Route optimized.`;
    },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px' }}>
      <div>
        <h2>Logistics with AI</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Chat naturally about deliveries
        </p>
        <ChatController
          config={config}
          saasType="logistics"
          anthropicApiKey={process.env.REACT_APP_ANTHROPIC_API_KEY}
          useLLMParsing={true}
          height="500px"
        />
      </div>
      <div style={{ fontSize: '12px', color: '#666', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Natural shipment talk:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px', lineHeight: '1.6' }}>
{`✅ Strict pattern:
"create shipment from Santo Domingo to Santiago"
"track SHIP-89234"

✅ Natural speech:
"shipment from SD to santiago"
"can you check on SHIP-89234?"
"where's the package going to santiago?"
"assign this to carlos"
"who's delivering it?"`}
        </pre>
      </div>
    </div>
  );
}

/**
 * Configuration note for real usage
 */
export function ConfigurationGuide() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#fffbea', borderRadius: '8px', margin: '20px', border: '1px solid #ffd480' }}>
      <h3>🔑 Setup Required</h3>
      <p>To enable LLM parsing in your app:</p>
      <pre style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`// In your .env.local
REACT_APP_ANTHROPIC_API_KEY=sk-ant-v1-xxx...

// In your component
<ChatController
  config={config}
  saasType="fe_pos"
  anthropicApiKey={process.env.REACT_APP_ANTHROPIC_API_KEY}
  useLLMParsing={true}  // Enable AI parsing
/>

// Or without LLM (falls back to regex)
<ChatController
  config={config}
  saasType="fe_pos"
  useLLMParsing={false}  // Disable AI, use regex only
/>`}
      </pre>
      <p style={{ color: '#666', fontSize: '12px', marginTop: '12px' }}>
        ℹ️ LLM parsing is optional. If <code>anthropicApiKey</code> is not provided, it automatically falls back to regex pattern matching.
      </p>
    </div>
  );
}

/**
 * Impact comparison
 */
export function ComparisonBefore() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f4ff', borderRadius: '8px', margin: '20px', border: '1px solid #8b9cc4' }}>
      <h3>❌ Before (Regex Only)</h3>
      <p style={{ color: '#666', marginBottom: '12px' }}>Users must use exact commands:</p>
      <ul style={{ color: '#333', lineHeight: '1.8' }}>
        <li>✗ "i need to bill acme 2.5k" — ❌ Not recognized</li>
        <li>✗ "invoice acme 2500" — ❌ Not recognized</li>
        <li>✗ "send an invoice to acme for twenty-five hundred" — ❌ Not recognized</li>
        <li>✓ "create invoice for AcmeCorp - $2500" — ✅ Works</li>
      </ul>
    </div>
  );
}

export function ComparisonAfter() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0fff4', borderRadius: '8px', margin: '20px', border: '1px solid #8bb88f' }}>
      <h3>✅ After (LLM Parsing)</h3>
      <p style={{ color: '#666', marginBottom: '12px' }}>Users can speak naturally. Claude understands all:</p>
      <ul style={{ color: '#333', lineHeight: '1.8' }}>
        <li>✓ "i need to bill acme 2.5k" — ✅ Works!</li>
        <li>✓ "invoice acme 2500" — ✅ Works!</li>
        <li>✓ "send an invoice to acme for twenty-five hundred" — ✅ Works!</li>
        <li>✓ "create invoice for AcmeCorp - $2500" — ✅ Still works</li>
      </ul>
    </div>
  );
}

/**
 * Full demo page
 */
export default function AIParserDemoPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>🚀 Level 1: LLM Intent Parsing</h1>
      <p style={{ color: '#666', marginBottom: '40px', maxWidth: '600px' }}>
        Claude understands natural language commands. No more strict regex patterns. Users can say things naturally, and the AI parses the intent.
      </p>

      <ComparisonBefore />
      <ComparisonAfter />

      <h2 style={{ marginTop: '60px' }}>Live Demo</h2>
      <ConfigurationGuide />

      <FEPOSWithAIExample />
      <EcommerceWithAIExample />
      <LogisticsWithAIExample />

      <div style={{ marginTop: '60px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Impact</h3>
        <ul style={{ color: '#333', lineHeight: '2' }}>
          <li>🎯 <strong>10x better UX</strong> — Natural language support</li>
          <li>⚡ <strong>Instant fallback</strong> — Regex works if LLM fails</li>
          <li>🔐 <strong>Private</strong> — Your Anthropic API key, controlled by you</li>
          <li>💰 <strong>Cost-effective</strong> — ~$0.01 per complex command</li>
          <li>🛡️ <strong>Robust</strong> — Confidence scores ensure accuracy</li>
        </ul>
      </div>
    </div>
  );
}
