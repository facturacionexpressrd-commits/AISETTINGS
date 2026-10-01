/**
 * Complete Examples: 5 SaaS Variants with Intricate Chat Control
 * LeadGen, WhatsApp Omnichannel, E-commerce, Logistics, FE POS
 */

'use client';

import React, { useCallback } from 'react';
import { ChatController, SaasChatController } from '@aisettings/core/components/chat';
import { variantConfig, parseCommand, getCommandHelp } from '@aisettings/core';
import type { SaaS } from '@aisettings/core';

/**
 * 1️⃣ LeadGen SaaS — Full lead lifecycle control
 */
export function LeadGenExample() {
  const config = variantConfig('leadgen', 'ProspectAI');

  const tools = {
    create_lead: async (params: any) => `✅ Lead "${params.name}" created. Ready to qualify.`,
    qualify_lead: async (params: any) => `🎯 Lead qualified as ${params.score}. Added to nurture.`,
    add_to_campaign: async (params: any) => `📧 Started "${params.campaign}" for ${params.prospect}. 3-email sequence active.`,
    send_email: async (params: any) => `📬 Follow-up sent to ${params.prospect}. Opens tracked.`,
    schedule_call: async (params: any) => `📞 Call scheduled: ${params.prospect} on ${params.date} at ${params.time}. Calendar invite sent.`,
    list_hot_leads: async () => `🔥 Top 5 hot leads:\n1. John Acme Corp (95 score)\n2. Sarah Tech LLC (88)\n3. Mike SaaS Inc (85)...`,
    get_lead_score: async (params: any) => `📊 ${params.name}: 78/100. Warm. Recommend follow-up within 3 days.`,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px' }}>
      <div>
        <h2>Lead Generation SaaS</h2>
        <ChatController config={config} saasType="leadgen" height="500px" />
      </div>
      <div style={{ fontSize: '12px', color: '#666', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Try these commands:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
{`create lead John Doe
qualify John Doe as hot
add John Doe to sales_nurture campaign
send email to John Doe
schedule call with John Doe on 2024-01-15 at 2pm
show hot leads
lead score for John Doe`}
        </pre>
      </div>
    </div>
  );
}

/**
 * 2️⃣ WhatsApp Omnichannel — Unified messaging control
 */
export function WhatsAppOmnichanelExample() {
  const config = variantConfig('whatsapp_omnichannel', 'MessageHub');

  const tools = {
    route_message: async (params: any) => `🎯 Routed ${params.customer} to ${params.team} team. Assignment confirmed.`,
    send_broadcast: async (params: any) => `📢 Broadcast sent to 2,341 subscribers: "${params.message.slice(0, 50)}..."`,
    sync_contacts: async (params: any) => `🔄 Synced ${params.channel} contacts. 152 new, 47 updated.`,
    merge_conversations: async (params: any) => `🔗 Merged conversations. All history combined.`,
    send_template: async (params: any) => `✉️ Sent "${params.name}" template. Delivery pending.`,
    view_queue: async () => `📋 Queue by channel:\n• WhatsApp: 12 pending\n• Instagram DM: 5\n• Messenger: 3\n• SMS: 1`,
    set_auto_reply: async (params: any) => `⏰ Auto-reply set for ${params.channel}: "${params.message}"`,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px' }}>
      <div>
        <h2>WhatsApp Omnichannel</h2>
        <ChatController config={config} saasType="whatsapp_omnichannel" height="500px" />
      </div>
      <div style={{ fontSize: '12px', color: '#666', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Try these commands:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
{`route customer_123 to sales_team
broadcast Thanks for your purchase!
sync whatsapp contacts
merge conv_ABC and conv_DEF
template welcome_message
show queue
set whatsapp to auto-reply Out of office`}
        </pre>
      </div>
    </div>
  );
}

/**
 * 3️⃣ E-commerce SaaS — Full store control
 */
export function EcommerceSaaSExample() {
  const config = variantConfig('ecommerce', 'ShopPro');

  const tools = {
    create_product: async (params: any) => `✅ Product "${params.name}" created. Price: $${params.price}. Live now.`,
    set_inventory: async (params: any) => `📦 Stock updated: "${params.product}" → ${params.quantity} units.`,
    create_order: async (params: any) => `🛒 Order created for ${params.customer}. Items: ${params.items}. Total: $342.50.`,
    ship_order: async (params: any) => `📤 Shipped! ${params.order_id}. Tracking: FX-8472-9301. Email sent.`,
    apply_discount: async (params: any) => `💰 Applied ${params.percent}% discount to "${params.product}". New price: $17.99.`,
    analytics_top_products: async () => `📊 Top sellers this week:\n1. Blue T-Shirt (847 sold)\n2. Jeans Classic (612)\n3. Hoodie Premium (498)`,
    refund_order: async (params: any) => `🔄 Refund processed for ${params.order_id}. $89.99 returned. Refund email sent.`,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px' }}>
      <div>
        <h2>E-commerce SaaS</h2>
        <ChatController config={config} saasType="ecommerce" height="500px" />
      </div>
      <div style={{ fontSize: '12px', color: '#666', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Try these commands:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
{`add product Blue T-Shirt $24.99
update Blue T-Shirt stock to 150
create order for Maria - 2x Jeans, 1x Hoodie
ship order ORD-12345
discount Blue T-Shirt by 20%
show top sellers
refund order ORD-12345`}
        </pre>
      </div>
    </div>
  );
}

/**
 * 4️⃣ Logistics SaaS — Delivery fleet control
 */
export function LogisticsSaaSExample() {
  const config = variantConfig('logistics', 'FleetMaster');

  const tools = {
    create_shipment: async (params: any) => `📦 Shipment created: ${params.origin} → ${params.destination}. ID: SHIP-89234.`,
    track_shipment: async (params: any) => `📍 ${params.tracking_id}: In transit. Last stop: Sorting facility. ETA: 2:30 PM.`,
    assign_driver: async (params: any) => `👤 Assigned to "${params.driver}". Driver notified. Route optimized.`,
    optimize_route: async (params: any) => `🗺️ Route optimized for 12 stops. Est. 3hr 45min. Savings: 28km.`,
    list_unassigned: async () => `📋 Unassigned: 17 deliveries. Estimated cost if delayed: $340.`,
    reschedule_delivery: async (params: any) => `📅 Rescheduled ${params.shipment} to ${params.date}. Customer notified.`,
    fleet_analytics: async () => `🚗 Fleet status:\n• 45 active drivers\n• 8 on break\n• 12 completed (today)\n• Avg delivery time: 22min`,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px' }}>
      <div>
        <h2>Logistics SaaS</h2>
        <ChatController config={config} saasType="logistics" height="500px" />
      </div>
      <div style={{ fontSize: '12px', color: '#666', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Try these commands:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
{`create shipment from Santo Domingo to Santiago
track SHIP-89234
assign SHIP-89234 to Carlos
optimize route for SHIP-89234
show unassigned deliveries
delay shipment SHIP-89234 to 2024-01-20
fleet status`}
        </pre>
      </div>
    </div>
  );
}

/**
 * 5️⃣ Facturación Express POS — Invoice & compliance control
 */
export function FEPOSExample() {
  const config = variantConfig('fe_pos', 'FERD POS');

  const tools = {
    create_invoice: async (params: any) => `📄 Invoice created: NCF 001-01-0001234 for ${params.customer}. Amount: $${params.amount}. Sent via email.`,
    validate_ncf: async (params: any) => `✅ ${params.ncf} is valid. Registered with DGII. Compliance: OK.`,
    record_payment: async (params: any) => `💳 Payment recorded: ${params.customer} paid $${params.amount}. Balance: $0.`,
    tax_report: async (params: any) => `📊 Tax report for Jan 2024 generated. ISR: $12,450 | ITBIS: $8,340. File ready for DGII.`,
    apply_retention: async (params: any) => `🔐 Retention applied to ${params.invoice}. Withheld: $500 (services tax).`,
    daily_analytics: async () => `💰 Daily sales (today):\n• Total: $4,280 | 34 transactions\n• Cash: 60% | Card: 40%\n• Top category: Servicios (55%)`,
    export_data: async (params: any) => `📥 ${params.report_type} exported. File: sales_jan_2024.xlsx ready to download.`,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px' }}>
      <div>
        <h2>Facturación Express POS</h2>
        <ChatController config={config} saasType="fe_pos" height="500px" />
      </div>
      <div style={{ fontSize: '12px', color: '#666', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Try these commands:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
{`create invoice for AcmeCorp - $2500
validate ncf 001-01-0001234
payment received from Cliente ABC - $1500
generate tax report for January
apply retention to INV-456
show daily sales
export sales_report to excel`}
        </pre>
      </div>
    </div>
  );
}

/**
 * Master demo — All 5 types
 */
export default function AllSaaSDemosPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <h1>🎯 Intricate SaaS Chat Controls</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        Five fully-featured SaaS platforms controlled entirely through chat. Keyboard-first, mouse-optional.
      </p>

      <h2 style={{ marginTop: '60px' }}>1. Lead Generation</h2>
      <LeadGenExample />

      <h2 style={{ marginTop: '60px' }}>2. WhatsApp Omnichannel</h2>
      <WhatsAppOmnichanelExample />

      <h2 style={{ marginTop: '60px' }}>3. E-commerce</h2>
      <EcommerceSaaSExample />

      <h2 style={{ marginTop: '60px' }}>4. Logistics</h2>
      <LogisticsSaaSExample />

      <h2 style={{ marginTop: '60px' }}>5. Facturación Express POS</h2>
      <FEPOSExample />
    </div>
  );
}
