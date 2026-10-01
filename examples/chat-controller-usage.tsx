/**
 * Chat Controller Usage Examples
 * Wire the chat box to your SaaS backend
 */

'use client';

import React, { useCallback } from 'react';
import { ChatController, SaasChatController, type ChatMessage } from '@aisettings/core/components/chat';
import { variantConfig } from '@aisettings/core';

/**
 * Example 1: E-commerce with chat-driven orders
 * User: "Order 2 blue shoes size 10"
 * Chat parses → calls createOrder → confirms
 */
export function EcommerceChatExample() {
  const config = variantConfig('ecommerce', 'TiendaXYZ');

  const handleAction = useCallback(async (action: string, params: Record<string, any>) => {
    switch (action) {
      case 'create_order':
        const orderId = `ORD-${Date.now()}`;
        return `✅ Order created! Order ID: ${orderId}. You'll receive it in 2-3 business days.`;

      case 'get_order_status':
        return `📦 Your order is being prepared. Estimated delivery: Friday.`;

      case 'create_contact':
        return `✅ Contact saved! Name: ${params.name}`;

      default:
        return `Got it: ${action}`;
    }
  }, []);

  return (
    <div style={{ width: '400px' }}>
      <h2>Shop Chat</h2>
      <ChatController
        config={config}
        onAction={handleAction}
        height="500px"
        placeholder="Try: 'order 2 blue shoes' or 'check order status'"
      />
    </div>
  );
}

/**
 * Example 2: Booking platform with calendar control
 * User: "Book me tomorrow at 3pm"
 * Chat → checks availability → creates appointment
 */
export function BookingChatExample() {
  const config = variantConfig('booking', 'SalonXYZ');

  const handleAction = useCallback(async (action: string, params: Record<string, any>) => {
    switch (action) {
      case 'book_appointment':
        return `📅 Appointment confirmed! Haircut tomorrow at 3:00 PM. See you then!`;

      case 'update_contact':
        return `✅ Updated! Remember to bring your insurance card.`;

      default:
        return `Processing: ${action}`;
    }
  }, []);

  return (
    <div style={{ width: '400px' }}>
      <h2>Booking System</h2>
      <ChatController
        config={config}
        onAction={handleAction}
        height="500px"
        placeholder="Try: 'book appointment tomorrow at 2pm' or 'update my phone'"
      />
    </div>
  );
}

/**
 * Example 3: Invoicing with chat-driven document access
 * User: "Show me invoice from March"
 * Chat → queries database → displays
 */
export function InvoicingChatExample() {
  const config = variantConfig('invoicing', 'FERD');

  const tools = {
    answer_faqs: async (params: { query: string }) => {
      return `📚 DGII Regulation 112-06: ${params.query}\nSee our knowledge base for more.`;
    },
    create_contact: async (params: { name: string }) => {
      return `✅ Added ${params.name} to your contacts.`;
    },
    transfer_to_employee: async () => {
      return `🤝 Transferring to our accounting specialist...`;
    },
  };

  return (
    <div style={{ width: '400px' }}>
      <h2>Invoice Support</h2>
      <SaasChatController
        config={config}
        tools={tools}
        height="500px"
        placeholder="Try: 'What is NCF?' or 'transfer to specialist'"
      />
    </div>
  );
}

/**
 * Example 4: CRM with full lead management
 * Fully keyboard-driven: create leads, follow up, check status
 */
export function CRMChatExample() {
  const config = variantConfig('crm', 'SalesHub');

  const tools = {
    create_contact: async (params: { name: string }) => {
      const contactId = `CONT-${Date.now()}`;
      return `✅ Lead created: "${params.name}" (${contactId}). Ready to follow up!`;
    },
    qualify_leads: async (params: { description: string }) => {
      return `🎯 Lead score: 8/10. High priority. Recommend immediate follow-up.`;
    },
    create_followup: async (params: { description: string }) => {
      return `⏰ Follow-up scheduled for tomorrow at 10 AM. ${params.description}`;
    },
  };

  return (
    <div style={{ width: '400px' }}>
      <h2>CRM Chat</h2>
      <SaasChatController
        config={config}
        tools={tools}
        height="500px"
        placeholder="Try: 'create contact John Doe' or 'follow up on sales call'"
      />
    </div>
  );
}

/**
 * Example 5: Multi-tool chatbot with natural language
 * User can type naturally OR use command syntax
 */
export function SmartChatExample() {
  const config = variantConfig('generic', 'MyApp');

  const handleMessage = useCallback(async (message: string) => {
    // Call your LLM API here
    // const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message, config }) });
    // return await response.json();

    // For demo:
    if (message.toLowerCase().includes('help')) {
      return `You can:
• "Create contact [name]"
• "Book appointment [when]"
• "Check order status"
• "Follow up [details]"
• Ask me anything else!`;
    }

    return `You said: "${message}". I received it! 😊`;
  }, []);

  return (
    <div style={{ width: '400px' }}>
      <h2>Universal Chat</h2>
      <ChatController
        config={config}
        onMessage={handleMessage}
        height="500px"
        showTimestamp={true}
      />
    </div>
  );
}

/**
 * Keyboard shortcuts reference (always available)
 */
export function ChatShortcuts() {
  return (
    <div style={{ fontSize: '12px', color: '#666', marginTop: '12px' }}>
      <p>
        <strong>Keyboard:</strong>
      </p>
      <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
        <li>
          <code>Enter</code> → Send
        </li>
        <li>
          <code>Shift+Enter</code> → New line
        </li>
        <li>
          <code>Escape</code> → Clear
        </li>
        <li>
          <code>Tab</code> → Focus input
        </li>
      </ul>
    </div>
  );
}

/**
 * Embedded in a Next.js page
 */
export default function Page() {
  return (
    <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <EcommerceChatExample />
      <BookingChatExample />
      <CRMChatExample />
      <InvoicingChatExample />
      <ChatShortcuts />
    </div>
  );
}
